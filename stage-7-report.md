# Informe de implementación — Etapa 7

## Estado

**Implementada y lista para revisión.** La siguiente etapa no se inicia hasta recibir `APROBADO ETAPA 7`.

## Alcance realizado

- Se incorporó un repositorio backend en memoria para documentos sintéticos (`server/documents.ts`).
- Cada documento conserva metadata segura: `id`, `noticeId`, nombre, formato PDF, MIME, tamaño y contenido sintético rotulado.
- Se asoció `guia-inscripcion-sintetica.pdf` al aviso publicado `notice-1`.
- El detalle del aviso informa si existe un archivo asociado o muestra explícitamente **Sin documento asociado**.
- El estudiante puede abrir el documento desde el detalle; la aplicación muestra un visor interno con nombre, tamaño y contenido sintético.
- Se agregaron estados de carga y mensajes de error comprensibles.

## Seguridad y permisos

- La ruta `GET /api/student/notices/:id/document` exige sesión y rol `ESTUDIANTE`.
- El aviso se resuelve mediante `findStudentNotice`, por lo que solo se puede abrir un documento de un aviso publicado y pertinente al perfil sintético activo.
- El documento solo se devuelve cuando el `noticeId` y `attachmentName` coinciden con la metadata almacenada.
- Una cuenta de Bedelía recibe `403` al intentar usar la ruta del Estudiante.
- No se utilizan datos reales ni se persisten archivos de estudiantes. El almacenamiento es deliberadamente sintético y en memoria.

## Evidencia de validación

| Prueba | Resultado |
|---|---|
| `npm run build` | Correcto: TypeScript y Vite sin errores |
| `npm run check:routes` | Correcto: 30 rutas declaradas |
| `GET /api/health` | Correcto: `stage: 7`, `synthetic: true` |
| Login sintético de Estudiante | Correcto |
| Abrir documento de `notice-1` | Correcto: devuelve PDF sintético y contenido esperado |
| Abrir `notice-2` sin adjunto | Correcto: `404`, “Este aviso no tiene un documento disponible.” |
| Aviso no pertinente/inexistente | Correcto: `404`, sin revelar documento |
| Bedelía intentando abrir documento de Estudiante | Correcto: `403` |
| Agenda y horarios existentes | Conservados; se verificó `GET /api/student/schedule` |
| `git diff --check` | Correcto, sin whitespace inválido |

## Archivos principales

- `server/documents.ts`
- `server/index.ts`
- `server/notices.ts`
- `src/api.ts`
- `src/studentNotices.tsx`
- `src/styles.css`

## Límites deliberados

- La carga binaria real y el almacenamiento persistente no se implementan en esta etapa; el flujo usa almacenamiento sintético en memoria, tal como exige el entorno de demostración.
- La apertura se realiza dentro de la interfaz con un visor sintético; no se expone una URL pública ni se permite descargar un archivo de otro aviso.
- No se inicia la agenda personal ni otra etapa posterior.
