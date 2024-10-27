CREATE TYPE "public"."publication_status" AS ENUM('ONGOING', 'FINISHED', 'HIATUS', 'CANCELLED', 'NOT_YET_RELEASED', 'UNKNOWN');--> statement-breakpoint
CREATE TYPE "public"."reading_status" AS ENUM('READING', 'COMPLETED', 'DROPPED', 'PLANNING_TO_READ', 'PAUSED', 'UNKNOWN');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "authors" (
	"author_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "authors_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "chapters" (
	"chapter_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"manga_id" uuid NOT NULL,
	"chapter_number" smallint NOT NULL,
	"release_date" date,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "demographics" (
	"demographic_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "demographics_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genres" (
	"genre_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"name" varchar(100) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "genres_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "manga_authors" (
	"manga_id" uuid NOT NULL,
	"author_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "manga_genres" (
	"id" uuid DEFAULT uuid_generate_v4() NOT NULL,
	"genre_id" uuid DEFAULT uuid_generate_v4() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "mangas" (
	"manga_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"demographic_id" uuid NOT NULL,
	"original_name" text NOT NULL,
	"alternative_names" text[],
	"sinopsis" text NOT NULL,
	"chapters" smallint NOT NULL,
	"release_date" date,
	"cover_image" text,
	"banner_image" text,
	"publication_status" "publication_status" NOT NULL,
	"rating" smallint DEFAULT 0 NOT NULL,
	"active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "mangas_original_name_unique" UNIQUE("original_name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_chapters" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"chapter_id" uuid NOT NULL,
	"read" boolean DEFAULT false NOT NULL,
	"read_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_favorite_mangas" (
	"user_id" uuid NOT NULL,
	"manga_id" uuid NOT NULL,
	"favorited_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_mangas" (
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
CREATE TABLE IF NOT EXISTS "users" (
	"user_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"username" varchar(100) NOT NULL,
	"password" varchar(100) NOT NULL,
	"email" varchar(100) NOT NULL,
	"profile_image" text,
	"cover_image" text,
	"is_administrator" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp,
	CONSTRAINT "users_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "users_username_unique" UNIQUE("username"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "chapters" ADD CONSTRAINT "chapters_manga_id_mangas_manga_id_fk" FOREIGN KEY ("manga_id") REFERENCES "public"."mangas"("manga_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "manga_authors" ADD CONSTRAINT "manga_authors_manga_id_mangas_manga_id_fk" FOREIGN KEY ("manga_id") REFERENCES "public"."mangas"("manga_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "manga_authors" ADD CONSTRAINT "manga_authors_author_id_authors_author_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."authors"("author_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "manga_genres" ADD CONSTRAINT "manga_genres_id_mangas_manga_id_fk" FOREIGN KEY ("id") REFERENCES "public"."mangas"("manga_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "manga_genres" ADD CONSTRAINT "manga_genres_genre_id_genres_genre_id_fk" FOREIGN KEY ("genre_id") REFERENCES "public"."genres"("genre_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "mangas" ADD CONSTRAINT "mangas_demographic_id_demographics_demographic_id_fk" FOREIGN KEY ("demographic_id") REFERENCES "public"."demographics"("demographic_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_chapters" ADD CONSTRAINT "user_chapters_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_chapters" ADD CONSTRAINT "user_chapters_chapter_id_chapters_chapter_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapters"("chapter_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_favorite_mangas" ADD CONSTRAINT "user_favorite_mangas_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_favorite_mangas" ADD CONSTRAINT "user_favorite_mangas_manga_id_mangas_manga_id_fk" FOREIGN KEY ("manga_id") REFERENCES "public"."mangas"("manga_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_mangas" ADD CONSTRAINT "user_mangas_user_id_users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("user_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_mangas" ADD CONSTRAINT "user_mangas_manga_id_mangas_manga_id_fk" FOREIGN KEY ("manga_id") REFERENCES "public"."mangas"("manga_id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
