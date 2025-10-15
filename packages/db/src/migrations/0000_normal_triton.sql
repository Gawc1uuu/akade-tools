CREATE TYPE "public"."role" AS ENUM('ADMIN', 'USER');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('INVITED', 'ACTIVE', 'BLOCKED');--> statement-breakpoint
CREATE TABLE "cars" (
	"id" varchar PRIMARY KEY NOT NULL,
	"make" varchar NOT NULL,
	"model" varchar NOT NULL,
	"registration_number" varchar NOT NULL,
	"insurance_end_date" timestamp with time zone,
	"inspection_end_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_by" varchar NOT NULL,
	"organization_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "invites" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar NOT NULL,
	CONSTRAINT "invites_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "organizations" (
	"id" varchar PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_email" varchar
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"first_name" varchar NOT NULL,
	"last_name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"status" "user_status",
	"password" varchar,
	"role" "role" DEFAULT 'ADMIN',
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"organization_id" varchar,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
