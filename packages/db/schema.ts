import { sql } from "drizzle-orm";
import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  smallint,
  integer,
  serial,
  date,
  primaryKey,
  unique,
  check,
} from "drizzle-orm/pg-core";

/**
 * users — espejo ligero de auth.users de Supabase.
 * El id referencia auth.users(id) (FK creada en SQL, no expresable aquí).
 */
export const users = pgTable("users", {
  id: uuid("id").primaryKey(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * user_profile — preferencias del usuario sobre la experiencia (Aliado, capa espiritual, idioma...).
 */
export const userProfile = pgTable("user_profile", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  displayName: text("display_name"),
  language: text("language").default("es").notNull(),
  tone: text("tone").default("cercano").notNull(),
  aliadoName: text("aliado_name").default("Aliado").notNull(),
  aliadoGender: text("aliado_gender").default("neutro").notNull(),
  spiritualLayer: boolean("spiritual_layer").default(false).notNull(),
  spiritualTradition: text("spiritual_tradition"),
  anonymous: boolean("anonymous").default(false).notNull(),
});

/**
 * blocklist_domains — lista global curada por nosotros.
 */
export const blocklistDomains = pgTable("blocklist_domains", {
  id: serial("id").primaryKey(),
  domain: text("domain").notNull().unique(),
  category: text("category"),
  severity: smallint("severity"),
  addedAt: timestamp("added_at", { withTimezone: true }).defaultNow().notNull(),
});

/**
 * user_blocklist_overrides — whitelist y bloqueos custom por usuario.
 */
export const userBlocklistOverrides = pgTable(
  "user_blocklist_overrides",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    domain: text("domain").notNull(),
    kind: text("kind").notNull(),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.userId, t.domain] }),
    kindCheck: check("user_blocklist_overrides_kind_check", sql`${t.kind} in ('whitelist','custom_block')`),
  })
);

/**
 * intervention_log — eventos anónimos. NUNCA se almacena la URL visitada.
 */
export const interventionLog = pgTable(
  "intervention_log",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    occurredAt: timestamp("occurred_at", { withTimezone: true }).defaultNow().notNull(),
    category: text("category"),
    mood: text("mood"),
    outcome: text("outcome"),
    durationSeconds: integer("duration_seconds"),
  },
  (t) => ({
    outcomeCheck: check(
      "intervention_log_outcome_check",
      sql`${t.outcome} in ('resisted','breathed','contacted','relapsed','dismissed')`
    ),
  })
);

/**
 * daily_checkins — un check-in por usuario y día.
 */
export const dailyCheckins = pgTable(
  "daily_checkins",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    day: date("day").notNull(),
    mood: text("mood"),
    energy: smallint("energy"),
    sleptWell: boolean("slept_well"),
    notes: text("notes"),
  },
  (t) => ({
    userDayUnique: unique("daily_checkins_user_day_key").on(t.userId, t.day),
  })
);

/**
 * streaks — racha actual y máxima.
 */
export const streaks = pgTable("streaks", {
  userId: uuid("user_id")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  currentStreak: integer("current_streak").default(0).notNull(),
  longestStreak: integer("longest_streak").default(0).notNull(),
  lastCleanDay: date("last_clean_day"),
});

/**
 * anchors — fotos, audios o frases personales que el Aliado usa en intervenciones.
 */
export const anchors = pgTable(
  "anchors",
  {
    id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    kind: text("kind").notNull(),
    label: text("label"),
    contentUrl: text("content_url"),
    contentText: text("content_text"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    kindCheck: check("anchors_kind_check", sql`${t.kind} in ('photo','audio','text')`),
  })
);

/**
 * scriptures — versículos para la capa espiritual opcional.
 */
export const scriptures = pgTable(
  "scriptures",
  {
    id: serial("id").primaryKey(),
    reference: text("reference").notNull(),
    body: text("body").notNull(),
    tradition: text("tradition").notNull(),
    themes: text("themes").array(),
  },
  (t) => ({
    traditionCheck: check(
      "scriptures_tradition_check",
      sql`${t.tradition} in ('shared','catholic','evangelical')`
    ),
  })
);

/**
 * triggers_observed — agregados de patrones detectados por el dispositivo (subido sin URL).
 */
export const triggersObserved = pgTable("triggers_observed", {
  id: uuid("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  hour: smallint("hour"),
  dayOfWeek: smallint("day_of_week"),
  emotion: text("emotion"),
  count: integer("count").default(1).notNull(),
  lastSeen: timestamp("last_seen", { withTimezone: true }),
});
