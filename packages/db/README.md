# @antiport/db

Schema Drizzle + migraciones SQL para Antiport (Supabase Postgres).

## Estructura

- `schema.ts` — definicion Drizzle de todas las tablas.
- `migrations/0001_init.sql` — tablas + indices + check constraints.
- `migrations/0002_rls.sql` — Row Level Security para todas las tablas con datos de usuario.
- `seed.sql` — 20 dominios placeholder y 30 versiculos.
- `index.ts` — factory `createClient({ connectionString })`.

## Aplicar migraciones a Supabase

### Opcion A: psql via pooler

```bash
# Recomendado: pooler 6543 (modo session) para DDL.
export SUPABASE_DB_URL="postgresql://postgres.<ref>:<password>@aws-0-eu-west-1.pooler.supabase.com:5432/postgres"

psql "$SUPABASE_DB_URL" -f migrations/0001_init.sql
psql "$SUPABASE_DB_URL" -f migrations/0002_rls.sql
psql "$SUPABASE_DB_URL" -f seed.sql
```

### Opcion B: Supabase MCP (`apply_migration`)

Desde Claude Code con el server `supabase` conectado:

1. `list_projects` y elige el proyecto antiport.
2. `apply_migration` con el contenido de cada `.sql`, una a una y en orden:
   - `0001_init`
   - `0002_rls`
   - `seed_initial` (contenido de `seed.sql`)
3. `get_advisors` (`security_lint`) para verificar que RLS esta correctamente configurada.

### Opcion C: Supabase CLI local

```bash
supabase db reset            # local
supabase db push             # remoto
```

## Uso del cliente

```ts
import { createClient } from "@antiport/db";
import { userProfile } from "@antiport/db/schema";

const { db, close } = createClient({
  connectionString: process.env.SUPABASE_DB_URL!,
});

const profile = await db.select().from(userProfile).limit(1);
await close();
```

## Privacidad

`intervention_log` **nunca** almacena la URL visitada. Solo `category`, `mood`, `outcome`, `duration`. Ver `docs/privacy.md` (TODO).

## Pendientes

- Trigger SQL que cree `public.users` + `user_profile` + `streaks` al insertarse un `auth.users`.
- Migraciones para v1.1 (anchors media via Supabase Storage).
- Indice GIN en `scriptures.themes` cuando crezcan los registros.
