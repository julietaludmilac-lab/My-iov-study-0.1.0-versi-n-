# Informe de Etapa 5 — Notificaciones y novedades

## Entrega

Se integraron las notificaciones de avisos y cambios al centro existente `#notificaciones` y a la tarjeta **Notificaciones sin leer** de Inicio. Se conservaron los mensajes legacy de la plataforma y se agregaron las novedades de avisos con título, mensaje, fecha, estado de lectura y acción **ABRIR**.

El servidor mantiene un repositorio sintético idempotente en `server/notifications.ts`. Cada evento se identifica por estudiante, aviso y tipo de evento; una consulta repetida no duplica notificaciones. La publicación de Bedelía genera el evento únicamente para perfiles cuya audiencia coincide. Los borradores y las audiencias no pertinentes no generan notificaciones.

## Funciones implementadas

- `GET /api/student/notifications`: lista de notificaciones del Estudiante y contador de no leídas.
- `POST /api/student/notifications/:id/read`: marca como leída una notificación propia y recalcula el contador.
- Publicación de Bedelía conectada a la generación de eventos `PUBLICACION`.
- Sincronización de avisos seed publicados sin duplicados.
- Centro visual con separación entre **Notificaciones existentes** y **Novedades de avisos**.
- Tarjeta de Inicio con novedades sin leer y acceso **VER TODAS**.
- Apertura del aviso origen desde una notificación; la navegación no queda bloqueada si el marcado ocurre en segundo plano.

## Validaciones realizadas

- `npm run typecheck`: **APROBADA**.
- `npm run build`: **APROBADA**.
- `npm run check:routes`: **APROBADA**, 30 rutas declaradas.
- Tres notificaciones seed permanecen idempotentes en consultas repetidas.
- Publicar un aviso dirigido a la carrera sintética generó exactamente una notificación adicional.
- Una segunda consulta no generó duplicados.
- Marcar como leída redujo el contador de no leídas.
- Un Estudiante no pudo acceder a `/api/bedelia/notices` y recibió `403`.
- Preview: la tarjeta de Inicio muestra novedades, `#notificaciones` muestra el centro integrado y **ABRIR** lleva al detalle correcto del aviso.
- El diagnóstico TypeScript gestionado por WebDev permanece registrado.

## Corrección aplicada durante la validación

El generador de avisos comenzaba nuevos IDs en `4`, coincidiendo con el aviso vencido seed `notice-4`. Se corrigió el siguiente ID inicial a `5` para impedir reemplazos y garantizar la idempotencia de notificaciones.

## Límites

La persistencia es sintética y en memoria. Los eventos de horarios, documentos y agenda personal pertenecen a Etapas 6, 7 y 8. Las notificaciones de otros tipos de información legacy continúan representadas por los mensajes existentes y no se transforman en eventos nuevos en esta etapa.

## Corrección posterior

Se separaron las rutas del drawer que antes compartían la misma pantalla. **Avisos y novedades** muestra el listado completo de avisos pertinentes con sus filtros; **Novedades** muestra exclusivamente avisos nuevos o actualizados, con un banner propio, contador de novedades y texto que explica la reducción del listado.

Etapa 5 completa. Esperando APROBADO ETAPA 5.
