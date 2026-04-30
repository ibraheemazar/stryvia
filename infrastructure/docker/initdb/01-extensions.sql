-- STRYVIA — required PostgreSQL extensions
--
-- Installed into the default `public` schema so every other schema can
-- reference these symbols without qualification.
--   uuid-ossp  : uuid_generate_v4() and friends, used as primary keys
--   pgcrypto   : crypt(), gen_random_bytes() — script encryption primitives
--   pg_trgm    : trigram indexes for fuzzy text search (titles, names)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
