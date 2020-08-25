import { format } from "date-fns";

export const formatDateTime = (date: number | Date): string =>
  format(date, "d MMM yyyy, h:mma");
