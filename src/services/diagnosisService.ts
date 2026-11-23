/**
 * Diagnosis graph: syndromes and etiologies with confidence, validated against workups.
 */

import { assertEstablishedByBiomarkerHasSupport } from "../domain/etiology.js";
import type { PatientEtiology } from "../domain/etiology.js";
import { PatientEtiologySchema } from "../domain/etiology.js";
import type { PatientSyndrome } from "../domain/syndrome.js";
import { PatientSyndromeSchema } from "../domain/syndrome.js";
import { toWorkupEvidenceSlice } from "../domain/workup.js";
import type { Workup } from "../domain/workup.js";
import type { DomainResult } from "../domain/result.js";
import { err, ok } from "../domain/result.js";
import type { DomainError } from "../domain/result.js";

export type ClinicalEventInput = {
  patientId: string;
  eventType: string;
  payload: Record<string, unknown>;
  rationale?: string;
};

export function parsePatientSyndrome(
  input: unknown,
): DomainResult<PatientSyndrome> {
  const parsed = PatientSyndromeSchema.safeParse(input);
  if (!parsed.success) {
    return err([
      {
        code: "VALIDATION",
        message: parsed.error.message,
      },
    ]);
  }
  return ok(parsed.data);
}

export function parsePatientEtiology(
  input: unknown,
): DomainResult<PatientEtiology> {
  const parsed = PatientEtiologySchema.safeParse(input);
  if (!parsed.success) {
    return err([
      {
        code: "VALIDATION",
        message: parsed.error.message,
      },
    ]);
  }
  return ok(parsed.data);
}

/**
 * Validates etiology confidence against supporting workups (biomarker lock).
 */
export function validatePatientEtiologyAgainstWorkups(
  link: PatientEtiology & { id: string },
  workups: Array<Workup & { id?: string }>,
): DomainResult<void> {
  const slices = workups.map((w) => toWorkupEvidenceSlice(w));
  return assertEstablishedByBiomarkerHasSupport(link, slices);
}

export type EtiologyConsistencyIssue = {
  patientEtiologyId: string;
  etiology: PatientEtiology["etiology"];
  errors: DomainError[];
};

/**
 * Re-evaluates all etiology links; returns links that fail biomarker consistency.
 */
export function recomputeConfidenceConsistency(
  links: Array<PatientEtiology & { id: string }>,
  workups: Array<Workup & { id?: string }>,
): EtiologyConsistencyIssue[] {
  const issues: EtiologyConsistencyIssue[] = [];
  const slices = workups.map((w) => toWorkupEvidenceSlice(w));
  for (const link of links) {
    const r = assertEstablishedByBiomarkerHasSupport(link, slices);
    if (!r.ok) {
      issues.push({
        patientEtiologyId: link.id,
        etiology: link.etiology,
        errors: r.errors,
      });
    }
  }
  return issues;
}

/** Builds an audit payload for DLB psychotropic override (caller persists `ClinicalEvent`). */
export function buildDlbOverrideEvent(
  input: ClinicalEventInput,
): ClinicalEventInput {
  return {
    ...input,
    eventType: "DLB_PSYCHOTROPIC_OVERRIDE",
    payload: {
      ...input.payload,
      recordedAt: new Date().toISOString(),
    },
  };
}
