# Informe de Etapa 1 — Base técnica

## Qué se construyó

Se inicializó el proyecto WebDev administrado `Mi UCSF — Autogestión Académica` con servidor y base de datos habilitados en la configuración del proyecto. La implementación de esta etapa incluye:

- Aplicación React + TypeScript + Vite con servidor Fastify.
- Configuración inicial, `package-lock.json`, `plan.md`, `.env.example` y README.
- Manifiesto estático `public/manus-routes.json` con las rutas estructurales de la etapa.
- Acceso sintético con matrícula, correo institucional y clave.
- Sesión mediante cookie `HttpOnly`; en Preview HTTPS se verificó `Secure; SameSite=None`.
- Roles `ESTUDIANTE` y `BEDELIA`, determinados y controlados en el servidor.
- Guardas para bloquear rutas de otro rol, tanto en interfaz como en API.
- Límite progresivo de intentos de login y mensajes en español.
- Contrato `AcademicAdapter` y perfil sintético preparado para futuras fuentes autorizadas.
- Pantallas estructurales de acceso, Inicio, Área de estudiante y Panel de Bedelía.
- Semillas ficticias rotuladas; no se copiaron datos personales de capturas o videos.
- Marca gráfica sintética para metadata del proyecto, sin reproducir el escudo institucional real.

No se implementaron todavía avisos funcionales, notificaciones de negocio, horarios oficiales, aulas, documentos, agenda, historial, exportaciones ni la réplica fiel de las funciones existentes. Eso queda reservado para las etapas aprobadas siguientes.

## Etiquetas cubiertas

`{etapa_1}`, `{funcion_1}`, `{funcion_13}`, `{funcion_30}`, `{entrada_1}`, `{entrada_2}`, `{entrada_13}`, `{entrada_14}`, `{proceso_1}`, `{proceso_2}`, `{concepto_1}`, `{concepto_2}`, `{concepto_16}`, `{concepto_17}`, `{pantalla_1}`, `{pantalla_10}`, `{fuente_9}`, `{error_1}`, `{error_2}`, `{error_3}`, `{error_5}`, `{seguridad_1}`, `{seguridad_3}`, `{seguridad_4}`, `{accesibilidad_1}`, `{accesibilidad_2}`, `{accesibilidad_3}`, `{accesibilidad_4}`, `{accesibilidad_5}`, `{accesibilidad_6}`, `{accesibilidad_8}`, `{privacidad_3}`, `{observabilidad_2}`.

## Pruebas ejecutadas

| Prueba | Resultado | Evidencia |
|---|---|---|
| `{prueba_1}` | **APROBADA** | Login válido de Estudiante; credenciales inválidas devuelven el mensaje definido; campos vacíos devuelven el mensaje de obligatorios. |
| `{prueba_11}` | **APROBADA** | Login válido de Bedelía; el rol recibido es `BEDELIA`. |
| `{prueba_21}` | **APROBADA** | Estudiante autenticado recibe HTTP 403 al solicitar `/api/bedelia/summary`; Bedelía recibe HTTP 403 al solicitar `/api/student/profile`. |
| `{prueba_29}` | **PENDIENTE POR ALCANCE** | Las pantallas que deben mostrar el mensaje estándar de información insuficiente se construirán junto con sus módulos funcionales; esta etapa no presenta datos institucionales que consultar. |
| `{prueba_50}` | **APROBADA** | Luego de cinco intentos fallidos para una identidad sintética, el siguiente intento recibe HTTP 429 y el mensaje “Realizaste demasiados intentos. Esperá unos minutos o recuperá tu acceso.” |

### Verificaciones técnicas adicionales

- `npm run typecheck`: **APROBADA**.
- `npm run build`: **APROBADA**.
- `npm run check:routes`: **APROBADA**, cinco rutas válidas y no duplicadas.
- `GET /api/health`: **APROBADA**, devuelve etapa 1 y `synthetic: true`.
- Preview HTTPS: **APROBADA**, HTML, API y manifest responden.
- Cookie de sesión: **APROBADA**, contiene `HttpOnly`, `Secure` y `SameSite=None` en Preview.
- Perfil académico sintético: **APROBADA**, se entrega solo a Estudiante autenticado.
- Escaneo de código, semillas y assets: **APROBADA**, sin nombres, matrículas reales, domicilios, teléfonos, salud o pagos reales.
- Captura visual mobile-first de `/login` a 375 px: **APROBADA** para la estructura provisional de esta etapa.

## Resultado de la regresión de funciones existentes

**NO EJECUTADA EN ESTA ETAPA.** La línea base de las funciones existentes se construirá en `{etapa_2}`, cuando se cuente con capturas/video o referencias visuales suficientes. La base técnica actual no modifica ninguna de las 24 funciones existentes ni pretende declararlas reproducidas.

## Problemas detectados

1. Durante la primera inspección, el fallback de rutas SPA devolvía HTTP 500 porque el plugin estático no exponía `sendFile`; se corrigió eliminando la desactivación del decorador y se repitió la prueba con resultado correcto.
2. La inspección inicial de datos sensibles produjo un falso positivo porque el README menciona palabras de categorías prohibidas para documentar qué no se debe usar. Se repitió el escaneo sobre código, semillas y assets, excluyendo documentación normativa, y no se detectaron datos reales.
3. No hay un fallo abierto de la Etapa 1.

## [SUPUESTO] utilizados en esta etapa

- Las cuentas de demostración son ficticias, se mantienen en memoria y se documentan en README; no representan cuentas institucionales reales.
- La persistencia de sesiones y semillas es de proceso para esta etapa; el modelo durable y las migraciones se ampliarán antes de depender de datos persistentes.
- `LOCAL_HTTP=true` se reserva para desarrollo local; Preview usa cookie segura para HTTPS.
- Los valores visuales son provisionales y no deben tomarse como réplica de Mi UCSF.
- No se consultaron fuentes externas ni el sistema real.

## Decisiones pendientes para mí

1. Confirmar el cierre de `{etapa_1}` con la frase exacta `APROBADO ETAPA 1`.
2. Antes de `{etapa_2}`, entregar o validar las capturas/video y referencias visuales necesarias para reproducir fielmente la plataforma existente.
3. Confirmar, si se desea modificar, las decisiones humanas ya propuestas en Etapa 0 sobre login, menú, adjuntos, umbral de vencimiento, categorías, retenciones, subroles, autoregistro y zoom.

Etapa 1 completa. Esperando APROBADO ETAPA 1.
