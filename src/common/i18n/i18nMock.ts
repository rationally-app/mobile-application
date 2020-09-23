import zh from "./translations/zh.json";
import en from "./translations/en.json";
import i18n from "i18n-js";

i18n.fallbacks = true;
i18n.locale = "en";
i18n.translations = {
  zh,
  en
};
