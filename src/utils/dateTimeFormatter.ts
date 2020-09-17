import { format, formatDistance } from "date-fns";
import { zhCN } from "date-fns/locale";
import * as Localization from "expo-localization";

export const formatDateTime = (date: number | Date): string =>
  format(date, "d MMM yyyy, h:mma");

export const formatDate = (date: number | Date): string =>
  format(date, "d MMM yyyy");

export const formatTimeDifference = (
  start: number | Date,
  end: number | Date
): string => {
  console.log(Localization.locale);
  if (Localization.locale.includes("zh")) {
    return formatDistance(start, end, {
      locale: zhCN
    });
  }
  return formatDistance(start, end);
};
