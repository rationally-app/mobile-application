import { zh } from "./translations/zh";
import { en } from "./translations/en";
import i18n from "i18n-js";
import * as Localization from "expo-localization";
import { Sentry } from "../../utils/errorTracking";

i18n.fallbacks = true;
i18n.locale = Localization.locale;
i18n.translations = {
  zh,
  en
};
i18n.missingTranslation = (scope: string) => {
  Sentry.addBreadcrumb({
    category: "translation",
    message: `A missing translation of scope ${scope} was found.`
  });
  return undefined;
};
