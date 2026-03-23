ALTER TABLE "refresh_tokens" ADD COLUMN "long_lived" boolean NOT NULL;--> statement-breakpoint
ALTER TABLE "refresh_tokens" DROP COLUMN "revoked_at";