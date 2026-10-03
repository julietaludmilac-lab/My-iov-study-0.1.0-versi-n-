# Informe de implementación — Etapa 10

## Estado

**Implementada y validada.** Se completó el endurecimiento del MVP en accesibilidad, privacidad, seguridad y observabilidad, sin cambiar el alcance funcional de las Etapas 1–9.

## Qué se construyó

### Accesibilidad

- Mensajes de error y estado con `aria-live`.
- Foco visible consistente para controles de teclado.
- Botones deshabilitados con estado visual y cursor explícitos.
- Cierre de modales de comisiones y exámenes mediante `Escape`, además de los botones existentes.
- `prefers-reduced-motion` para reducir transiciones y animaciones.
- Se mantuvo el viewport sin bloqueo de zoom y las áreas táctiles mínimas existentes.

### Seguridad

- Cabeceras `Content-Security-Policy`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-Opener-Policy` y HSTS fuera del modo HTTP local.
- No se agregó `X-Frame-Options DENY/SAMEORIGIN` ni `frame-ancestors 'self'`, para conservar compatibilidad con Preview embebido.
- Token CSRF sincronizado: cookie no HttpOnly + encabezado `x-csrf-token` para mutaciones de API.
- Cookies de sesión mantienen `HttpOnly`, `Secure`, `SameSite=None` en Preview y expiración de ocho horas.
- Validación de tipo y longitud de payloads administrativos de avisos.
- Respuestas de error inesperado con identificador opaco y detalle técnico solo en el registro.
- Actualización de `@fastify/static` a `10.1.5` para corregir vulnerabilidades altas de traversal y bypass de rutas.

### Privacidad

- Se conservaron exclusivamente datos sintéticos.
- Las exportaciones no incluyen contraseñas, tokens, datos de salud, datos de pago ni domicilios.
- Se mantuvo el aislamiento por rol y pertinencia del estudiante.
- Los documentos internos continúan detrás de una ruta protegida y no se convierten en enlaces públicos.

### Observabilidad

- Nuevo módulo `server/security.ts` con registros JSON estructurados.
- Eventos de login correcto/fallido, permisos denegados, CSRF rechazado, creación, actualización, publicación, vencimiento, restauración, exportación, logout, errores inesperados y arranque.
- Cada registro incluye timestamp ISO, nivel, actor seudónimo, rol, recurso, resultado y correlación.
- No se registran contraseñas, cookies, tokens, contenido de documentos ni datos sensibles.
- Procedimiento sintético de respaldo y recuperación documentado.

## Etiquetas cubiertas

`{accesibilidad_2}`, `{accesibilidad_3}`, `{accesibilidad_4}`, `{accesibilidad_5}`, `{accesibilidad_6}`, `{accesibilidad_8}`, `{accesibilidad_9}`, `{accesibilidad_10}`, `{privacidad_1}`, `{privacidad_2}`, `{privacidad_3}`, `{privacidad_4}`, `{privacidad_5}`, `{privacidad_6}`, `{privacidad_9}`, `{privacidad_10}`, `{seguridad_1}`, `{seguridad_4}`, `{seguridad_5}`, `{seguridad_6}`, `{seguridad_8}`, `{seguridad_9}`, `{seguridad_10}`, `{seguridad_11}`, `{seguridad_12}`, `{observabilidad_1}`, `{observabilidad_3}`, `{observabilidad_4}`, `{observabilidad_5}`, `{observabilidad_6}`.

## Pruebas ejecutadas

| Prueba | Resultado |
|---|---|
| `npm run typecheck` | **APROBADA** |
| `npm run build` | **APROBADA** |
| `npm run check:routes` — 32 rutas | **APROBADA** |
| `git diff --check` | **APROBADA** |
| Health check devuelve `stage: 10` | **APROBADA** |
| Cabecera CSP presente | **APROBADA** |
| `X-Content-Type-Options: nosniff` presente | **APROBADA** |
| Ausencia de `X-Frame-Options` restrictivo | **APROBADA** |
| Cookie de sesión y cookie CSRF emitidas al login | **APROBADA** |
| Mutación sin CSRF rechazada con HTTP 403 | **APROBADA** |
| Mutación con CSRF válido aceptada | **APROBADA** |
| Estudiante bloqueado en exportaciones de Bedelía | **APROBADA** |
| Respuesta estudiantil sin campos sensibles | **APROBADA** |
| Escaneo del código sin credenciales reales ni datos personales reales | **APROBADA** |
| `npm audit --omit=dev --audit-level=high` después de actualizar dependencia | **APROBADA — 0 vulnerabilidades** |

## Resultado de regresión de funciones existentes

Las Etapas 1–9 mantienen sus rutas, contratos, roles, avisos, notificaciones, horarios, documentos, agenda, historial y exportaciones. La validación TypeScript/Vite y el manifiesto de rutas continuaron pasando. Los cambios de servidor son transversales y solo rechazan mutaciones sin CSRF, como corresponde al endurecimiento.

## Problemas detectados y resueltos

- `@fastify/static` tenía vulnerabilidades altas conocidas en versiones anteriores. Se actualizó a `10.1.5`, se reinstalaron dependencias y la auditoría quedó en cero vulnerabilidades.

## Supuestos y límites

- La conformidad WCAG 2.1 AA es el objetivo del MVP; no se presenta una certificación formal.
- Los datos siguen almacenados en memoria y son sintéticos; el procedimiento de respaldo documentado es de demostración.
- La CSP permite estilos inline por compatibilidad con el shell existente; una futura migración puede eliminar esa excepción.
- No se implementa una política de recuperación de cuenta real ni conexión a proveedores institucionales.

## Decisiones pendientes

1. Confirmar si la Etapa 11 debe ejecutar la batería integral final contra los 20 criterios de la rúbrica.
2. Definir, antes de conectar datos reales, la infraestructura de persistencia, rotación de claves, retención de logs y copias cifradas.
