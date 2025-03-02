import { timestamp } from "drizzle-orm/gel-core";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const usersTable = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  token: text("token").unique().notNull(),
});

export const notesTable = sqliteTable("notes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  text: text("text").notNull(),
  timestamp: text("timestamp").default(sql`(CURRENT_TIMESTAMP)`),
  user_id: integer("user_id").references(() => usersTable.id, {
    onDelete: "cascade",
  }),
});
