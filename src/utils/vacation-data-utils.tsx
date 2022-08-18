import { DailyEntry } from "generated/client";
import { VacationDayData, VacationWeekData } from "types";
import getISOWeek from "date-fns/getISOWeek";

/**
 * Utility class for vacation days
 */
export default class VacationDataUtils {

  /**
   * Preprocess list for vacation days and weeks
   * 
   * @param dailyEntry daily entries from api request
   * @return weeks and days of vacation 
   */
  public static vacationDaysProcess = (dailyEntries: DailyEntry[]): VacationWeekData[] => {
    const vacationDays: VacationDayData[] = dailyEntries
      .filter(dailyEntry => dailyEntry.isVacation)
      .map(dailyEntry => {
        return {
          weekNumber: getISOWeek(new Date(dailyEntry.date)),
          day: dailyEntry.date
        };
      }).reverse();

    const vacationWeeks: VacationWeekData[] = [];

    vacationDays.forEach((day: VacationDayData) => {
      const indexOfWeek = vacationWeeks.findIndex(x => x.weekNumber === day.weekNumber);
      if (indexOfWeek < 0) {
        vacationWeeks.push({
          weekNumber: day.weekNumber,
          vacationDays: [day]
        });
      } else {
        vacationWeeks[indexOfWeek].vacationDays.push(day);
      }
    });
    return vacationWeeks;
  };
  
}