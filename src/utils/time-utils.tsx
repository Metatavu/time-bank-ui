import { TimeEntryTotalDto } from "generated/client/models";
import moment from "moment";
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
  public static standardizedDateString = (date: Date | moment.Moment): string => {
    return moment(date).format("YYYY-MM-DD");
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
  public static DateInRange = (startDate: Date | moment.Moment, endDate: Date | moment.Moment, date: moment.Moment): boolean => {
    return date.isBetween(startDate, endDate);
  };

  /**
   * Sorts two different entries by month
   * 
   * @param entry1 first entry
   * @param entry2 second entry
   * @return positive integer if entry1 is greater than entry2, negative integer if otherwise, 0 if equal
   */
  public static sortEntriesByWeek = (entry1: TimeEntryTotalDto, entry2: TimeEntryTotalDto): number => {
    const date1 = TimeUtils.getWeekFromEntry(entry1);
    const date2 = TimeUtils.getWeekFromEntry(entry2);
    return date1.diff(date2);
  };

  /**
   * Sorts two different entries by month
   * 
   * @param entry1 first entry
   * @param entry2 second entry
   * @return positive integer if entry1 is greater than entry2, negative integer if otherwise, 0 if equal
   */
  public static sortEntriesByMonth = (entry1: TimeEntryTotalDto, entry2: TimeEntryTotalDto): number => {
    const date1 = TimeUtils.getMonthFromEntry(entry1);
    const date2 = TimeUtils.getMonthFromEntry(entry2);
    return date1.diff(date2);
  };

  /**
   * Sorts two different entries by year
   * 
   * @param entry1 first entry
   * @param entry2 second entry
   * @return positive integer if entry1 is greater than entry2, negative integer if otherwise, 0 if equal
   */
  public static sortEntriesByYear = (entry1: TimeEntryTotalDto, entry2: TimeEntryTotalDto): number => {
    const date1 = TimeUtils.getYearFromEntry(entry1);
    const date2 = TimeUtils.getYearFromEntry(entry2);
    return date1.diff(date2);
  };

  /**
   * Generate week numbers for the select component 
   * 
   * @returns current week number
   */
  public static getCurrentWeek = () => {
    return moment().isoWeek();
  };

  /**
   * Gets moment instance from entry (precision 1 month)
   *
   * @param entry TimeEntryTotalDto entry
   * @returns moment instance from given entry
   */
  public static getWeekFromEntry = (entry: TimeEntryTotalDto) => {
    if (entry.id?.year === undefined || entry.id?.week === undefined) {
      throw new Error("Malformed data!");
    }

    return moment().year(entry.id.year).week(entry.id.week);
  };

  /**
   * Gets moment instance from entry (precision 1 month)
   *
   * @param entry TimeEntryTotalDto entry
   * @returns moment instance from given entry
   */
  public static getMonthFromEntry = (entry: TimeEntryTotalDto) => {
    if (entry.id?.year === undefined || entry.id?.month === undefined) {
      throw new Error("Malformed data!");
    }

    return moment().year(entry.id.year).month(entry.id.month - 1);
  };

  /**
   * Gets moment instance from year
   *
   * @param entry TimeEntryTotalDto entry
   * @returns moment instance from given parameters
   */
  public static getYearFromEntry = (entry: TimeEntryTotalDto) => {
    if (entry.id?.year === undefined) {
      throw new Error("Malformed data!");
    }

    return moment().year(entry.id?.year);
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