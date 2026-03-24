ALTER TABLE "communities" RENAME COLUMN "avatar_file_id" TO "avatar_url";--> statement-breakpoint
ALTER TABLE "communities" DROP CONSTRAINT "communities_avatar_file_id_files_id_fk";
--> statement-breakpoint
ALTER TABLE "bootcamps" ALTER COLUMN "thumbnail_url" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "certifications" ALTER COLUMN "thumbnail_url" SET DATA TYPE text;
ALTER TABLE "communities" ALTER COLUMN "avatar_url" SET DATA TYPE text;