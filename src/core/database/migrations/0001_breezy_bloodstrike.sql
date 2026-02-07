ALTER TABLE "cron_jobs" ALTER COLUMN "updated_at" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "cron_jobs" ALTER COLUMN "updated_at" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "mangas" ALTER COLUMN "slug_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mangas" ALTER COLUMN "scrapping_name" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mangas" ALTER COLUMN "chapters" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "mangas" ALTER COLUMN "release_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mangas" ALTER COLUMN "cover_image_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "mangas" ALTER COLUMN "banner_image_url" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" SET DATA TYPE varchar(255);--> statement-breakpoint
ALTER TABLE "chapters" ADD COLUMN "title" varchar(255);--> statement-breakpoint
ALTER TABLE "cron_jobs" ADD COLUMN "key" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "cron_jobs" ADD COLUMN "options" jsonb DEFAULT '{}' NOT NULL;--> statement-breakpoint
ALTER TABLE "cron_jobs" ADD COLUMN "last_run_at" timestamp;--> statement-breakpoint
ALTER TABLE "cron_jobs" ADD COLUMN "next_run_at" timestamp;--> statement-breakpoint
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
CREATE INDEX "users_role_idx" ON "users" USING btree ("role");--> statement-breakpoint
ALTER TABLE "cron_jobs" DROP COLUMN "task";--> statement-breakpoint
ALTER TABLE "mangas" DROP COLUMN "cover_image_object_key";--> statement-breakpoint
ALTER TABLE "mangas" DROP COLUMN "banner_image_object_key";--> statement-breakpoint
ALTER TABLE "cron_jobs" ADD CONSTRAINT "cron_jobs_key_unique" UNIQUE("key");