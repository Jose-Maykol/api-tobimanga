-- Create the users table
CREATE TABLE users (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    profile_image_url TEXT,
    administrator BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX users_email_index ON users(email);
CREATE UNIQUE INDEX users_username_index ON users(username);

-- Create the genres table
CREATE TABLE genres (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX genres_name_index ON genres(name);

-- Create the mangas table
CREATE TABLE mangas (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    chapters INTEGER NOT NULL,
    release_year INTEGER,
    image_url TEXT,
    finalized BOOLEAN NOT NULL DEFAULT FALSE,
    rating INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX mangas_title_index ON mangas(title);

-- Create the manga_genres table
CREATE TABLE manga_genres (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    manga_id UUID NOT NULL REFERENCES mangas(id),
    genre_id UUID NOT NULL REFERENCES genres(id)
);

-- Create the chapters table
CREATE TABLE chapters (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    manga_id UUID NOT NULL REFERENCES mangas(id),
    chapter_number INTEGER NOT NULL,
    release_date DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX chapters_manga_id_chapter_number_index ON chapters(manga_id, chapter_number);

-- Create the user_mangas table
CREATE TABLE user_mangas (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    manga_id UUID NOT NULL REFERENCES mangas(id),
    rating INTEGER,
    favorite BOOLEAN NOT NULL DEFAULT FALSE,
    dropped BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX user_mangas_user_id_manga_id_index ON user_mangas(user_id, manga_id);

-- Create the user_read_chapters table
CREATE TABLE user_chapters (
    id UUID NOT NULL PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    chapter_id UUID NOT NULL REFERENCES chapters(id),
    read BOOLEAN NOT NULL DEFAULT FALSE,
    read_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX user_read_chapters_user_id_chapter_id_index ON user_chapters(user_id, chapter_id);
