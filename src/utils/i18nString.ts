import i18n from "i18n-js";
import { Translations } from "../common/i18n/translations/type";

export const i18nString = <
  T extends keyof Translations,
  U extends keyof Translations[T]
>(
  componentName: T,
  componentString: U,
  dynamicContent?: Record<string, string | number>
): string => {
  return i18n.t(`${componentName}.${componentString}`, dynamicContent);
};

export const i18nErrorString = <
  T extends keyof Translations["errorMessages"],
  U extends keyof Translations["errorMessages"][T]
>(
  errorMessage: T,
  errorMessageContent: U,
  dynamicContent?: Record<string, string | number>
): string => {
  return i18n.t(
    `errorMessages.${errorMessage}.${errorMessageContent}`,
    dynamicContent
  );
};
