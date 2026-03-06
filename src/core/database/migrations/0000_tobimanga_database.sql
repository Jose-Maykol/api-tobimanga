CREATE TYPE "public"."cron_job_execution_status" AS ENUM('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."publication_status" AS ENUM('ONGOING', 'FINISHED', 'HIATUS', 'CANCELLED', 'NOT_YET_RELEASED', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."reading_status" AS ENUM('READING', 'COMPLETED', 'DROPPED', 'PLANNING_TO_READ', 'PAUSED', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('USER', 'ADMIN');--> statement-breakpoint
CREATE TABLE "authors" (
	"author_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "authors_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "chapters" (
	"chapter_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"manga_id" uuid NOT NULL,
	"chapter_number" smallint NOT NULL,
	"title" varchar(255),
	"release_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "cron_job_executions" (
	"cron_job_execution_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"cron_job_id" uuid NOT NULL,
	"status" "cron_job_execution_status" DEFAULT 'PENDING' NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"finished_at" timestamp,
	"duration_ms" integer,
	"error_message" text
);
--> statement-breakpoint
CREATE TABLE "cron_jobs" (
	"cron_job_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"key" varchar NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"schedule" varchar NOT NULL,
	"options" jsonb DEFAULT '{}' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"last_run_at" timestamp,
	"next_run_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "cron_jobs_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "demographics" (
	"demographic_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "demographics_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "genres" (
	"genre_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "genres_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "manga_authors" (
	"manga_id" uuid NOT NULL,
	"author_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "manga_genres" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"genre_id" uuid DEFAULT uuid_generate_v4() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mangas" (
	"manga_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"demographic_id" uuid NOT NULL,
	"original_name" text NOT NULL,
	"slug_name" text NOT NULL,
	"scrapping_name" text NOT NULL,
	"alternative_names" text[],
	"sinopsis" text NOT NULL,
	"chapters" smallint DEFAULT 0 NOT NULL,
	"release_date" date NOT NULL,
	"cover_image_url" text NOT NULL,
	"banner_image_url" text NOT NULL,
	"publication_status" "publication_status" NOT NULL,
	"rating" smallint DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "mangas_original_name_unique" UNIQUE("original_name"),
	CONSTRAINT "mangas_slug_name_unique" UNIQUE("slug_name"),
	CONSTRAINT "mangas_scrapping_name_unique" UNIQUE("scrapping_name")
);
--> statement-breakpoint
CREATE TABLE "uploads" (
	"upload_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"file_name" text NOT NULL,
	"content_type" text NOT NULL,
	"url" text NOT NULL,
	"status" text DEFAULT 'PENDING' NOT NULL,
	"object_key" text NOT NULL,
	"entity_type" text,
	"used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "uploads_object_key_unique" UNIQUE("object_key")
);
--> statement-breakpoint
CREATE TABLE "user_chapter_progress" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"chapter_id" uuid NOT NULL,
	"read_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_mangas" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"manga_id" uuid NOT NULL,
	"rating" smallint,
	"reading_status" "reading_status" NOT NULL,
	"is_favorite" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "user_mangas_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"profile_image" text,
	"cover_image" text,
	"roles" "user_role"[] DEFAULT '{"USER"}' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"refresh_token" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "chapters" ADD CONSTRAINT "chapters_manga_id_mangas_manga_id_fk" FOREIGN KEY ("manga_id") REFERENCES "public"."mangas"("manga_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "cron_job_executions" ADD CONSTRAINT "cron_job_executions_cron_job_id_cron_jobs_cron_job_id_fk" FOREIGN KEY ("cron_job_id") REFERENCES "public"."cron_jobs"("cron_job_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manga_authors" ADD CONSTRAINT "manga_authors_manga_id_mangas_manga_id_fk" FOREIGN KEY ("manga_id") REFERENCES "public"."mangas"("manga_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manga_authors" ADD CONSTRAINT "manga_authors_author_id_authors_author_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("author_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manga_genres" ADD CONSTRAINT "manga_genres_id_mangas_manga_id_fk" FOREIGN KEY ("id") REFERENCES "public"."mangas"("manga_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "manga_genres" ADD CONSTRAINT "manga_genres_genre_id_genres_genre_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("genre_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mangas" ADD CONSTRAINT "mangas_demographic_id_demographics_demographic_id_fk" FOREIGN KEY ("demographic_id") REFERENCES "public"."demographics"("demographic_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_chapter_progress" ADD CONSTRAINT "user_chapter_progress_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_chapter_progress" ADD CONSTRAINT "user_chapter_progress_chapter_id_chapters_chapter_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("chapter_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_mangas" ADD CONSTRAINT "user_mangas_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_mangas" ADD CONSTRAINT "user_mangas_manga_id_mangas_manga_id_fk" FOREIGN KEY ("manga_id") REFERENCES "public"."mangas"("manga_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "chapters_manga_id_idx" ON "chapters" USING btree ("manga_id");--> statement-breakpoint
CREATE INDEX "chapters_chapter_number_idx" ON "chapters" USING btree ("chapter_number");--> statement-breakpoint
CREATE INDEX "mangas_demographic_id_idx" ON "mangas" USING btree ("demographic_id");--> statement-breakpoint
CREATE INDEX "mangas_rating_idx" ON "mangas" USING btree ("rating");--> statement-breakpoint
CREATE INDEX "mangas_updated_at_idx" ON "mangas" USING btree ("updated_at");--> statement-breakpoint
CREATE INDEX "mangas_publication_status_idx" ON "mangas" USING btree ("publication_status");--> statement-breakpoint
CREATE INDEX "mangas_demographic_id_rating_idx" ON "mangas" USING btree ("demographic_id","rating");--> statement-breakpoint
CREATE INDEX "user_mangas_user_id_manga_id_idx" ON "user_mangas" USING btree ("user_id","manga_id");--> statement-breakpoint
CREATE INDEX "user_mangas_manga_id_idx" ON "user_mangas" USING btree ("manga_id");--> statement-breakpoint
CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "users_role_idx" ON "users" USING btree ("roles");