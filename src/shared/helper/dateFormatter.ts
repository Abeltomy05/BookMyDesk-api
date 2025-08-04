export const convertISTDateToUTC = (dateStr: string, endOfDay: boolean = false): Date => {
  const [year, month, day] = dateStr.split('-').map(Number);

  // local IST time
  const localDate = new Date(year, month - 1, day, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0, endOfDay ? 999 : 0);

   // Subtract IST offset (5 hours 30 minutes = 330 minutes)
  const utcDate = new Date(localDate.getTime() - (330 * 60 * 1000));

   return utcDate;
};