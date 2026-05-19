New Project Setup Again:
```
npm create vite@latest my-app -- --template react-ts
```

```bash
npm install react-router tailwindcss @tailwindcss/vite firebase react-hook-form @hookform/resolvers zod lucide-react framer-motion
```


server-run
```bash
npx nodemon --exec ts-node src/server.ts
/
npx nodemon src/server.ts
```

when change model of postgreSQL:
```bash
npx prisma generate
```

and then do migration :
```bash
npx prisma migrate dev --name add_menu_item
```

### seed run:
```bash
npx ts-node prisma/seed/seed.ts
```
















**Schema change** means making any modification in your `schema.prisma` file.

## Examples of schema changes:

1. Adding a new model (e.g. Staff, Shift, Attendance)
2. Adding a new field to an existing model (e.g. adding `phone` to `User`)
3. Changing a field type (e.g. `String` → `Int`)
4. Updating relationships (adding or removing `@relation`)
5. Adding or modifying enums
6. Adding or removing indexes
7. Changing constraints like `@unique` or `@default`

## When a schema change happens:

Run:

```bash
npx prisma migrate dev --name migration_name
```

## When it is NOT a schema change:

If you only want to update the Prisma Client (without changing the database), run:

```bash
npx prisma generate
```

## Important note:

* `migrate dev` → updates the database (creates tables, columns, relations, etc.)
* `generate` → only updates Prisma Client code, does NOT change the database

In short:

* Schema change → use `migrate dev`
* Only client update → use `generate`
