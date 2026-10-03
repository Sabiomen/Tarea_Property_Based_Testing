# Tarea_Property_Based_Testing

## Dominio
Gestión de **Tareas** (id, title, description, status) con CRUD en memoria.

## Reglas del dominio
- `title` no vacío, sin ser solo espacios, máx. 100 caracteres
- `id` único generado por el sistema
- `status` ∈ {pending, in_progress, done}; por defecto `pending`
- el `id` nunca cambia

## Herramientas
TypeScript, Vitest, fast-check.

## Ejecución
```bash
npm install
npm test
```

## Estructura
```
src/
  task.ts               # entidad, tipos y errores de dominio
  task-service.ts       # CRUD en memoria
test/
  arbitraries.ts        # generadores fast-check reutilizables
  task-service.example.test.ts   # test por ejemplo (línea base)
  create.property.test.ts
  read.property.test.ts
  update.property.test.ts
  delete.property.test.ts
  model.property.test.ts         # test de modelo con secuencias aleatorias
```

## Propiedades implementadas
| Operación | Propiedad |
|---|---|
| Create | Datos conservados, ids únicos, defaults, rechazo de títulos inválidos |
| Read | getById == lo creado, list contiene todo, inexistente → undefined, sin efectos colaterales |
| Update | Solo cambian los campos del patch, id intacto, otras tareas no afectadas, inexistente → error |
| Delete | La tarea desaparece, total −1, otras intactas, doble borrado → error |
| Modelo | Secuencias aleatorias de operaciones coinciden con un modelo de referencia |

## Ejemplo de shrinking
Ver archivo shrinking output dentro de test para ver un output resultante despues de romper a propisto el `create`, cambiando `title: input.title` por `title: input.title.trim()`, correr `npm test` y copiar el contraejemplo mínimo y el `seed`