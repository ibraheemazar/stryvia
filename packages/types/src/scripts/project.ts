import type { LocalizedText, Money } from '../common/enums.js';
import type { OrganizationId, PlatformProfileId, ProjectId, UserId } from '../common/ids.js';

/** Lifecycle stage of a TV/film project. */
export type ProjectStage =
  | 'development'
  | 'pre_production'
  | 'production'
  | 'post_production'
  | 'completed';

/** Format/length classification of a project. */
export type ProjectFormat = 'series' | 'film' | 'mini_series';

/** Origin of the underlying intellectual property. */
export type IpOrigin = 'original' | 'adaptation' | 'sequel' | 'remake';

/** Distribution-platform attachment status for a project. */
export type PlatformStatus = 'open' | 'probable' | 'confirmed';

/**
 * Cultural release window — strongly influences audience reach in MENA markets
 * (Ramadan primetime in particular drives ~2x viewership for many genres).
 *
 * Defined here as the canonical home; `benchmarks/cultural` imports it.
 */
export type ReleaseWindow =
  | 'ramadan'
  | 'eid_al_fitr'
  | 'eid_al_adha'
  | 'national_day'
  | 'summer'
  | 'winter'
  | 'off_season';

/** Top-level genre classification. A project may carry multiple genres. */
export type Genre =
  | 'drama'
  | 'comedy'
  | 'thriller'
  | 'action'
  | 'romance'
  | 'family'
  | 'historical'
  | 'sci_fi'
  | 'fantasy'
  | 'horror'
  | 'documentary'
  | 'reality'
  | 'anthology';

/**
 * A TV/film project tracked in STRYVIA — the central entity scenes,
 * characters, opportunities, and valuations attach to.
 *
 * Mirrors `scripts.projects` (architecture v2 §9.1).
 */
export interface Project {
  readonly id: ProjectId;
  readonly organizationId: OrganizationId;
  readonly title: LocalizedText;
  readonly format: ProjectFormat;
  readonly stage: ProjectStage;
  readonly ipOrigin: IpOrigin;
  readonly primaryGenre: Genre;
  readonly genres: readonly Genre[];
  readonly platformStatus: PlatformStatus;
  readonly platformProfileId: PlatformProfileId | null;
  readonly platformName: string | null;
  readonly releaseWindow: ReleaseWindow;
  readonly targetReleaseDate: Date | string | null;
  readonly episodeCount: number | null;
  readonly runtimeMinutes: number | null;
  readonly productionBudget: Money | null;
  readonly territories: readonly string[];
  readonly synopsis: LocalizedText | null;
  readonly showrunner: string | null;
  readonly createdBy: UserId;
  readonly createdAt: Date | string;
  readonly updatedAt: Date | string;
  /** TODO: extended cast/crew, production company, slug, tags — fields land in 1A.5 with the script schema. */
  readonly metadata: Record<string, unknown>;
}

/** Lightweight projection of a Project for list/card views. */
export interface ProjectMetadata {
  readonly id: ProjectId;
  readonly title: LocalizedText;
  readonly format: ProjectFormat;
  readonly stage: ProjectStage;
  readonly primaryGenre: Genre;
  readonly platformStatus: PlatformStatus;
  readonly releaseWindow: ReleaseWindow;
  readonly updatedAt: Date | string;
}
