/**
 * Longitudinal symptom profiles: deltas and trajectory summaries.
 */

import {
  COGNITIVE_SEVERITY_ORDINAL,
  CognitiveDomain,
  type CognitiveDomain as CognitiveDomainT,
  type CognitiveSeverity,
} from "../enums/cognitive.js";
import type { SymptomProfile } from "../domain/symptomProfile.js";

export type CognitiveDelta = {
  domain: CognitiveDomainT;
  fromSeverity: CognitiveSeverity;
  toSeverity: CognitiveSeverity;
  deltaOrdinal: number;
  direction: "improving" | "stable" | "declining";
};

export function computeCognitiveDelta(
  from: SymptomProfile,
  to: SymptomProfile,
  domain: CognitiveDomainT,
): CognitiveDelta | null {
  const a = from.cognitiveScores.find((c) => c.domain === domain);
  const b = to.cognitiveScores.find((c) => c.domain === domain);
  if (!a || !b) return null;
  const oa = COGNITIVE_SEVERITY_ORDINAL[a.severity];
  const ob = COGNITIVE_SEVERITY_ORDINAL[b.severity];
  const deltaOrdinal = ob - oa;
  let direction: CognitiveDelta["direction"] = "stable";
  if (deltaOrdinal > 0) direction = "declining";
  if (deltaOrdinal < 0) direction = "improving";
  return {
    domain,
    fromSeverity: a.severity,
    toSeverity: b.severity,
    deltaOrdinal,
    direction,
  };
}

export type TrajectorySummary = {
  domain: CognitiveDomainT;
  snapshots: number;
  firstSeverity: CognitiveSeverity;
  lastSeverity: CognitiveSeverity;
  netDeltaOrdinal: number;
  narrative: string;
};

export function trajectorySummaryForDomain(
  snapshots: SymptomProfile[],
  domain: CognitiveDomainT,
): TrajectorySummary | null {
  const ordered = [...snapshots].sort(
    (a, b) => a.capturedAt.getTime() - b.capturedAt.getTime(),
  );
  const points = ordered
    .map((s) => s.cognitiveScores.find((c) => c.domain === domain))
    .filter(Boolean);
  if (points.length < 2) return null;
  const first = points[0]!;
  const last = points[points.length - 1]!;
  const oFirst = COGNITIVE_SEVERITY_ORDINAL[first.severity];
  const oLast = COGNITIVE_SEVERITY_ORDINAL[last.severity];
  const netDeltaOrdinal = oLast - oFirst;
  const narrative = `${domain}: ${first.severity} → ${last.severity} over ${points.length} snapshot(s) (Δordinal=${netDeltaOrdinal})`;
  return {
    domain,
    snapshots: points.length,
    firstSeverity: first.severity,
    lastSeverity: last.severity,
    netDeltaOrdinal,
    narrative,
  };
}

export { CognitiveDomain };
