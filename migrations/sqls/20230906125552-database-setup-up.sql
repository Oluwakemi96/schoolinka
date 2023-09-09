/* Replace with your SQL commands */
/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE IF NOT EXISTS users (
    id SERIAL,
    user_id VARCHAR PRIMARY KEY DEFAULT 'user-' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() AS VARCHAR(50))
            , '-',''
        )
    ),
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION make_lower_trim() RETURNS TRIGGER AS '
    BEGIN
        new.first_name := LOWER(TRIM(new.first_name));
        new.last_name := LOWER(TRIM(new.last_name));
        new.email := LOWER(TRIM(new.email));
        RETURN NEW;
    END;
    ' LANGUAGE plpgsql;
CREATE TRIGGER make_lower_trim BEFORE INSERT OR UPDATE ON users FOR
EACH ROW EXECUTE PROCEDURE make_lower_trim();

CREATE TABLE IF NOT EXISTS posts (
    id SERIAL,
    post_id VARCHAR PRIMARY KEY DEFAULT 'post-' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() AS VARCHAR(50))
            , '-',''
        )
    ),
    user_id VARCHAR REFERENCES users(user_id),
    post_title VARCHAR NOT NULL, 
    content VARCHAR NOT NULL,
    is_deleted BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);


CREATE INDEX posts_post_id_index ON posts(post_id);
CREATE INDEX posts_user_id_index ON posts(user_id);
CREATE INDEX users_user_id_index ON users(user_id);

