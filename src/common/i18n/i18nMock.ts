import { zh } from "./translations/zh";
import { en } from "./translations/en";
import i18n from "i18n-js";

i18n.fallbacks = true;
i18n.locale = "en";
i18n.translations = {
  zh,
  en
};
