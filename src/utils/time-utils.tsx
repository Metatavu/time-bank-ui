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

  /**
   * Compare month or week
   * 
   * @param year1 year one
   * @param monthOrWeek1 month or week one
   * @param year2 year two
   * @param monthOrWeek2 month or week two
   * 
   * @return positive integer if year+month/week1 is greater than year+month/week2, negative integer if otherwise, 0 if equal
   */
    public static WeekOrMonthComparator = (year1: number, monthOrWeek1: number, year2: number, monthOrWeek2: number,): number => {
      const yearWeekOrMonth1 = parseInt(`${year1}${monthOrWeek1}`);
      const yearWeekOrMonth2 = parseInt(`${year2}${monthOrWeek2}`);
  
      return yearWeekOrMonth1 - yearWeekOrMonth2;
    }
}
