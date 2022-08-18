import { PersonTotalTime, DailyEntry } from "generated/client";
import moment from "moment";
import { FilterScopes, WorkTimeCategory, WorkTimeData, WorkTimeDatas, WorkTimeTotalData } from "types";

/**
 * Utility class for time values
 */
export default class WorkTimeDataUtils {

  /**
   * Preprocess the date entries for graphs
   * 
   * @param dateEntries sorted daily entries from api request 
   * @return processed work time data, work time total data
   */
  public static dateEntriesPreprocess = (dateEntries: DailyEntry[]): WorkTimeDatas => {
    const workTimeData: WorkTimeData[] = [];
    const workTimeTotalData: WorkTimeTotalData = {
      name: WorkTimeCategory.BALANCE,
      balance: 0,
      logged: 0,
      expected: 0
    };

    dateEntries.forEach(
      entry => {
        workTimeData.push({
          name: moment(entry.date).format("YYYY-MM-DD"),
          expected: entry.expected,
          project: entry.projectTime,
          internal: entry.internalTime
        });
        workTimeTotalData.balance += entry.balance;
        workTimeTotalData.logged! += entry.logged;
        workTimeTotalData.expected! += entry.expected;
      }
    );

    return { workTimeData: workTimeData, workTimeTotalData: workTimeTotalData };
  };

  /**
   * Preprocess the week, month and year entries for graphs
   * 
   * @param weekEntries sorted week, month or year entries from api request 
   * @param scope filter scope
   * @return processed work time data, work time total data
   */
  public static weeksYearsAndMonthsPreprocess = (weekEntries: PersonTotalTime[], scope: FilterScopes): WorkTimeDatas => {
    const workTimeData: WorkTimeData[] = [];
    const workTimeTotalData: WorkTimeTotalData = {
      name: WorkTimeCategory.BALANCE,
      balance: 0,
      logged: 0,
      expected: 0
    };

    weekEntries.forEach(
      entry => {
        workTimeData.push({
          name: WorkTimeDataUtils.getTimeDataName(entry, scope),
          expected: entry.expected,
          project: entry.projectTime,
          internal: entry.internalTime
        });
        workTimeTotalData.balance += entry.balance;
        workTimeTotalData.logged! += entry.logged;
        workTimeTotalData.expected! += entry.expected;
      }
    );

    return { workTimeData: workTimeData, workTimeTotalData: workTimeTotalData };
  };

  /**
   * Get time data name
   *
   * @param entry entry
   * @param scope filter scope
   * @returns time data name
   */
  private static getTimeDataName = (entry: PersonTotalTime, scope: FilterScopes): string => {
    const timePeriod = entry.timePeriod || "";
    const getTimeData = timePeriod.split(",");
    const year = Number(getTimeData[0]);
    const month = Number(getTimeData[1]);
    const week = Number(getTimeData[2]);
    if (!entry.personId) {
      return "";
    }

    return {
      [FilterScopes.DATE]: "",
      [FilterScopes.WEEK]: `${year!}/${week!}`,
      [FilterScopes.MONTH]: `${year!}-${month!}`,
      [FilterScopes.YEAR]: `${year!}`
    }[scope];
  };

}