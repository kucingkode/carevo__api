CREATE TABLE "bootcamps" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"profession_role" text NOT NULL,
	"thumbnail_file_id" uuid NOT NULL,
	"redirect_url" text NOT NULL,
	"publisher" text NOT NULL,
	"start_date" date NOT NULL,
	"embedding" vector(1536),
	CONSTRAINT "name_length" CHECK (char_length("bootcamps"."name") <= 255),
	CONSTRAINT "profession_role_length" CHECK (char_length("bootcamps"."profession_role") <= 255),
	CONSTRAINT "publisher_length" CHECK (char_length("bootcamps"."publisher") <= 500)
);
--> statement-breakpoint
CREATE TABLE "certifications" (
	"id" uuid PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"profession_role" text NOT NULL,
	"thumbnail_file_id" uuid NOT NULL,
	"redirect_url" text NOT NULL,
	"publisher" text NOT NULL,
	"embedding" vector(1536),
	CONSTRAINT "name_length" CHECK (char_length("certifications"."name") <= 255),
	CONSTRAINT "profession_role_length" CHECK (char_length("certifications"."profession_role") <= 255),
	CONSTRAINT "publisher_length" CHECK (char_length("certifications"."publisher") <= 500)
);
--> statement-breakpoint
CREATE TABLE "comments" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	"parent_id" uuid,
	"content" text,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "content_length" CHECK (char_length("comments"."content") <= 2000)
);
--> statement-breakpoint
CREATE TABLE "communities" (
	"id" uuid PRIMARY KEY NOT NULL,
	"avatar_file_id" uuid NOT NULL,
	"name" text NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "name_length" CHECK (char_length("communities"."name") <= 255),
	CONSTRAINT "description_length" CHECK (char_length("communities"."description") <= 2000)
);
--> statement-breakpoint
CREATE TABLE "cv_embeddings" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"embedding" vector(1536) NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cvs" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"skills" jsonb NOT NULL,
	"personal_info" jsonb NOT NULL,
	"educations" jsonb NOT NULL,
	"work_experiences" jsonb NOT NULL,
	"courses" jsonb NOT NULL,
	"organizations" jsonb NOT NULL,
	"certifications" jsonb NOT NULL,
	"updated_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_tokens" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "files" (
	"id" uuid PRIMARY KEY NOT NULL,
	"owner_id" uuid NOT NULL,
	"key" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "password_tokens" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"used_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL
);
--> statement-breakpoint
CREATE TABLE "posts" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"community_id" uuid NOT NULL,
	"content" text NOT NULL,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "content_length" CHECK (char_length("posts"."content") <= 2000)
);
--> statement-breakpoint
CREATE TABLE "proftos" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"name" text,
	"profession_role" text,
	"last_education" text,
	"email" text,
	"summary" text,
	"avatar_file_id" uuid,
	"cv_file_id" uuid,
	"certificates" jsonb NOT NULL,
	"experiences" jsonb NOT NULL,
	"projects" jsonb NOT NULL,
	"links" jsonb NOT NULL,
	"updated_at" timestamp with time zone NOT NULL,
	CONSTRAINT "name_length" CHECK (char_length("proftos"."name") <= 255),
	CONSTRAINT "profession_role_length" CHECK (char_length("proftos"."profession_role") <= 255),
	CONSTRAINT "last_education_length" CHECK (char_length("proftos"."last_education") <= 255),
	CONSTRAINT "email_length" CHECK (char_length("proftos"."email") <= 255),
	CONSTRAINT "summary_length" CHECK (char_length("proftos"."summary") <= 2000)
);
--> statement-breakpoint
CREATE TABLE "refresh_tokens" (
	"id" uuid PRIMARY KEY NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"ip_address" "inet",
	"user_agent" text,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"created_at" timestamp with time zone NOT NULL,
	CONSTRAINT "user_agent_length" CHECK (char_length("refresh_tokens"."user_agent") <= 512)
);
--> statement-breakpoint
CREATE TABLE "user_communities" (
	"user_id" uuid NOT NULL,
	"community_id" uuid NOT NULL,
	CONSTRAINT "user_communities_user_id_community_id_pk" PRIMARY KEY("user_id","community_id")
);
--> statement-breakpoint
CREATE TABLE "user_likes" (
	"user_id" uuid NOT NULL,
	"post_id" uuid NOT NULL,
	CONSTRAINT "user_likes_user_id_post_id_pk" PRIMARY KEY("user_id","post_id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"is_email_verified" boolean NOT NULL,
	"password_hash" text,
	"google_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email"),
	CONSTRAINT "username_length" CHECK (char_length("users"."username") <= 30),
	CONSTRAINT "email_length" CHECK (char_length("users"."email") <= 255)
);
--> statement-breakpoint
ALTER TABLE "comments" ADD CONSTRAINT "comments_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "communities" ADD CONSTRAINT "communities_avatar_file_id_files_id_fk" FOREIGN KEY ("avatar_file_id") REFERENCES "public"."files"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cv_embeddings" ADD CONSTRAINT "cv_embeddings_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "cvs" ADD CONSTRAINT "cvs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "email_tokens" ADD CONSTRAINT "email_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "files" ADD CONSTRAINT "files_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "password_tokens" ADD CONSTRAINT "password_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "posts" ADD CONSTRAINT "posts_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "proftos" ADD CONSTRAINT "proftos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "proftos" ADD CONSTRAINT "proftos_avatar_file_id_files_id_fk" FOREIGN KEY ("avatar_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "proftos" ADD CONSTRAINT "proftos_cv_file_id_files_id_fk" FOREIGN KEY ("cv_file_id") REFERENCES "public"."files"("id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_communities" ADD CONSTRAINT "user_communities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_communities" ADD CONSTRAINT "user_communities_community_id_communities_id_fk" FOREIGN KEY ("community_id") REFERENCES "public"."communities"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_likes" ADD CONSTRAINT "user_likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "user_likes" ADD CONSTRAINT "user_likes_post_id_posts_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE cascade;