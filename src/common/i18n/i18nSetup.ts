import { zh } from "./translations/zh";
import { en } from "./translations/en";
import i18n from "i18n-js";
import * as Localization from "expo-localization";

i18n.fallbacks = true;
i18n.locale = Localization.locale;
i18n.translations = {
  zh,
  en
};
i18n.missingTranslation = () => {
  return undefined;
};
