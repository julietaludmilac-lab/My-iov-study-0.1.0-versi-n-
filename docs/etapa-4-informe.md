# Informe de Etapa 4 — Avisos para Estudiante

## Alcance implementado

Se incorporó la consulta de avisos institucionales para la cuenta sintética **Estudiante**, sin alterar las funciones existentes ni habilitar acciones administrativas.

- Inicio ampliado con tarjetas **Avisos y novedades** y **Mi agenda de hoy**.
- Grupo **Avisos y agenda** en el drawer del Estudiante, después de Encuestas y Notificaciones.
- Listado de avisos publicados pertinentes a carrera, nivel, asignatura, matrícula o audiencia general.
- Aislamiento por perfil en servidor: el Estudiante no recibe borradores ni avisos de otra audiencia.
- Detalle con título, contenido, categoría, fechas, destinatarios, carrera, año/nivel, asignatura y fuente.
- Filtros por carrera, año/nivel, asignatura, categoría, estado y rango de fechas.
- Búsqueda libre sobre título y contenido.
- Botón **Quitar filtros**, con restauración del listado original.
- Indicadores textuales e icónicos para Vigente, Próximo a vencer, Vencido y Actualizado.
- Marcas **Nuevo** y **Actualizado** cuando corresponde.

## API y seguridad

- `GET /api/student/notices`: requiere rol `ESTUDIANTE` y devuelve únicamente avisos publicados pertinentes al perfil.
- `GET /api/student/notices/:id`: vuelve a validar en servidor que el aviso corresponda al perfil antes de entregar el detalle.
- Las rutas `/api/bedelia/*` continúan bloqueadas para Estudiante con respuesta `403`.
- Los datos y perfiles son ficticios y están rotulados como sintéticos.

## Validaciones realizadas

- `npm run typecheck`: **APROBADA**.
- `npm run build`: **APROBADA**.
- `npm run check:routes`: **APROBADA**, 30 rutas declaradas.
- API: login Estudiante, consulta pertinente, exclusión de borradores, detalle y bloqueo de Bedelía: **APROBADA**.
- Preview: Inicio ampliado, listado completo, detalle, estado vencido y filtro de carrera: **APROBADA**.
- Filtro aplicado: redujo el listado de 3 a 1 aviso.
- Quitar filtros: restauró el listado original de 3 avisos.
- Diagnósticos TypeScript gestionados por WebDev: registrados para `typescript`.

## Límites de esta etapa

- Las notificaciones de avisos se integrarán al centro existente en la etapa correspondiente de notificaciones.
- La agenda personal permanece en estado vacío demostrativo; fijar eventos se implementará en su etapa específica.
- Los adjuntos se muestran como metadata asociada; la carga y apertura binaria segura quedan para la etapa de documentos.
- Horarios y aulas con modificaciones oficiales no se adelantan en esta etapa.
- La persistencia continúa siendo sintética en memoria.

Etapa 4 completa. Esperando APROBADO ETAPA 4.
