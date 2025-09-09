CREATE TYPE "public"."user_status" AS ENUM('INVITED', 'ACTIVE', 'BLOCKED');--> statement-breakpoint
CREATE TABLE "cars" (
	"id" varchar PRIMARY KEY NOT NULL,
	"make" varchar NOT NULL,
	"model" varchar NOT NULL,
	"insurance_end_date" timestamp with time zone,
	"inspection_end_date" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"user_id" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"password" varchar,
	"status" "user_status" DEFAULT 'INVITED' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
