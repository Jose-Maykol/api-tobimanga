-- Insert mangas
INSERT INTO mangas (title, description, chapters, release_year, image_url, finalized)
VALUES
    ('Sousou no Frieren', 'Frieren es un miembro del grupo de héroes que derrotó al rey demonio. Tanto una maga como una elfo, esas son las cosas que la hacen diferente de los otros miembros. Siendo capaz de vivir más que los demás...', 130, 2020, 'https://otakuteca.com/images/books/cover/6548345bdf47f.webp', false),
    ('Jujutsu Kaisen', 'Yuji Itadori es un estudiante con una increíble fuerza física pero no tiene ningún interés en los deportes y prefiere ser parte del club de ocultismo. Un día, espíritu maligno real aparece en la escuela y cambia la vida de Yuji para siempre.', 261, 2018, 'https://otakuteca.com/images/books/cover/658c816be83be.webp', false),
    ('Kaiju No. 8', '¡Un hombre, descontento con el trabajo que ha tenido que hacer en la vida, se ve envuelto en un acontecimiento inesperado...! ¡Se convierte en un Kaiju, una criatura monstruosa, dándole así una nueva oportunidad de lograr lo que siempre soñó!', 107, 2020, 'https://otakuteca.com/images/books/cover/645e059754fcb.webp', false),
    ('Boku no Kokoro no Yabai Yatsu', 'Ichikawa es un estudiante de secundaria de actitud sombría al que le fastidia todo. Yamada, por su parte, es una amante de las golosinas que irradia alegría por todo lo alto. ¿Será Yamada la luz que Ichikawa necesita para salir de las sombras? ¡¡Una comedia romántica entre dos polos opuestos!!', 145, 2018, 'https://otakuteca.com/images/books/cover/61a7be3a79ea2.webp', false);

-- Insert genres
INSERT INTO genres (name) VALUES
    ('Action'),
    ('Adventure'),
    ('Comedy'),
    ('Drama'),
    ('Fantasy'),
    ('Horror'),
    ('Mystery'),
    ('Psychological'),
    ('Romance'),
    ('Sci-Fi'),
    ('Slice of Life');

-- Insert manga genres
INSERT INTO manga_genres (manga_id, genre_id)
SELECT mangas.id, genres.id
FROM mangas
CROSS JOIN genres
WHERE genres.name = 'Slice of Life' AND mangas.title IN ('Sousou no Frieren', 'Boku no Kokoro no Yabai Yatsu');

INSERT INTO manga_genres (manga_id, genre_id)
SELECT mangas.id, genres.id
FROM mangas
CROSS JOIN genres
WHERE genres.name = 'Action' AND mangas.title IN ('Jujutsu Kaisen', 'Kaiju No. 8');

INSERT INTO manga_genres (manga_id, genre_id)
SELECT mangas.id, genres.id
FROM mangas
CROSS JOIN genres
WHERE genres.name = 'Drama' AND mangas.title IN ('Sousou no Frieren', 'Jujutsu Kaisen');

INSERT INTO manga_genres (manga_id, genre_id)
SELECT mangas.id, genres.id
FROM mangas
CROSS JOIN genres
WHERE genres.name = 'Romance' AND mangas.title IN ('Boku no Kokoro no Yabai Yatsu');
