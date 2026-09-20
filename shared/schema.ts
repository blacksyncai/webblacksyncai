import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export const leads = pgTable("leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message"),
  phone: text("phone"),
  industry: text("industry"),
  teamSize: text("team_size"),
  useCase: text("use_case"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLeadSchema = createInsertSchema(leads).pick({
  name: true,
  email: true,
  company: true,
  message: true,
  phone: true,
  industry: true,
  teamSize: true,
  useCase: true,
});

export type InsertLead = z.infer<typeof insertLeadSchema>;
export type Lead = typeof leads.$inferSelect;

export const enterpriseLeads = pgTable("enterprise_leads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp("created_at").defaultNow(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  industry: text("industry").notNull(),
  teamSize: text("team_size").notNull(),
  monthlyLeads: text("monthly_leads").notNull(),
  referralSource: text("referral_source").notNull(),
  phone: text("phone"),
  useCase: text("use_case"),
});

export const insertEnterpriseLeadSchema = createInsertSchema(enterpriseLeads).pick({
  firstName: true,
  lastName: true,
  email: true,
  company: true,
  industry: true,
  teamSize: true,
  monthlyLeads: true,
  referralSource: true,
  phone: true,
  useCase: true,
});

export type InsertEnterpriseLead = z.infer<typeof insertEnterpriseLeadSchema>;
export type EnterpriseLead = typeof enterpriseLeads.$inferSelect;

// --- Helcim "Front Desk Starter" signup flow (see api/_signup.ts) ---
//
// Serverless functions are stateless between invocations, so the signup
// flow's short-lived state has to live somewhere durable rather than in a
// local JSON file. These two tables replace that.

export const helcimPendingCheckouts = pgTable("helcim_pending_checkouts", {
  // The signupId minted by POST /api/signup/start; the browser round-trips
  // it back on /api/signup/complete once HelcimPay.js reports success.
  id: varchar("id").primaryKey(),
  customerCode: text("customer_code").notNull(),
  customerId: text("customer_id").notNull(),
  // Only ever read server-side to validate the HelcimPay.js response hash.
  secretToken: text("secret_token").notNull(),
  signupDate: timestamp("signup_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const helcimIdempotencyKeys = pgTable("helcim_idempotency_keys", {
  // e.g. "first-month-charge:<signupId>" or "subscription-create:<signupId>"
  operationKey: text("operation_key").primaryKey(),
  idempotencyKey: text("idempotency_key").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
