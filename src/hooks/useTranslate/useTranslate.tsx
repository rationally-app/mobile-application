import { useContext } from "react";
import { CampaignConfigContext } from "../../context/campaignConfig";
import { CampaignPolicy } from "../../types";

export type TranslationHook = {
  c13nt: (key: string) => string;
  c13ntForUnit: (
    unit: CampaignPolicy["quantity"]["unit"]
  ) => CampaignPolicy["quantity"]["unit"];
};

export const useTranslate = (): TranslationHook => {
  const { c13n } = useContext(CampaignConfigContext);

  const c13nt = (key: string): string => (!!key ? c13n[key] : key);

  const c13ntForUnit = (
    unit: CampaignPolicy["quantity"]["unit"]
  ): CampaignPolicy["quantity"]["unit"] =>
    unit && {
      ...unit,
      label: c13nt(unit.label)!
    };

  return { c13nt, c13ntForUnit };
};
