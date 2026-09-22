CREATE TABLE "agents" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"slack_user_id" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "clients" (
	"id" serial PRIMARY KEY,
	"name" text NOT NULL,
	"contact" text,
	"assigned_agent_id" integer NOT NULL,
	"max_price" integer,
	"min_bedrooms" integer,
	"preferred_postcodes" text[],
	"property_type" text,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "properties" (
	"id" serial PRIMARY KEY,
	"address" text NOT NULL,
	"postcode" text NOT NULL,
	"price" integer NOT NULL,
	"bedrooms" integer NOT NULL,
	"bathrooms" integer NOT NULL,
	"property_type" text NOT NULL,
	"description" text,
	"status" text DEFAULT 'available' NOT NULL,
	"listing_agent_id" integer NOT NULL,
	"sold_by_agent_id" integer NOT NULL,
	"sold_price" integer,
	"listed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"sold_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "viewings" (
	"id" serial PRIMARY KEY,
	"property_id" integer NOT NULL,
	"client_id" integer NOT NULL,
	"agent_id" integer NOT NULL,
	"scheduled_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'scheduled' NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "clients" ADD CONSTRAINT "clients_assigned_agent_id_agents_id_fkey" FOREIGN KEY ("assigned_agent_id") REFERENCES "agents"("id");--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_listing_agent_id_agents_id_fkey" FOREIGN KEY ("listing_agent_id") REFERENCES "agents"("id");--> statement-breakpoint
ALTER TABLE "properties" ADD CONSTRAINT "properties_sold_by_agent_id_agents_id_fkey" FOREIGN KEY ("sold_by_agent_id") REFERENCES "agents"("id");--> statement-breakpoint
ALTER TABLE "viewings" ADD CONSTRAINT "viewings_property_id_properties_id_fkey" FOREIGN KEY ("property_id") REFERENCES "properties"("id");--> statement-breakpoint
ALTER TABLE "viewings" ADD CONSTRAINT "viewings_client_id_clients_id_fkey" FOREIGN KEY ("client_id") REFERENCES "clients"("id");--> statement-breakpoint
ALTER TABLE "viewings" ADD CONSTRAINT "viewings_agent_id_agents_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id");