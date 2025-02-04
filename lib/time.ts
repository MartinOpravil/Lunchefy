import { PlannerAge } from "@/enums";

export function convertToClientTime(serverDate: string) {
  const utcDate = new Date(serverDate);
  const localeDate = new Date(
    utcDate.getTime() + utcDate.getTimezoneOffset() * 60000
  );
  return localeDate;
}

export function convertListToClientTime(serverDateList: string[]) {}

export function convertToServerTime(clientDate: Date) {
  const result = new Date(
    Date.UTC(
      clientDate.getFullYear(),
      clientDate.getMonth(),
      clientDate.getDate()
    )
  ).toISOString();
  return result;
}

export function getISOMonth(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function getPlannerAgeMiliseconds(
  currentDate: number,
  plannerAge?: PlannerAge
) {
  const currDate = new Date(currentDate);

  switch (plannerAge) {
    case PlannerAge.Latest:
      return currDate.getTime();
    case PlannerAge.OneWeek:
      return new Date(currDate.setDate(currDate.getDate() - 7)).getTime();
    case PlannerAge.TwoWeeks:
      return new Date(currDate.setDate(currDate.getDate() - 14)).getTime();

    case PlannerAge.ThreeWeeks:
      return new Date(currDate.setDate(currDate.getDate() - 21)).getTime();

    case PlannerAge.OneMonth:
      return new Date(currDate.setDate(currDate.getDate() - 28)).getTime();

    default:
      return undefined;
  }
}
