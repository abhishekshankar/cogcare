import type { DrugCatalogEntry } from "../domain/medication.js";

/** Curated entries for invariant tests and seed data; extend via DB `DrugCatalog`. */
export const DRUG_CATALOG_SEED: DrugCatalogEntry[] = [
  {
    id: "drug_haloperidol",
    code: "HALOPERIDOL",
    name: "Haloperidol",
    class: "Typical antipsychotic",
    typicalAntipsychotic: true,
    d2AntagonistHighRiskForDlb: true,
    anticholinergicBurdenScore: 0,
    dlbCaution: true,
  },
  {
    id: "drug_metoclopramide",
    code: "METOCLOPRAMIDE",
    name: "Metoclopramide",
    class: "D2 antagonist (GI)",
    typicalAntipsychotic: false,
    d2AntagonistHighRiskForDlb: true,
    anticholinergicBurdenScore: 0,
    dlbCaution: true,
  },
];

export function getDrugByCode(code: string): DrugCatalogEntry | undefined {
  return DRUG_CATALOG_SEED.find((d) => d.code === code);
}
