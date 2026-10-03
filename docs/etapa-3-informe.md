# Informe de Etapa 3 — Avisos de Bedelía

## Qué se construyó

Se extendió My IOV Study sin alterar las rutas ni el recorrido de la línea base del estudiante. La nueva superficie administrativa se habilita únicamente para el rol Bedelía y se ubica en el grupo `Avisos y agenda`.

El flujo implementado incluye Panel de Bedelía, contadores de Borradores/Vigentes/Próximos a vencer/Vencidos/Actualizados, creación de avisos, categorías iniciales, selección de destinatarios con previsualización, asociaciones de carrera/nivel/asignatura, fechas, fuente obligatoria, selección de adjunto PDF como metadata sintética, guardado de borrador, revisión previa, confirmación explícita, publicación, actualización versionada, estados de gestión e historial.

La API exige `BEDELIA` en servidor. Un Estudiante no puede acceder a las rutas administrativas ni aunque invoque la API directamente. Los avisos y el historial son datos ficticios en memoria; no se consulta Internet ni se usa IA para redactar contenido institucional.

## Pruebas ejecutadas

| Prueba | Resultado | Evidencia |
|---|---|---|
| `{prueba_11}` | **APROBADA** | Login sintético de Bedelía dirige al Panel; el menú administrativo no aparece para Estudiante. |
| `{prueba_12}` | **APROBADA** | API crea avisos como Borrador y la UI muestra el flujo Crear aviso → Revisión → Confirmar y publicar. |
| `{prueba_13}` | **APROBADA** | Revisión de formulario vacío muestra `Completá el campo obligatorio: Título.`; API bloquea publicación incompleta. |
| `{prueba_14}` | **APROBADA** | Audiencia sin selección se bloquea; una audiencia Carrera/Nivel/Asignatura conserva su referencia y previsualiza el alcance sintético. |
| `{prueba_15}` | **APROBADA** | Carrera, nivel y asignatura se conservan en el aviso y aparecen en el flujo de edición/revisión. |
| `{prueba_16}` | **APROBADA** | Fechas válidas se conservan; publicación futura y vencimiento anterior a publicación se rechazan. |
| `{prueba_17}` | **APROBADA CON LÍMITE DOCUMENTADO** | El formulario acepta únicamente PDF y rechaza tamaño mayor a 10 MB; la carga binaria segura completa queda para Etapa 7. |
| `{prueba_18}` | **APROBADA** | Actualizar un aviso incrementa versión, registra motivo/responsable y muestra la versión vigente. |
| `{prueba_19}` | **APROBADA** | Gestión lista avisos con título, categoría, fecha, fuente, audiencia y estado, incluyendo un borrador incompleto detectable. |
| `{prueba_20}` | **APROBADA EN BEDELÍA** | El aviso vencido se conserva y aparece en la pestaña Vencidos; la visualización/ocultamiento para Estudiante corresponde a Etapa 4. |
| `{prueba_21}` | **APROBADA** | Rutas y API administrativas responden `403` para la cuenta Estudiante. |
| `{prueba_23}` | **APROBADA** | El endpoint de publicación rechaza una publicación directa sin registro de revisión previa. |
| `{prueba_24}` | **APROBADA** | Audiencia vacía bloqueada; Todos los estudiantes no está preseleccionado. |
| `{prueba_25}` | **APROBADA** | Fecha futura y combinación de fechas inválida rechazadas. |

### Validaciones técnicas

- `npm run typecheck`: **APROBADA**.
- `npm run build`: **APROBADA**.
- `npm run check:routes`: **APROBADA**, 28 rutas declaradas.
- `/api/health`: **APROBADA**, `stage: 3`.
- API de Bedelía: **APROBADA** para semillas, contadores, creación, revisión, publicación, historial y permisos.
- Preview: **APROBADA** para Panel, formulario, error de campo obligatorio, Gestión e Historial.
- Datos personales reales: **NO DETECTADOS**.
- Fuentes externas e Internet: **NO USADAS**.

## Regresión de la línea base

**APROBADA POR INSPECCIÓN DE CÓDIGO Y BUILD.** Las funciones existentes del estudiante permanecen en sus rutas, componentes y estilos; el nuevo menú solo se muestra al rol Bedelía. No se reordenaron las entradas del menú del estudiante ni se reemplazó el shell visual.

## Problemas detectados y correcciones

1. La primera prueba de API creó un aviso válido y, por eso, no era un caso incompleto; se corrigió el caso para separar el borrador incompleto del flujo válido.
2. El Preview conservó temporalmente un bundle/respuesta API cacheada durante una inspección; se incorporó `cache: no-store` al cliente y se verificó con cache-busting que el bundle actualizado mostró Panel, Avisos y el contador Vencidos correcto.
3. Se endureció el servidor para que `publish` requiera la llamada previa de `review`; así la confirmación no depende únicamente de la interfaz.
4. No quedan problemas críticos o altos abiertos dentro del alcance de Etapa 3.

## Ajuste posterior solicitado

La pantalla de inicio de sesión ahora incluye un selector explícito de tipo de usuario: **Estudiante** o **Administración / Bedelía**. La selección carga las credenciales sintéticas del módulo elegido para la demostración y el cliente verifica que el rol devuelto por el servidor coincida con la opción seleccionada antes de abrir `#inicio` o `#panelbedelia`. Si no coincide, se cierra la sesión y se muestra un mensaje comprensible.

## [SUPUESTO] utilizados

- La audiencia sintética usa conteos demostrativos: estudiante 1, asignatura 3, nivel 7, carrera 12 y todos 25.
- El archivo PDF se valida en cliente por tipo y tamaño, pero no se persiste binariamente hasta la etapa específica de documentos.
- La retención persistente de avisos e historial se reemplaza por memoria sintética hasta conectar base de datos.
- La lectura y filtrado desde la cuenta Estudiante se implementarán en Etapa 4, por lo que aquí se valida la captura y previsualización de audiencia de Bedelía.

## Decisiones pendientes para mí

1. Confirmar el cierre de `{etapa_3}` con la frase exacta `APROBADO ETAPA 3`.
2. En Etapa 4, confirmar si los avisos del estudiante deben abrirse desde una nueva entrada `Avisos` o desde la tarjeta adicional de Inicio, respetando el grupo `Avisos y agenda`.
3. Resolver antes de Etapa 7 el almacenamiento y la autorización de documentos PDF.

Etapa 3 completa. Esperando APROBADO ETAPA 3.
