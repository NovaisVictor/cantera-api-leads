CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"whatsapp" text NOT NULL,
	"email" text NOT NULL,
	"profile" text NOT NULL,
	"source" text NOT NULL,
	"campaign" text NOT NULL,
	"submitted_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "leads_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "leads_campaign_idx" ON "leads" USING btree ("campaign");--> statement-breakpoint
CREATE INDEX "leads_source_idx" ON "leads" USING btree ("source");