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
	"release_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "cron_job_executions" (
	"cron_job_execution_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"cron_job_id" uuid NOT NULL,
	"started_at" timestamp DEFAULT now() NOT NULL,
	"finished_at" timestamp,
	"duration" timestamp,
	"status" "cron_job_execution_status" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "cron_jobs" (
	"cron_job_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar NOT NULL,
	"schedule" varchar NOT NULL,
	"task" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
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
	"slug_name" text,
	"scrapping_name" text,
	"alternative_names" text[],
	"sinopsis" text NOT NULL,
	"chapters" smallint NOT NULL,
	"release_date" date,
	"cover_image_url" text,
	"cover_image_object_key" text,
	"banner_image_url" text,
	"banner_image_object_key" text,
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
CREATE TABLE "user_favorite_mangas" (
	"user_id" uuid NOT NULL,
	"manga_id" uuid NOT NULL,
	"favorited_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_mangas" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"manga_id" uuid NOT NULL,
	"rating" smallint,
	"reading_status" "reading_status" NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "user_mangas_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"user_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"profile_image" text,
	"cover_image" text,
	"role" "user_role" DEFAULT 'USER' NOT NULL,
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
ALTER TABLE "user_favorite_mangas" ADD CONSTRAINT "user_favorite_mangas_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_favorite_mangas" ADD CONSTRAINT "user_favorite_mangas_manga_id_mangas_manga_id_fk" FOREIGN KEY ("manga_id") REFERENCES "public"."mangas"("manga_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_mangas" ADD CONSTRAINT "user_mangas_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_mangas" ADD CONSTRAINT "user_mangas_manga_id_mangas_manga_id_fk" FOREIGN KEY ("manga_id") REFERENCES "public"."mangas"("manga_id") ON DELETE cascade ON UPDATE no action;