ALTER TABLE "mangas" ADD COLUMN "slug_name" text;--> statement-breakpoint
ALTER TABLE "mangas" ADD COLUMN "scrapping_name" text;--> statement-breakpoint
ALTER TABLE "mangas" ADD CONSTRAINT "mangas_slug_name_unique" UNIQUE("slug_name");--> statement-breakpoint
ALTER TABLE "mangas" ADD CONSTRAINT "mangas_scrapping_name_unique" UNIQUE("scrapping_name");