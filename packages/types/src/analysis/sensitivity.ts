import type { LocalizedText } from '../common/enums.js';
import type { OpportunityId, ProjectId, SceneId, SensitivityFlagId } from '../common/ids.js';

/** Domain of a sensitivity concern. */
export type SensitivityCategory =
  | 'cultural'
  | 'religious'
  | 'political'
  | 'regional'
  | 'brand_safety'
  | 'age_appropriate'
  | 'legal_compliance';

/** Severity of a sensitivity concern — drives whether a flag blocks placement. */
export type SensitivitySeverity = 'low' | 'medium' | 'high' | 'critical';

/** Resolution status applied by an analyst. */
export type SensitivityFlagStatus = 'open' | 'acknowledged' | 'mitigated' | 'dismissed';

/**
 * A sensitivity concern raised against a scene or opportunity — for example,
 * an opportunity that conflicts with regional cultural norms during Ramadan.
 */
export interface SensitivityFlag {
  readonly id: SensitivityFlagId;
  readonly projectId: ProjectId;
  readonly sceneId: SceneId | null;
  readonly opportunityId: OpportunityId | null;
  readonly category: SensitivityCategory;
  readonly severity: SensitivitySeverity;
  readonly status: SensitivityFlagStatus;
  readonly title: LocalizedText;
  readonly rationale: LocalizedText;
  readonly affectedTerritories: readonly string[];
  readonly raisedAt: Date | string;
  readonly resolvedAt: Date | string | null;
}
