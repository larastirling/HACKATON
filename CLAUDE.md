# Instrucciones para Claude Code en este proyecto

## Cuidar la clave de Anthropic: cada llamada a la IA cuesta plata

- Usá la IA real (la API de Anthropic) en tus pruebas solo lo mínimo e indispensable: uno o dos mensajes para confirmar que algo anda.
- Nunca corras evaluaciones completas (por ejemplo `evaluacion/`) ni charlas largas de prueba sin que la persona te lo pida explícitamente.
- Para probar que el código funciona, preferí revisar el código, compilar (`npx tsc --noEmit`) y usar respuestas de IA simuladas.
- Al final de cada tarea, decí cuántas llamadas a la IA real hiciste.
