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
