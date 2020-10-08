import i18n from "i18n-js";
import { Translations } from "../common/i18n/translations/type";

export const i18nt = <
  T extends keyof Translations,
  U extends keyof Translations[T],
  V extends keyof Translations[T][U]
>(
  componentName: T,
  componentString: U,
  errorMessageContent?: V,
  dynamicContent?: Record<string, string | number>
): string => {
  if (!errorMessageContent) {
    return i18n.t(`${componentName}.${componentString}`, dynamicContent);
  } else {
    return i18n.t(
      `${componentName}.${componentString}.${errorMessageContent}`,
      dynamicContent
    );
  }
};
