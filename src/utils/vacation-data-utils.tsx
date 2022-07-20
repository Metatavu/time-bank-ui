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
   * @param dateEntries daily entries from api request
   * @return weeks and days of vacation 
   */
  public static vacationDaysProcess = (dateEntries: DailyEntry[]): VacationWeekData[] => {
    const vacationDays: VacationDayData[] = [];
    const vacationWeeks: VacationWeekData[] = [];

    dateEntries.forEach(
      entry => {
        if (entry.isVacation) {
          const weekNumber = getISOWeek(new Date(entry.date));
          vacationDays.push({
            weekNumber: weekNumber,
            day: entry.date
          });
        }
      }
    );
    vacationDays.reverse();
    for (let index = 0; index < vacationDays.length; index++) {
      let oneWeek: VacationDayData[] = [];
      oneWeek = vacationDays.filter(entry => entry.weekNumber === vacationDays[index].weekNumber);

      const idx = vacationWeeks.findIndex(object => object.weekNumber === oneWeek[0].weekNumber);

      if (idx === -1) {
        vacationWeeks.push({
          weekNumber: oneWeek[0].weekNumber,
          vacationDays: oneWeek
        });
      }
    }
    return vacationWeeks;
  };

}