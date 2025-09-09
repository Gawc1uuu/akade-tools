import { pgEnum } from 'drizzle-orm/pg-core';
import { pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core';
import { ulid } from 'ulid';

export const userStatusEnum = pgEnum("user_status",["INVITED","ACTIVE","BLOCKED"])

export const UsersTable = pgTable('users', {
  id: varchar('id').primaryKey().$defaultFn(ulid),
  email: varchar('email').notNull().unique(),
  password: varchar('password'),
  status:userStatusEnum("status").default("INVITED").notNull(),
  createdAt: timestamp('created_at',{withTimezone:true}).notNull().defaultNow(),
});

export const CarsTable = pgTable("cars",{
  id:varchar("id").primaryKey().$defaultFn(ulid),
  make:varchar("make").notNull(),
  model:varchar("model").notNull(),
  insuranceEndDate:timestamp("insurance_end_date",{withTimezone:true}),
  inspectionEndDate:timestamp("inspection_end_date",{withTimezone:true}),
  createdAt:timestamp("created_at",{withTimezone:true}).notNull().defaultNow(),
  updatedAt:timestamp("updated_at",{withTimezone:true}).notNull().defaultNow()
})
