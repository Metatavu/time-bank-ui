import { TimeEntry, TimeEntryTotalDto } from "generated/client";
import strings from "localization/strings";
import moment from "moment";
import { WorkTimeCategory, WorkTimeData, WorkTimeDatas, WorkTimeTotalData } from "types";

/**
 * Utility class for time values
 */
export default class WorkTimeDataUtils {

  /**
   * Preprocess the date entries for graphs
   * 
   * @param dateEntries sorted date entries from api request 
   * @return processed work time data, work time total data
   */
  public static dateEntriesPreprocess = (dateEntries: TimeEntry[]): WorkTimeDatas => {
    const workTimeData: WorkTimeData[] = [];
    const workTimeTotalData: WorkTimeTotalData = {
      name: WorkTimeCategory.TOTAL,
      total: 0,
      logged: 0,
      expected: 0
    };

    dateEntries.forEach(
      entry => {
        workTimeData.push({
          name: entry.date.toISOString().split("T")[0],
          expected: entry.expected,
          project: entry.projectTime,
          internal: entry.internalTime
        });
        workTimeTotalData.total = workTimeTotalData.total + entry.total;
        workTimeTotalData.logged = workTimeTotalData.total + entry.logged;
        workTimeTotalData.expected = workTimeTotalData.total + entry.expected;
      }
    );

    return { workTimeData, workTimeTotalData };
  }

  /**
   * Preprocess the week, month and year entries for graphs
   * 
   * @param weekEntries sorted week, month or year entries from api request 
   * @param scope filter scope
   * @return processed work time data, work time total data
   */
  public static weeksYearsAndMonthsPreprocess = (weekEntries: TimeEntryTotalDto[], scope: FilterScopes): WorkTimeDatas => {
    const workTimeData: WorkTimeData[] = [];
    const workTimeTotalData: WorkTimeTotalData = {
      name: WorkTimeCategory.TOTAL,
      total: 0,
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
        workTimeTotalData.total = workTimeTotalData.total + entry.total;
        workTimeTotalData.logged = workTimeTotalData.total + entry.logged;
        workTimeTotalData.expected = workTimeTotalData.total + entry.expected;
      }
    );

    return { workTimeData, workTimeTotalData };
  }

  /**
   * Get time data name
   *
   * @param entry entry
   * @param scope filter scope
   * @returns time data name
   */
  private static getTimeDataName = (entry: TimeEntryTotalDto, scope: FilterScopes): string => {
    if (!entry.id) {
      return ""
    }

    return {
      [FilterScopes.DATE]: "",
      [FilterScopes.WEEK]: `${entry.id?.year!} ${strings.week} ${entry.id?.week!}`,
      [FilterScopes.MONTH]: `${entry.id?.year!}-${entry.id?.month!}`,
      [FilterScopes.YEAR]: `${entry.id?.year!}`
    }[scope];
  }

  /**
   * Proprocess the month entries for graphs
   * 
   * @param monthEntries sorted month entries from api request 
   * @return processed work time data, work time total data
   */
  public static monthEntriesPreprocess = (monthEntries: TimeEntryTotalDto[]): WorkTimeDatas => {
    const workTimeData: WorkTimeData[] = [];
    const workTimeTotalData: WorkTimeTotalData = {
      name: WorkTimeCategory.TOTAL,
      total: 0,
      logged: 0,
      expected: 0
    };

    monthEntries.forEach(
      entry => {
        workTimeData.push({
          name: `${entry.id?.year!}-${entry.id?.month!}`,
          expected: entry.expected,
          project: entry.projectTime,
          internal: entry.internalTime
        });
        workTimeTotalData.total = workTimeTotalData.total + entry.total;
        workTimeTotalData.logged = workTimeTotalData.total + entry.logged;
        workTimeTotalData.expected = workTimeTotalData.total + entry.expected;
      }
    );

    return { workTimeData, workTimeTotalData };
  }

  /**
   * Proprocess the year entries for graphs
   * 
   * @param yearEntries sorted year entries from api request 
   * @return processed work time data, work time total data
   */
  public static yearEntriesPreprocess = (yearEntries: TimeEntryTotalDto[]): WorkTimeDatas => {
    const workTimeData: WorkTimeData[] = [];
    const workTimeTotalData: WorkTimeTotalData = {
      name: WorkTimeCategory.TOTAL,
      total: 0,
      logged: 0,
      expected: 0
    };

    yearEntries.forEach(
      entry => {
        workTimeData.push({
          name: `${entry.id?.year!}`,
          expected: entry.expected,
          project: entry.projectTime,
          internal: entry.internalTime
        });
        workTimeTotalData.total = workTimeTotalData.total + entry.total;
        workTimeTotalData.logged = workTimeTotalData.total + entry.logged;
        workTimeTotalData.expected = workTimeTotalData.total + entry.expected;
      }
    );

    return { workTimeData, workTimeTotalData };
  }
}
