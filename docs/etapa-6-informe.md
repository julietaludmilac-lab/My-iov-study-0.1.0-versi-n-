# Informe de Etapa 6 — Horarios y aulas

## Entrega

Se incorporó la vista consolidada de horarios y aulas para el Estudiante. La tarjeta **Dónde curso hoy** de Inicio ahora consume el adaptador protegido de horarios y muestra asignatura, comisión, día, horario y aula. El detalle de **Comisiones > Actuales** conserva la pestaña Horarios y ahora presenta el dato consolidado vigente.

El adaptador sintético contempla tres casos: aula oficial, aula modificada oficialmente y actividad sin aula registrada. En el caso modificado se muestran el aula vigente, el aula anterior y la explicación de Bedelía. En el caso sin aula se informa “Aula no informada”, sin inventar un valor.

## API y permisos

`GET /api/student/schedule` requiere una sesión con rol `ESTUDIANTE` y entrega solo datos sintéticos. Bedelía recibe `403` al intentar consultar la ruta de estudiante. El health del Preview identifica la etapa actual como `6`.

## Validaciones realizadas

- `npm run typecheck`: **APROBADA**.
- `npm run build`: **APROBADA**.
- `npm run check:routes`: **APROBADA**, 30 rutas declaradas.
- API: asignaturas, días, horarios, comisiones y aulas: **APROBADA**.
- API: aula modificada vigente, aula anterior y nota oficial: **APROBADA**.
- API: caso `SIN_AULA` sin valor inventado: **APROBADA**.
- Permisos Estudiante/Bedelía: **APROBADOS**.
- Preview: tarjeta de Inicio con consolidación visible: **APROBADA**.
- Preview: Comisiones Actuales, Comisión B, pestaña Horarios y modificación oficial: **APROBADA**.
- Diagnósticos TypeScript gestionados por WebDev: registrados.

## Límites

La persistencia continúa siendo sintética y en memoria. La carga y modificación administrativa de horarios y aulas, junto con su historial, queda preparada para una etapa posterior de gestión. Documentos adjuntos y agenda personal permanecen fuera del alcance.

Etapa 6 completa. Esperando APROBADO ETAPA 6.
