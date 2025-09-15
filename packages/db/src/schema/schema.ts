import { relations } from 'drizzle-orm';
import { pgEnum } from 'drizzle-orm/pg-core';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';

export const userStatusEnum = pgEnum('user_status', ['INVITED', 'ACTIVE', 'BLOCKED']);
export const roleEnum = pgEnum('role', ['ADMIN', 'USER']);

export const users = pgTable('users', {
  id: varchar('id').primaryKey().$defaultFn(ulid),
  email: varchar('email').notNull().unique(),
  password: varchar('password'),
  role: roleEnum('role').default('ADMIN'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  organizationId: varchar('organization_id').notNull(),
});

export const organizations = pgTable('organizations', {
  id: varchar('id').primaryKey().$defaultFn(ulid),
  name: varchar('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const cars = pgTable('cars', {
  id: varchar('id').primaryKey().$defaultFn(ulid),
  make: varchar('make').notNull(),
  model: varchar('model').notNull(),
  insuranceEndDate: timestamp('insurance_end_date', { withTimezone: true }),
  inspectionEndDate: timestamp('inspection_end_date', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  createdBy: varchar('created_by').notNull(),
  organizationId: varchar('organization_id').notNull(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  cars: many(cars),
  organization: one(organizations, {
    fields: [users.organizationId],
    references: [organizations.id],
  }),
}));

export const carsRelations = relations(cars, ({ one }) => ({
  owner: one(users, {
    fields: [cars.createdBy],
    references: [users.id],
  }),
  organization: one(organizations, {
    fields: [cars.organizationId],
    references: [organizations.id],
  }),
}));

export const organizationsRelations = relations(organizations, ({ many }) => ({
  cars: many(cars),
  users: many(users),
}));
