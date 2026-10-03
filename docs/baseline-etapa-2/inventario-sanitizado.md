# Línea base visual y funcional — Etapa 2

## Fuente y límites

La referencia es el video de pantalla móvil recibido el 2 de octubre de 2026, de aproximadamente 165 segundos y resolución 576×1280. Se revisó el recorrido completo y fotogramas de control. No se conservan capturas ni fotogramas en el repositorio porque el video muestra datos personales reales. Este documento conserva solamente observaciones de interfaz y datos sintéticos.

## Tokens visuales observados

- **Viewport de referencia:** móvil vertical; las pruebas de regresión usarán 360 px y 576 px de ancho.
- **Splash:** fondo azul institucional pleno, isotipo blanco centrado y lema institucional; se reproducirá con un identificador sintético sin copiar el escudo real.
- **Barra superior:** gris pardo, título “Mi UCSF”, control de cierre o menú a la izquierda y menú de tres puntos a la derecha.
- **Menú lateral:** azul oscuro, ancho aproximado de dos tercios del viewport, overlay gris translúcido sobre el contenido, avatar y alias arriba, separadores finos y entradas con iconos lineales.
- **Contenido:** fondo gris muy claro, tarjetas blancas con esquinas redondeadas y sombra suave, márgenes laterales constantes.
- **Acento:** turquesa/cian para acciones, pestañas activas, enlaces, horarios y estados seleccionados.
- **Información:** amarillo suave en avisos de requisitos o advertencias.
- **Tipografía:** sans-serif similar a Roboto, títulos y etiquetas con peso destacado, cuerpo oscuro de alta legibilidad.
- **Modales:** tarjeta blanca grande sobre overlay gris, cierre con X arriba a la derecha, tabs redondeadas turquesa y botón turquesa “CERRAR” al pie.
- **Estados vacíos:** texto “No hay elementos para mostrar” dentro de tarjeta o modal de aviso con icono de información.
- **Pie:** “AYUDA” a la izquierda y copyright institucional a la derecha, con el enlace en turquesa.

## Inventario de rutas observadas

1. Splash y login.
2. Inicio: Notificaciones sin leer, Dónde curso hoy y Dónde rindo hoy.
3. Drawer: Datos Personales, Cambio de Contraseña, Forma de Pago, Ficha de Salud, Inicio, Comisiones, Exámenes, Aranceles, Trámites y Encuestas.
4. Datos Personales.
5. Cambio de Contraseña.
6. Forma de Pago.
7. Ficha de Salud.
8. Plan de estudio.
9. Comisiones: Inscripciones, Actuales, Cursadas y Faltantes.
10. Exámenes: Inscripciones, Actuales, Rendidos y Faltantes.
11. Aranceles: Cuotas y Comprobantes.
12. Trámites: Certificados, Académicos y Título.
13. Encuestas.
14. Notificaciones, Contacto, Ayuda y Salir.

## Comportamientos de línea base

- El drawer se abre sobre la pantalla actual y se cierra mediante X o selección.
- Comisiones y Exámenes despliegan submenús.
- Las pantallas sin datos muestran el modal o mensaje vacío existente.
- Las asignaturas de Comisiones y Exámenes abren modales con detalle.
- El modal de Comisiones Actuales alterna Regularidad y Horarios.
- Las tarjetas de Inicio conservan el orden observado.
- Los valores de prueba del repositorio serán ficticios, breves y rotulados como demostración; no se copiarán nombres, matrículas, docentes, domicilios, salud ni pagos del video.

## Incertidumbres que quedan explícitas

- El menú de tres puntos no fue desplegado.
- Encuestas no fue recorrida en profundidad.
- Algunas pantallas de Trámites solo se dejan como contenedores vacíos, según la especificación.
- Los colores se tomarán de la referencia visual de forma aproximada y se fijarán como tokens; no se presentarán como valores oficiales de marca.
