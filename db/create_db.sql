
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the users table
CREATE TABLE users (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    profile_image TEXT,
    cover_image TEXT,
    is_administrator BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX users_email_index ON users(email);
CREATE UNIQUE INDEX users_username_index ON users(username);

-- Create the genres table
CREATE TABLE genres (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX genres_name_index ON genres(name);

CREATE TABLE demographics (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE TYPE publication_status AS ENUM ('RELEASING', 'FINISHED', 'HIATUS', 'CANCELLED', 'NOT_YET_RELEASED', 'UNKNOWN');

-- Create the mangas table
CREATE TABLE mangas (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    id_demography UUID NOT NULL REFERENCES demographics(id) ON DELETE CASCADE,
    original_name TEXT NOT NULL UNIQUE,
    alternative_names TEXT[],
    description TEXT NOT NULL,
    chapters SMALLINT NOT NULL,
    release_date DATE,
    cover_image TEXT,
    banner_image TEXT,
    publication_status publication_status NOT NULL,
    rating INTEGER NOT NULL DEFAULT 0,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX mangas_original_name_index ON mangas(original_name);
CREATE INDEX mangas_created_at_index ON mangas(created_at);
CREATE INDEX mangas_updated_at_index ON mangas(updated_at);

-- Create the manga_genres table
CREATE TABLE manga_genres (
    manga_id UUID NOT NULL REFERENCES mangas(id) ON DELETE CASCADE,
    genre_id UUID NOT NULL REFERENCES genres(id)
);

CREATE UNIQUE INDEX manga_genres_manga_id_genre_id_index ON manga_genres(manga_id, genre_id);

-- Create the chapters table
CREATE TABLE chapters (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    manga_id UUID NOT NULL REFERENCES mangas(id) ON DELETE CASCADE,
    chapter_number SMALLINT NOT NULL,
    release_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX chapters_manga_id_chapter_number_index ON chapters(manga_id, chapter_number);
CREATE INDEX chapters_created_at_index ON chapters(created_at);
CREATE INDEX chapters_updated_at_index ON chapters(updated_at);

CREATE TYPE user_manga_status AS ENUM ('READING', 'COMPLETED', 'DROPPED', 'PLANNING_TO_READ', 'PAUSED', 'UNKNOWN');

-- Create the user_mangas table
CREATE TABLE user_mangas (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    manga_id UUID NOT NULL REFERENCES mangas(id) ON DELETE CASCADE,
    rating INTEGER,
    status user_manga_status NOT NULL DEFAULT 'PLANNING_TO_READ',
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX user_mangas_user_id_manga_id_index ON user_mangas(user_id, manga_id);
CREATE INDEX user_mangas_created_at_index ON user_mangas(created_at);
CREATE INDEX user_mangas_updated_at_index ON user_mangas(updated_at);

-- Create the user_read_chapters table
CREATE TABLE user_chapters (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    chapter_id UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX user_read_chapters_user_id_chapter_id_index ON user_chapters(user_id, chapter_id);
CREATE INDEX user_chapters_created_at_index ON user_chapters(created_at);
CREATE INDEX user_chapters_updated_at_index ON user_chapters(updated_at);

CREATE TABLE user_favorite_mangas (
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    manga_id UUID NOT NULL REFERENCES mangas(id) ON DELETE CASCADE,
    favorited_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX user_favorite_mangas_user_id_manga_id_index ON user_favorite_mangas(user_id, manga_id);
CREATE INDEX user_favorite_mangas_favorited_at_index ON user_favorite_mangas(favorited_at);

CREATE TABLE authors (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ
);

CREATE UNIQUE INDEX authors_name_index ON authors(name);

CREATE TABLE manga_authors (
    manga_id UUID NOT NULL REFERENCES mangas(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES authors(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX manga_authors_manga_id_author_id_index ON manga_authors(manga_id, author_id);
