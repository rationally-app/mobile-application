import i18n from "i18n-js";
import { Translations } from "../common/i18n/translations/type";

export const i18nt = <
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
