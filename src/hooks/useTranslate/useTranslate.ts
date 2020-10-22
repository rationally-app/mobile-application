import { useContext } from "react";
import { Translations } from "../../common/i18n/translations/type";
import { CampaignConfigContext } from "../../context/campaignConfig";
import { CampaignPolicy } from "../../types";
import i18n from "i18n-js";
import { CampaignConfigsStoreContext } from "../../context/campaignConfigsStore";

export type TranslationHook = {
  c13nt: (key: string, campaignKey?: string) => string;
  c13ntForUnit: (
    unit: CampaignPolicy["quantity"]["unit"]
  ) => CampaignPolicy["quantity"]["unit"];
  i18nt: <
    T extends keyof Translations,
    U extends keyof Translations[T],
    V extends keyof Translations[T][U]
  >(
    component: T,
    subComponent: U,
    subSubComponent?: V,
    dynamicContent?: Record<string, string | number>
  ) => string;
};

export const i18ntWithValidator = <
  T extends keyof Translations,
  U extends keyof Translations[T],
  V extends keyof Translations[T][U]
>(
  component: T,
  subComponent: U,
  subSubComponent?: V,
  dynamicContent?: Record<string, string | number>
): string => {
  return i18n.t(
    `${component}.${subComponent}${
      subSubComponent ? `.${subSubComponent}` : ""
    }`,
    dynamicContent
  );
};

export const useTranslate = (): TranslationHook => {
  const { c13n } = useContext(CampaignConfigContext);
  const { allCampaignConfigs } = useContext(CampaignConfigsStoreContext);

  const c13nt = (key: string, campaignKey?: string): string => {
    let c13nStore = c13n;
    if (campaignKey) {
      c13nStore = allCampaignConfigs[campaignKey]?.c13n ?? null;
    }
    return (c13nStore && key && c13nStore[key]) ?? key;
  };

  const c13ntForUnit = (
    unit: CampaignPolicy["quantity"]["unit"]
  ): CampaignPolicy["quantity"]["unit"] =>
    unit && {
      ...unit,
      label: c13nt(unit.label),
    };

  const i18nt = i18ntWithValidator;

  return { c13nt, c13ntForUnit, i18nt };
};
