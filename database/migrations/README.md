# Base de datos y migraciones

Este prototipo no utiliza una base de datos persistente: el backend mantiene datos sintéticos en memoria y los reinicializa al arrancar.

Por eso no existen migraciones SQL aplicables en esta versión `0.1.0`. Esta carpeta se incluye para dejar explícita la decisión y reservar el lugar para futuras migraciones cuando se defina una base institucional real.

Antes de incorporar datos reales deberán definirse:

- esquema y motor de base de datos;
- migraciones versionadas y reversibles;
- cifrado y gestión de secretos;
- roles de acceso y auditoría;
- retención, respaldo y restauración;
- pruebas de migración y rollback.
