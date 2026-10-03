# Respaldo y recuperación sintética

## Alcance

My IOV Study utiliza almacenamiento en memoria para la demostración. No se conectan fuentes institucionales reales ni se persisten datos personales reales.

## Respaldo de demostración

1. Detener el proceso de demostración de forma controlada.
2. Conservar el repositorio de código y los archivos sintéticos versionados (`server/notices.ts`, `server/documents.ts`, `server/schedule.ts`, `server/agenda.ts`).
3. No copiar cookies, tokens, logs con datos sensibles ni archivos fuera del inventario sintético.
4. Verificar `npm run typecheck`, `npm run build` y `npm run check:routes` antes de guardar un checkpoint.

## Recuperación

1. Restaurar el checkpoint de código aprobado.
2. Instalar las dependencias fijadas mediante `npm ci`.
3. Ejecutar las tres validaciones anteriores.
4. Iniciar la aplicación con el puerto configurado y comprobar `/api/health`.
5. Repetir login sintético, permisos por rol, documentos, avisos, agenda y exportaciones.

## Al conectar persistencia real

Este procedimiento deberá reemplazarse por copias cifradas, control de acceso, retención definida, pruebas de restauración y registro de auditoría. Las contraseñas, tokens, datos de salud, datos de pago y documentos reservados nunca deben incluirse en respaldos de demostración ni en logs.
