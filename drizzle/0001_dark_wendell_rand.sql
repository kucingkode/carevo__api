ALTER TABLE "bootcamps" RENAME COLUMN "thumbnail_file_id" TO "thumbnail_url";--> statement-breakpoint
ALTER TABLE "certifications" RENAME COLUMN "thumbnail_file_id" TO "thumbnail_url";--> statement-breakpoint
CREATE INDEX "idx_bootcamps_embedding" ON "bootcamps" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "idx_certifications_embedding" ON "certifications" USING hnsw ("embedding" vector_cosine_ops);--> statement-breakpoint
CREATE INDEX "idx_comments_user_id" ON "comments" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_comments_post_id_parent_id" ON "comments" USING btree ("post_id","parent_id");--> statement-breakpoint
CREATE INDEX "idx_files_owner_id" ON "files" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "idx_user_id" ON "posts" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_community_id" ON "posts" USING btree ("community_id");--> statement-breakpoint
CREATE INDEX "idx_refresh_tokens_user_id" ON "refresh_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_users_email" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_users_google_id" ON "users" USING btree ("google_id");--> statement-breakpoint
CREATE UNIQUE INDEX "uq_users_username" ON "users" USING btree ("username");