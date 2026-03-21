ALTER TABLE "cvs" RENAME COLUMN "personal_info" TO "personal_information";--> statement-breakpoint
ALTER TABLE "bootcamps" ALTER COLUMN "embedding" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "certifications" ALTER COLUMN "embedding" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "comments" ALTER COLUMN "content" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "cvs" ALTER COLUMN "skills" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "cvs" ALTER COLUMN "educations" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "cvs" ALTER COLUMN "work_experiences" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "cvs" ALTER COLUMN "courses" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "cvs" ALTER COLUMN "organizations" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "cvs" ALTER COLUMN "certifications" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "proftos" ALTER COLUMN "certificates" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "proftos" ALTER COLUMN "experiences" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "proftos" ALTER COLUMN "projects" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "proftos" ALTER COLUMN "links" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "bootcamps" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "certifications" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "communities" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;