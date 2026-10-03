# Informe de implementación — Etapa 9

## Estado

**Implementada y validada con datos sintéticos.** La etapa cubre historial y gestión de vencidos, restauración versionada, deshacer/rehacer y exportaciones administrativas.

## Qué se construyó

- Gestión administrativa explícita de avisos **Vencidos**: se conservan, no se presentan como vigentes y se registra actor, fecha y nueva entrada de historial al gestionarlos.
- Historial inmutable con versiones, motivo, actor y fecha; la pantalla de Historial permite comparar una versión anterior con la actual.
- Restauración de una versión anterior mediante confirmación y motivo obligatorio. La restauración no sobrescribe el historial: crea una nueva versión marcada como actualizada.
- Deshacer y rehacer en el formulario de Bedelía antes de guardar, con botones de texto **DESHACER** y **REHACER**, y atajos `Ctrl+Z` / `Ctrl+Y`.
- Exportaciones protegidas por rol para avisos, historial, horarios y aulas, fuentes y documentación, en JSON y CSV UTF-8 con BOM.
- Nueva ruta administrativa `#exportaciones`, manteniendo las rutas y el orden visual de las funciones existentes.

## Etiquetas cubiertas

`{funcion_23}`, `{funcion_24}`, `{funcion_26}`, `{funcion_27}`, `{historial_1}`, `{historial_3}`, `{historial_4}`, `{historial_5}`, `{historial_6}`, `{historial_9}`, `{historial_10}`, `{regla_disciplinar_3}`, `{regla_disciplinar_4}`, `{regla_disciplinar_15}`, `{decision_humana_7}`, `{decision_humana_9}`, `{privacidad_9}`, `{seguridad_4}`, `{salida_10}`, `{salida_11}`, `{salida_12}`, `{salida_13}`, `{salida_14}`.

## Pruebas ejecutadas

| Prueba | Resultado |
|---|---|
| `npm run typecheck` | **APROBADA** |
| `npm run build` | **APROBADA** |
| `npm run check:routes` — 32 rutas declaradas | **APROBADA** |
| `git diff --check` | **APROBADA** |
| Health check devuelve `stage: 9` | **APROBADA** |
| Aviso vencido sintético identificado y gestionado explícitamente | **APROBADA** |
| Aviso vencido permanece disponible en la exportación de avisos | **APROBADA** |
| Gestión de vencido genera registro exportable en historial | **APROBADA** |
| Actualización genera una versión histórica | **APROBADA** |
| Restauración sin motivo devuelve HTTP 400 | **APROBADA** |
| Restauración con motivo crea una nueva versión y recupera el snapshot | **APROBADA** |
| Exportaciones JSON y CSV de avisos e historial | **APROBADA** |
| Estudiante bloqueado en gestión de vencidos y exportaciones | **APROBADA** |
| Regresión de rutas, autenticación, avisos y agenda compilada | **APROBADA** |

## Resultado de regresión de funciones existentes

No se modificó el comportamiento de las rutas académicas existentes, avisos del estudiante, documentos, notificaciones, horarios ni agenda. Los cambios son aditivos: se agregaron acciones administrativas, una pantalla de exportaciones y metadata de historial. El build y el chequeo de rutas conservaron la línea base funcional de Etapas 1–8.

## Problemas detectados

- La exportación de documentación entrega metadata del documento y no su contenido binario. Esto es deliberado para mantener la exportación segura y evitar exponer archivos internos fuera del flujo protegido de documentos.
- El MVP usa almacenamiento en memoria y datos sintéticos; reiniciar el servidor reinicia los cambios de la demostración.
- La comparación visual muestra snapshot anterior contra versión actual; una comparación especializada campo por campo queda como mejora posterior.

## Supuestos

- Se mantiene el umbral sintético de 7 días para “Próximo a vencer”.
- La retención del historial es sin vencimiento, según `{decision_humana_21}`.
- JSON y CSV son los formatos implementados para las exportaciones del MVP; no se agrega ZIP binario en esta etapa.

## Decisiones pendientes para la persona usuaria

1. Confirmar si la Etapa 10 debe endurecer validación de archivos, CSP, CSRF, observabilidad y auditoría de accesibilidad.
2. Definir si las exportaciones de documentación deben evolucionar a ZIP con índice CSV en una etapa posterior.
3. Confirmar si la comparación debe pasar de resumen textual a comparación campo por campo.
