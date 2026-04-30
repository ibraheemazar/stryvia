-- STRYVIA — application roles
--
-- Three roles provide least-privilege access to the six domain schemas:
--
--   stryvia_admin  : full DDL/DML — used by Alembic migrations and admin tools
--   stryvia_app    : read/write on all six schemas — the runtime application role
--   stryvia_read   : read-only — analytics, reporting, BI exports
--
-- Default privileges are configured below so that any tables, sequences,
-- and functions *created in the future* by stryvia_admin (i.e. by Alembic
-- migrations) automatically grant the right access to stryvia_app and
-- stryvia_read. Without ALTER DEFAULT PRIVILEGES, every new migration
-- would have to remember to GRANT manually.
--
-- LOCAL-DEV PASSWORDS
-- -------------------
-- The passwords below are placeholders for local development on a
-- loopback-bound Postgres. They are NOT secrets. In any non-local
-- deployment these roles must be (re)created with strong, secret-managed
-- passwords — see services/engine/README.md.
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1. Roles
-- ----------------------------------------------------------------------------
CREATE ROLE stryvia_admin LOGIN PASSWORD 'stryvia_admin_devpw' CREATEDB;
COMMENT ON ROLE stryvia_admin IS
    'Owns schema objects; used by migrations and admin tooling. Local-dev role.';

CREATE ROLE stryvia_app LOGIN PASSWORD 'stryvia_app_devpw';
COMMENT ON ROLE stryvia_app IS
    'Runtime application role: read/write on all six STRYVIA schemas. Local-dev role.';

CREATE ROLE stryvia_read LOGIN PASSWORD 'stryvia_read_devpw';
COMMENT ON ROLE stryvia_read IS
    'Read-only role for analytics and reporting. Local-dev role.';


-- ----------------------------------------------------------------------------
-- 2. Schema ownership and access
--
-- stryvia_admin owns every domain schema (so it can run DDL freely).
-- stryvia_app and stryvia_read get USAGE on each schema.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    s text;
BEGIN
    FOREACH s IN ARRAY ARRAY['scripts','analysis','valuations','benchmarks','accounts','learning']
    LOOP
        EXECUTE format('ALTER SCHEMA %I OWNER TO stryvia_admin', s);
        EXECUTE format('GRANT USAGE ON SCHEMA %I TO stryvia_app, stryvia_read', s);
    END LOOP;
END
$$;


-- ----------------------------------------------------------------------------
-- 3. Default privileges for FUTURE objects
--
-- These apply only to objects created *by stryvia_admin* (the migration role)
-- inside each schema. That is exactly the path Alembic takes, so every
-- future migration's tables/sequences will get the right grants automatically.
-- ----------------------------------------------------------------------------
DO $$
DECLARE
    s text;
BEGIN
    FOREACH s IN ARRAY ARRAY['scripts','analysis','valuations','benchmarks','accounts','learning']
    LOOP
        -- stryvia_app: full DML on tables, USAGE+SELECT on sequences
        EXECUTE format(
            'ALTER DEFAULT PRIVILEGES FOR ROLE stryvia_admin IN SCHEMA %I '
            'GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO stryvia_app', s);
        EXECUTE format(
            'ALTER DEFAULT PRIVILEGES FOR ROLE stryvia_admin IN SCHEMA %I '
            'GRANT USAGE, SELECT ON SEQUENCES TO stryvia_app', s);
        EXECUTE format(
            'ALTER DEFAULT PRIVILEGES FOR ROLE stryvia_admin IN SCHEMA %I '
            'GRANT EXECUTE ON FUNCTIONS TO stryvia_app', s);

        -- stryvia_read: read-only on tables, SELECT on sequences
        EXECUTE format(
            'ALTER DEFAULT PRIVILEGES FOR ROLE stryvia_admin IN SCHEMA %I '
            'GRANT SELECT ON TABLES TO stryvia_read', s);
        EXECUTE format(
            'ALTER DEFAULT PRIVILEGES FOR ROLE stryvia_admin IN SCHEMA %I '
            'GRANT SELECT ON SEQUENCES TO stryvia_read', s);
    END LOOP;
END
$$;
