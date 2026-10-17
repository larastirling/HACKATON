import { useState } from 'react'

const ITEMS = ['Cuentas', 'Transferencias', 'Tarjetas', 'Inversiones', 'Préstamos', 'Seguros', 'Ayuda']

export default function Explore() {
  const [query, setQuery] = useState('')
  const results = ITEMS.filter((i) => i.toLowerCase().includes(query.toLowerCase()))

  return (
    <div className="stack">
      <input
        className="search"
        type="search"
        placeholder="Buscar…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <ul className="list card">
        {results.map((item) => (
          <li key={item} className="list__item">{item}</li>
        ))}
        {results.length === 0 && <li className="list__item muted">Sin resultados</li>}
      </ul>
    </div>
  )
}
