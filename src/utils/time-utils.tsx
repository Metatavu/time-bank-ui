/**
 * Utility class for time values
 */
export default class TimeUtils {
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
   * Compare if a week or month fall with the defined range (start & end inclusive)
   * 
   * @param startYear start year
   * @param startMonthOrWeek start month or week
   * @param endYear end year
   * @param endMonthOrWeek end month or week
   * @param year year to be measured
   * @param monthOrWeek month or week to be measured
   * 
   * @return true if within range, false otherwise
   */
  public static WeekOrMonthInRange = (startYear: number, startMonthOrWeek: number, endYear: number, endMonthOrWeek: number, year: number, monthOrWeek: number): boolean => {
    const rangeStart = parseInt(`${startYear}${startMonthOrWeek}`);
    const rangeEnd = parseInt(`${endYear}${endMonthOrWeek}`);
    const timeMeasured = parseInt(`${year}${monthOrWeek}`);

    return rangeStart <= timeMeasured && timeMeasured <= rangeEnd;
  }
}
