-- STRYVIA — domain schemas
--
-- Each schema corresponds to a bounded context in the architecture.
-- Tables are added in subsequent sessions (1A.4+); this script only
-- creates the schemas themselves and labels them.

CREATE SCHEMA IF NOT EXISTS scripts;
COMMENT ON SCHEMA scripts IS
    'Encrypted screenplay storage and project metadata. '
    'Source-of-truth for uploaded scripts and the productions they belong to.';

CREATE SCHEMA IF NOT EXISTS analysis;
COMMENT ON SCHEMA analysis IS
    'Derived script intelligence: scene maps, character profiles, '
    'and identified brand-integration opportunities.';

CREATE SCHEMA IF NOT EXISTS valuations;
COMMENT ON SCHEMA valuations IS
    'Outputs of the valuation engine — per-opportunity valuations, '
    'scenario runs, and generated reports.';

CREATE SCHEMA IF NOT EXISTS benchmarks;
COMMENT ON SCHEMA benchmarks IS
    'Reference data for valuation: rate cards, talent profiles, '
    'and platform/distribution profiles.';

CREATE SCHEMA IF NOT EXISTS accounts;
COMMENT ON SCHEMA accounts IS
    'Tenant boundary: organizations, users, role assignments, '
    'permissions, and audit logs.';

CREATE SCHEMA IF NOT EXISTS learning;
COMMENT ON SCHEMA learning IS
    'Closed-loop learning: predictions logged at valuation time, '
    'realized outcomes, and model recalibration state.';
