import { CampaignC13N, CampaignPolicy } from "../types";

export const extractTranslationFromC13N = (
  c13n: CampaignC13N,
  key: string | undefined | null
): string | undefined | null => (key && c13n[key]) ?? key;

export const extractUnitTranslationFromC13N = (
  c13n: CampaignC13N,
  unit: CampaignPolicy["quantity"]["unit"]
): CampaignPolicy["quantity"]["unit"] =>
  unit && {
    ...unit,
    label: extractTranslationFromC13N(c13n, unit.label)!
  };
