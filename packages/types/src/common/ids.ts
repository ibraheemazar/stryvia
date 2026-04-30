/**
 * Branded ID types — opaque string types that prevent accidental cross-domain
 * mixing. A Project cannot be assigned a UserId at compile time, even though
 * both are plain strings at runtime.
 *
 * Each ID has a `to{Name}` constructor that brands a raw string. These are
 * safety helpers, not validators: callers are responsible for ensuring the
 * input is a well-formed ID (e.g. a UUID coming from the database).
 */

/** Unique identifier for a Project. */
export type ProjectId = string & { readonly __brand: 'ProjectId' };
/** Brand a string as a {@link ProjectId}. */
export const toProjectId = (s: string): ProjectId => s as ProjectId;

/** Unique identifier for a User. */
export type UserId = string & { readonly __brand: 'UserId' };
/** Brand a string as a {@link UserId}. */
export const toUserId = (s: string): UserId => s as UserId;

/** Unique identifier for an Organization. */
export type OrganizationId = string & { readonly __brand: 'OrganizationId' };
/** Brand a string as an {@link OrganizationId}. */
export const toOrganizationId = (s: string): OrganizationId => s as OrganizationId;

/** Unique identifier for a Scene. */
export type SceneId = string & { readonly __brand: 'SceneId' };
/** Brand a string as a {@link SceneId}. */
export const toSceneId = (s: string): SceneId => s as SceneId;

/** Unique identifier for a Character. */
export type CharacterId = string & { readonly __brand: 'CharacterId' };
/** Brand a string as a {@link CharacterId}. */
export const toCharacterId = (s: string): CharacterId => s as CharacterId;

/** Unique identifier for an IntegrationOpportunity. */
export type OpportunityId = string & { readonly __brand: 'OpportunityId' };
/** Brand a string as an {@link OpportunityId}. */
export const toOpportunityId = (s: string): OpportunityId => s as OpportunityId;

/** Unique identifier for a SensitivityFlag. */
export type SensitivityFlagId = string & {
  readonly __brand: 'SensitivityFlagId';
};
/** Brand a string as a {@link SensitivityFlagId}. */
export const toSensitivityFlagId = (s: string): SensitivityFlagId => s as SensitivityFlagId;

/** Unique identifier for a ScriptUpload. */
export type ScriptUploadId = string & { readonly __brand: 'ScriptUploadId' };
/** Brand a string as a {@link ScriptUploadId}. */
export const toScriptUploadId = (s: string): ScriptUploadId => s as ScriptUploadId;

/** Unique identifier for an EngineRun. */
export type EngineRunId = string & { readonly __brand: 'EngineRunId' };
/** Brand a string as an {@link EngineRunId}. */
export const toEngineRunId = (s: string): EngineRunId => s as EngineRunId;

/** Unique identifier for an ArcValuation. */
export type ArcValuationId = string & { readonly __brand: 'ArcValuationId' };
/** Brand a string as an {@link ArcValuationId}. */
export const toArcValuationId = (s: string): ArcValuationId => s as ArcValuationId;

/** Unique identifier for a ProjectValuation. */
export type ProjectValuationId = string & {
  readonly __brand: 'ProjectValuationId';
};
/** Brand a string as a {@link ProjectValuationId}. */
export const toProjectValuationId = (s: string): ProjectValuationId => s as ProjectValuationId;

/** Unique identifier for a Report. */
export type ReportId = string & { readonly __brand: 'ReportId' };
/** Brand a string as a {@link ReportId}. */
export const toReportId = (s: string): ReportId => s as ReportId;

/** Unique identifier for a RateCard. */
export type RateCardId = string & { readonly __brand: 'RateCardId' };
/** Brand a string as a {@link RateCardId}. */
export const toRateCardId = (s: string): RateCardId => s as RateCardId;

/** Unique identifier for a TalentProfile. */
export type TalentProfileId = string & { readonly __brand: 'TalentProfileId' };
/** Brand a string as a {@link TalentProfileId}. */
export const toTalentProfileId = (s: string): TalentProfileId => s as TalentProfileId;

/** Unique identifier for a PlatformProfile. */
export type PlatformProfileId = string & {
  readonly __brand: 'PlatformProfileId';
};
/** Brand a string as a {@link PlatformProfileId}. */
export const toPlatformProfileId = (s: string): PlatformProfileId => s as PlatformProfileId;

/** Unique identifier for a GenreBenchmark. */
export type GenreBenchmarkId = string & {
  readonly __brand: 'GenreBenchmarkId';
};
/** Brand a string as a {@link GenreBenchmarkId}. */
export const toGenreBenchmarkId = (s: string): GenreBenchmarkId => s as GenreBenchmarkId;

/** Unique identifier for a CulturalCalendarEntry. */
export type CulturalCalendarEntryId = string & {
  readonly __brand: 'CulturalCalendarEntryId';
};
/** Brand a string as a {@link CulturalCalendarEntryId}. */
export const toCulturalCalendarEntryId = (s: string): CulturalCalendarEntryId =>
  s as CulturalCalendarEntryId;

/** Unique identifier for an Invitation. */
export type InvitationId = string & { readonly __brand: 'InvitationId' };
/** Brand a string as an {@link InvitationId}. */
export const toInvitationId = (s: string): InvitationId => s as InvitationId;

/** Unique identifier for an AuditLogEntry. */
export type AuditLogEntryId = string & { readonly __brand: 'AuditLogEntryId' };
/** Brand a string as an {@link AuditLogEntryId}. */
export const toAuditLogEntryId = (s: string): AuditLogEntryId => s as AuditLogEntryId;

/** Unique identifier for a Permission. */
export type PermissionId = string & { readonly __brand: 'PermissionId' };
/** Brand a string as a {@link PermissionId}. */
export const toPermissionId = (s: string): PermissionId => s as PermissionId;

/** Unique identifier for a Prediction. */
export type PredictionId = string & { readonly __brand: 'PredictionId' };
/** Brand a string as a {@link PredictionId}. */
export const toPredictionId = (s: string): PredictionId => s as PredictionId;

/** Unique identifier for an Outcome. */
export type OutcomeId = string & { readonly __brand: 'OutcomeId' };
/** Brand a string as an {@link OutcomeId}. */
export const toOutcomeId = (s: string): OutcomeId => s as OutcomeId;

/** Unique identifier for a RecalibrationRun. */
export type RecalibrationRunId = string & {
  readonly __brand: 'RecalibrationRunId';
};
/** Brand a string as a {@link RecalibrationRunId}. */
export const toRecalibrationRunId = (s: string): RecalibrationRunId => s as RecalibrationRunId;
