import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

export type NotificationType = 'info' | 'success' | 'warning' | 'error'

export interface AppNotification {
  id: string
  title: string
  body?: string
  type: NotificationType
  createdAt: number
  read: boolean
}

export interface NotifyOptions {
  title: string
  body?: string
  type?: NotificationType
  /** Mostrar notificación del sistema (requiere permiso del navegador). */
  system?: boolean
}

interface NotificationsContextValue {
  notifications: AppNotification[]
  toasts: AppNotification[]
  unreadCount: number
  permission: NotificationPermission | 'unsupported'
  notify: (options: NotifyOptions) => void
  dismissToast: (id: string) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  remove: (id: string) => void
  clearAll: () => void
  requestPermission: () => Promise<void>
}

const STORAGE_KEY = 'qs.notifications'
const TOAST_DURATION_MS = 4000

const NotificationsContext = createContext<NotificationsContextValue | null>(null)

function loadStored(): AppNotification[] {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]') as AppNotification[]
  } catch {
    return []
  }
}

const supportsSystemNotifications = typeof window !== 'undefined' && 'Notification' in window

export function NotificationsProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>(loadStored)
  const [toasts, setToasts] = useState<AppNotification[]>([])
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>(
    supportsSystemNotifications ? Notification.permission : 'unsupported',
  )
  const timers = useRef(new Map<string, number>())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications))
  }, [notifications])

  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach((t) => clearTimeout(t))
  }, [])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
    clearTimeout(timers.current.get(id))
    timers.current.delete(id)
  }, [])

  const notify = useCallback(
    ({ title, body, type = 'info', system = false }: NotifyOptions) => {
      const n: AppNotification = {
        id: crypto.randomUUID(),
        title,
        body,
        type,
        createdAt: Date.now(),
        read: false,
      }
      setNotifications((prev) => [n, ...prev])
      setToasts((prev) => [...prev, n])
      timers.current.set(n.id, window.setTimeout(() => dismissToast(n.id), TOAST_DURATION_MS))

      if (system && supportsSystemNotifications && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/icon.svg' })
      }
    },
    [dismissToast],
  )

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  const remove = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }, [])

  const clearAll = useCallback(() => setNotifications([]), [])

  const requestPermission = useCallback(async () => {
    if (!supportsSystemNotifications) return
    setPermission(await Notification.requestPermission())
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const value = useMemo(
    () => ({
      notifications,
      toasts,
      unreadCount,
      permission,
      notify,
      dismissToast,
      markAsRead,
      markAllAsRead,
      remove,
      clearAll,
      requestPermission,
    }),
    [notifications, toasts, unreadCount, permission, notify, dismissToast, markAsRead, markAllAsRead, remove, clearAll, requestPermission],
  )

  return <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext)
  if (!ctx) throw new Error('useNotifications debe usarse dentro de <NotificationsProvider>')
  return ctx
}
