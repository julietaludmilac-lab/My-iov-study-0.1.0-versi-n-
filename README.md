# My IOV Study — Prototipo académico sintético

## Versión exacta

- **Versión del proyecto:** `0.1.0`
- **Estado:** cierre de Etapa 11
- **Tipo:** prototipo funcional con datos sintéticos en memoria
- **Commit base del repositorio:** `e5355bf2ab8b53ae7e6c240e1505396a5e588747`
- **Node.js recomendado:** `22.x`
- **npm recomendado:** `10.x`

> Este repositorio no utiliza datos reales de estudiantes ni se conecta con servicios institucionales reales. Las cuentas, avisos, horarios, documentos y perfiles son sintéticos.

## Qué incluye

- Frontend React + TypeScript + Vite.
- Backend Fastify + TypeScript.
- Sesiones mediante cookie HttpOnly, roles Estudiante y Bedelía.
- Avisos, novedades, notificaciones y filtros pertinentes.
- Horarios, aulas y modificaciones oficiales sintéticas.
- Documentos PDF sintéticos asociados a avisos.
- Agenda personal del estudiante.
- Gestión administrativa de Bedelía.
- Historial versionado, vencidos, restauración y deshacer/rehacer.
- Exportaciones administrativas JSON/CSV.
- Cabeceras de seguridad, CSRF, validación de entradas y auditoría estructurada.
- Informes de Etapas 1–11 y procedimiento de respaldo/recuperación.

## Requisitos

- Node.js `22.x` o compatible con Node.js moderno.
- npm `10.x` o compatible.
- Git, opcional para versionar el proyecto en GitHub.

## Instalación

Desde la carpeta raíz del proyecto:

```bash
npm ci
```

`package-lock.json` contiene las versiones instaladas. Las dependencias de ejecución se declaran en `package.json`; no se incluye `node_modules` dentro del ZIP para evitar un archivo innecesariamente grande y dependiente del sistema operativo.

## Ejecutar en desarrollo

### Servidor completo

```bash
LOCAL_HTTP=true npm run start
```

El servidor escucha por defecto en:

```text
http://localhost:3000
```

También se puede elegir otro puerto:

```bash
LOCAL_HTTP=true PORT=3113 npm run start
```

El backend sirve el frontend compilado desde `dist/`. Para ver cambios de frontend durante el desarrollo, ejecutá Vite en otra terminal:

```bash
npm run dev
```

Vite queda disponible normalmente en `http://localhost:5173` y las llamadas de API del frontend deben apuntar al servidor Fastify correspondiente si se realiza desarrollo separado.

## Cuentas sintéticas

| Rol | Matrícula | Correo | Clave |
|---|---|---|---|
| Estudiante | `A-2026-001` | `estudiante.demo@ucsf.test` | `Estudiante2026A` |
| Administración / Bedelía | `B-ADMIN-001` | `bedelia.demo@ucsf.test` | `Bedelia2026A` |

Estas cuentas son exclusivamente de demostración. No reutilizar sus claves en un entorno real.

## Validación

Ejecutar desde la raíz:

```bash
npm run typecheck
npm run build
npm run check:routes
npm audit --omit=dev --audit-level=high
git diff --check
```

Descripción de los comandos:

- `typecheck`: verifica TypeScript sin emitir archivos.
- `build`: compila TypeScript y genera el frontend en `dist/`.
- `check:routes`: comprueba el manifiesto público de rutas.
- `npm audit`: revisa vulnerabilidades de dependencias de producción.
- `git diff --check`: detecta errores de whitespace.

## Estructura

```text
contracts/       Contratos y tipos académicos compartidos.
docs/            Documentación por etapa y respaldo/recuperación.
public/          Recursos públicos y manifiesto de rutas.
scripts/         Comprobaciones automatizadas.
server/          Backend Fastify, sesiones, avisos, agenda, documentos y exportaciones.
src/             Frontend React, navegación, pantallas y estilos.
database/        Nota sobre almacenamiento y migraciones del prototipo.
```

## Base de datos y migraciones

Este prototipo **no utiliza una base de datos persistente**. Los datos se inicializan en memoria al arrancar el backend y se pierden al reiniciar el proceso.

La carpeta `database/migrations/` contiene una nota explícita para evitar confundir el prototipo con una aplicación ya conectada a una base institucional. Antes de usar datos reales habría que definir esquema, migraciones, cifrado, control de acceso, retención, copias de seguridad y pruebas de restauración.

## Seguridad y privacidad

- Todas las cuentas y registros son sintéticos.
- Las rutas administrativas requieren rol Bedelía.
- Las mutaciones de API requieren token CSRF.
- La sesión usa cookie HttpOnly y expiración de ocho horas.
- Los documentos se sirven solo mediante rutas protegidas.
- Los registros estructurados no deben contener contraseñas, tokens, contenido documental ni datos personales sensibles.
- La configuración está preparada para Preview HTTPS; en local se puede usar `LOCAL_HTTP=true`.

## Importar en GitHub

1. Crear un repositorio vacío en GitHub.
2. Descomprimir este ZIP.
3. Entrar a la carpeta extraída.
4. Inicializar Git y crear el primer commit:

```bash
git init
git add .
git commit -m "chore: importar prototipo My IOV Study 0.1.0"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
git push -u origin main
```

No subir archivos `.env` con secretos. El archivo `.env.example` es solo una referencia de configuración.

## Documentación de etapas

- `stage-7-report.md`: documentos adjuntos.
- `stage-8-report.md`: agenda personal.
- `stage-9-report.md`: vencidos, historial y exportaciones.
- `stage-10-report.md`: accesibilidad, privacidad, seguridad y observabilidad.
- `stage-11-report.md`: cierre integral y definición de terminado.
- `plan.md`: plan maestro y trazabilidad.

## Licencia y uso

El proyecto es un prototipo académico sintético preparado para revisión, demostración y carga en GitHub. Antes de una puesta en producción se requiere una revisión institucional, legal, de seguridad, accesibilidad, identidad y persistencia.
