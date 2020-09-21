import zh from "./translations/zh.json";
import en from "./translations/en.json";
import i18n from "i18n-js";
import * as Localization from "expo-localization";

i18n.fallbacks = true;
i18n.locale = Localization.locale;
i18n.translations = {
  zh,
  en
};
