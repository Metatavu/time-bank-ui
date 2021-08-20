import moment from "moment";

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
  public static standardizedDateString = (date: Date): string => {
    return moment(date).format("YYYY-MM-DD");
  }

  /**
   * Converts time in minutes to a string formatted as "x h y min"
   * 
   * @param minutes time in minutes
   * @return formatted string of time 
   */
  public static minuteToHourString = (minutes: number): string => {
    const hour = Math.floor(minutes / 60);
    const minute = Math.abs(minutes % 60);

    return `${hour} h ${minute} min`;
  }

  /**
   * Compare if a week fall with the defined range (start & end inclusive)
   * 
   * @param startDate start date
   * @param endDate end date
   * @param date week to be compared
   * @return true if within range, false otherwise
   */
  public static DateInRange = (startDate: Date | moment.Moment, endDate: Date | moment.Moment, date: moment.Moment): boolean => {
    console.log("startDate, endDate, date", startDate, endDate, date)
    return date.isBetween(startDate, endDate);
  }

  /**
   * Compare month or week
   * 
   * @param monthOrWeek1 month or week one
   * @param monthOrWeek2 month or week two
   * @return positive integer if year+month/week1 is greater than year+month/week2, negative integer if otherwise, 0 if equal
   */
  public static WeekOrMonthComparator = (monthOrWeek1: moment.Moment, monthOrWeek2: moment.Moment): number => {
    return monthOrWeek1.diff(monthOrWeek2);
  }

  /**
   * Generate week numbers for the select component 
   * 
   * @returns current week number
   */
  public static getCurrentWeek = () => {
    return moment().isoWeek();
  };

  /**
   * Gets moment instance from year and week numbers
   *
   * @param year year number
   * @param week week number
   * @returns moment instance from given parameters
   */
  public static getMomentFromYearAndWeek = (year?: number, week?: number) => {
    if (!year || !week) {
      throw new Error("Malformed data!");
    }

    return moment().year(year).week(week);
  }

  /**
   * Gets moment instance from year and month numbers
   *
   * @param year year number
   * @param month month number
   * @returns moment instance from given parameters
   */
    public static getMomentFromYearAndMonth = (year?: number, month?: number) => {
      if (!year || !month) {
        throw new Error("Malformed data!");
      }
  
      return moment().year(year).month(month);
    }

  /**
   * Gets moment instance from year
   *
   * @param year year number
   * @returns moment instance from given parameters
   */
  public static getMomentFromYear = (year?: number) => {
    if (!year) {
      throw new Error("Malformed data!");
    }

    return moment().year(year);
  }

}
