import { format, isValid } from "date-fns";
import DEFAULT_LOCALE from "date-fns/locale/en-US";

const dateLocale = DEFAULT_LOCALE;

type DateFormat =
  | "dd/MM/yyyy" //  16/08/1985
  | "PPPP" // Friday, April 29th, 2022	
  | "p" // 12:00 AM

export function formatDate(
  date: Date | string,
  dateFormat: DateFormat = "dd/MM/yyyy"
) {
  if (!isValid(new Date(date))) {
    throw new Error(`formatDate requires a valid date: "${date}" is not valid`);
  }
  return format(new Date(date), dateFormat, { locale: dateLocale });
}
