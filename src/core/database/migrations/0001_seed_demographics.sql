INSERT INTO demographics (name)
VALUES
    ('Shounen'),
    ('Seinen'),
    ('Shoujo'),
    ('Josei'),
    ('Kodomo')
ON CONFLICT (name) DO NOTHING;