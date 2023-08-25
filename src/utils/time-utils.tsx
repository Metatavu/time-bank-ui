import { PersonTotalTime } from "generated/client/models";
import { DateTime, Interval } from "luxon";
import { WorkTimeData } from "types";

/**
 * Utility class for time values
 */
export default class TimeUtils {

  /**
   * Return a standardized date string
   * 
   * @param date date data
   * @return date string in format of yyyy-mm-dd
   */
  public static standardizedDateString = (date: Date | DateTime): string => {
    return DateTime.fromJSDate(date as Date).toFormat("YYYY-MM-DD").toString();
  };

  /**
   * Converts time in minutes to a string formatted as "x h y min"
   * 
   * @param totalMinutes total time in minutes
   * @return formatted string of time 
   */
  public static convertToMinutesAndHours = (totalMinutes: number): string => {
    const negative = totalMinutes < 0;
    const absoluteMinutes = Math.abs(totalMinutes);
    const hours = Math.floor(absoluteMinutes / 60);
    const minutes = absoluteMinutes % 60;

    return `${negative ? "-" : ""}${Math.abs(hours)} h ${Math.abs(minutes)} min`;
  };

  /**
   * Converts time in minutes to a string formatted as "x,y h"
   * 
   * @param totalMinutes total time in minutes
   * @return formatted string of time 
   */
  public static convertToHours = (totalMinutes: number): string => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    const decimal = Math.round((minutes / 60) * 100);
    const negative = hours < 0 || decimal < 0;

    return `${negative ? "-" : ""}${Math.abs(hours)},${Math.abs(decimal).toString().padStart(2, "0")} h`;
  };

  /**
   * Compare if a week fall with the defined range (start & end inclusive)
   * 
   * @param startDate start date
   * @param endDate end date
   * @param date week to be compared
   * @return true if within range, false otherwise
   */
  public static DateInRange = (startDate: DateTime, endDate: DateTime, date: DateTime): boolean => {
    let startDateCorrected = startDate;
    const startDayOffSet = startDateCorrected.day - 2;
    startDateCorrected = startDateCorrected.set({ day: startDayOffSet });

    let endDateCorrected = endDate;
    const endDayOffSet = endDateCorrected.day - 1;
    endDateCorrected = endDateCorrected.set({ day: endDayOffSet });

    return Interval.fromDateTimes(startDateCorrected, endDateCorrected).contains(date);
  };

  /**
   * Sorts two different entries by month
   * 
   * @param entry1 first entry
   * @param entry2 second entry
   * @return positive integer if entry1 is greater than entry2, negative integer if otherwise, 0 if equal
   */
  public static sortEntriesByWeek = (entry1: PersonTotalTime, entry2: PersonTotalTime): number => {
    const date1 = TimeUtils.getWeekFromEntry(entry1);
    const date2 = TimeUtils.getWeekFromEntry(entry2);
    return Number(date1.diff(date2));
  };

  /**
   * Sorts two different entries by month
   * 
   * @param entry1 first entry
   * @param entry2 second entry
   * @return positive integer if entry1 is greater than entry2, negative integer if otherwise, 0 if equal
   */
  public static sortEntriesByMonth = (entry1: PersonTotalTime, entry2: PersonTotalTime): number => {
    const date1 = TimeUtils.getMonthFromEntry(entry1);
    const date2 = TimeUtils.getMonthFromEntry(entry2);
    return Number(date1.diff(date2));
  };

  /**
   * Sorts two different entries by year
   * 
   * @param entry1 first entry
   * @param entry2 second entry
   * @return positive integer if entry1 is greater than entry2, negative integer if otherwise, 0 if equal
   */
  public static sortEntriesByYear = (entry1: PersonTotalTime, entry2: PersonTotalTime): number => {
    const date1 = TimeUtils.getYearFromEntry(entry1);
    const date2 = TimeUtils.getYearFromEntry(entry2);
    return Number(date1.diff(date2));
  };

  /**
   * Generate week numbers for the select component 
   * 
   * @returns current week number
   */
  public static getCurrentWeek = () => {
    return DateTime.now().weekday;
  };

  /**
   * Gets moment instance from entry (precision 1 month)
   *
   * @param entry PersonTotalTime entry
   * @returns moment instance from given entry
   */
  public static getWeekFromEntry = (entry: PersonTotalTime) => {
    const timePeriod = entry.timePeriod || "";
    const getTimeData = timePeriod.split(",");
    const year = Number(getTimeData[0]);
    const week = Number(getTimeData[2]);

    if (year === undefined || week === undefined) {
      throw new Error("Malformed data!");
    }

    let weekFromEntry = DateTime.now();
    weekFromEntry = weekFromEntry.set({ year: year });
    weekFromEntry = weekFromEntry.set({ weekNumber: week });

    // console.log("BB: ", asdf.toISODate());

    return weekFromEntry;
  };

  /**
   * Gets moment instance from entry (precision 1 month)
   *
   * @param entry PersonTotalTime entry
   * @returns moment instance from given entry
   */
  public static getMonthFromEntry = (entry: PersonTotalTime) => {
    const timePeriod = entry.timePeriod || "";
    const getTimeData = timePeriod.split(",");
    const year = Number(getTimeData[0]);
    const month = Number(getTimeData[1]);

    if (year === undefined || month === undefined) {
      throw new Error("Malformed data!");
    }

    return DateTime.now().set({ year: year, month: month });
  };

  /**
   * Gets moment instance from year
   *
   * @param entry PersonTotalTime entry
   * @returns moment instance from given parameters
   */
  public static getYearFromEntry = (entry: PersonTotalTime) => {
    const timePeriod = entry.timePeriod || "";
    const getTimeData = timePeriod.split(",");
    const year = Number(getTimeData[0]);
    if (year === undefined) {
      throw new Error("Malformed data!");
    }

    let yearFromEntry = DateTime.now();
    yearFromEntry = yearFromEntry.set({ year: year });

    return yearFromEntry;
  };

  /**
   * Generate time range text
   *
   * @param entry WorkTimeData entry
   * @returns generated text
   */
  public static generateTimeRangeText = (entries: WorkTimeData[]) => {
    let timeRangeText = "";
    
    switch (entries.length) {
      case 0:
        timeRangeText = "";
        break;
      case 1:
        timeRangeText = `${entries[0].name}`;
        break;
      default:
        timeRangeText = `(${entries[0].name} - ${entries[entries.length - 1].name})`;
        break;
    }
    return timeRangeText;
  };

}