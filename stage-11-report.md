# Informe final de cierre — Etapa 11

## Estado

**APROBADA para el alcance del MVP sintético.** My IOV Study queda cerrada contra las Etapas 0–10, con Preview público verificado y datos ficticios.

## Cobertura del recorrido integral

### Estudiante

- Login con matrícula, correo institucional y clave.
- Inicio con tarjetas existentes, avisos/novedades, notificaciones y agenda.
- Avisos pertinentes por perfil, filtros, búsqueda, vigencia y novedades.
- Detalle con fuente, fechas, destinatarios y documento asociado.
- Centro de notificaciones con apertura del aviso origen.
- Horarios y aulas con modificaciones y estados sin aula.
- Fijación y eliminación de elementos en agenda.

### Bedelía

- Login diferenciado y permisos administrativos.
- Panel con contadores por estado.
- Creación, revisión, publicación y actualización de avisos.
- Gestión explícita de vencidos sin borrado automático.
- Historial inmutable, comparación y restauración versionada.
- Deshacer/rehacer local antes de guardar.
- Exportaciones protegidas de avisos, historial, horarios, fuentes y documentación.

## Matriz resumida contra la rúbrica

| Área | Resultado |
|---|---|
| Funciones existentes y rutas de la línea base | APROBADA |
| Login y roles | APROBADA |
| Avisos pertinentes y filtros | APROBADA |
| Vigencia y vencidos | APROBADA |
| Notificaciones | APROBADA |
| Horarios y aulas | APROBADA |
| Documentos asociados | APROBADA |
| Agenda personal | APROBADA |
| Gestión administrativa de Bedelía | APROBADA |
| Historial, restauración y trazabilidad | APROBADA |
| Exportaciones | APROBADA |
| Accesibilidad del MVP | APROBADA con objetivo WCAG 2.1 AA, sin certificación formal |
| Privacidad sintética | APROBADA |
| Seguridad, CSRF y permisos | APROBADA |
| Observabilidad | APROBADA |
| Dependencias | APROBADA — 0 vulnerabilidades de producción |
| Vista móvil y Preview público | APROBADA |

## Pruebas finales ejecutadas

- Batería integral de login, perfil, avisos, detalle, documento, notificaciones, horarios, agenda, Bedelía, vencidos y exportaciones: **APROBADA**.
- Mutación sin CSRF: HTTP 403 — **APROBADA**.
- Estudiante intentando acceder a Bedelía: HTTP 403 — **APROBADA**.
- `npm run typecheck`: **APROBADA**.
- `npm run build`: **APROBADA**.
- `npm run check:routes`: **APROBADA**, 32 rutas.
- `npm audit --omit=dev --audit-level=high`: **APROBADA**, 0 vulnerabilidades.
- `git diff --check`: **APROBADA**.
- Health público: `stage: 10`, aplicación disponible — **APROBADA**.

## Definición de terminado

Se considera terminado el MVP porque:

1. Las funciones nuevas de las Etapas 3–10 están implementadas dentro de sus límites aprobados.
2. Las funciones existentes de la Etapa 2 permanecen disponibles y la navegación conserva sus rutas.
3. Los datos son sintéticos y no se transcribieron datos personales de las referencias.
4. El servidor aplica autenticación, roles, pertinencia, CSRF, validación, cabeceras y expiración de sesión.
5. Los eventos críticos tienen trazabilidad estructurada sin secretos.
6. Los entregables de cada etapa están documentados.
7. La aplicación responde desde Preview público.

## Limitaciones conocidas

- Persistencia en memoria: reiniciar el proceso reinicia los cambios de la demostración.
- No se conectan fuentes institucionales reales.
- La conformidad WCAG 2.1 AA no constituye una auditoría o certificación externa.
- La carga binaria persistente y los respaldos cifrados reales quedan fuera del MVP sintético.

## Próximo paso fuera del protocolo

Para una versión institucional real se requerirían revisión de arquitectura con UCSF, adaptadores oficiales, persistencia, gestión de identidades institucional, pruebas de penetración, auditoría formal de accesibilidad, respaldo cifrado y aprobación operativa de Bedelía.
