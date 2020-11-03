import { format, formatDistance } from "date-fns";
import { zhCN } from "date-fns/locale";
import i18n from "i18n-js";

export const formatDateTime = (date: number | Date): string =>
  format(date, "d MMM yyyy, h:mma");

export const formatDate = (date: number | Date): string =>
  format(date, "d MMM yyyy");

export const formatTimeDifference = (
  start: number | Date,
  end: number | Date
): string => {
  if (i18n.locale.startsWith("zh")) {
    return formatDistance(start, end, {
      locale: zhCN,
    });
  }
  return formatDistance(start, end);
};
