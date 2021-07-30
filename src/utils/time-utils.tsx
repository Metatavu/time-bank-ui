/**
 * Utility class for time values
 */
export default class TimeUtils {
  /**
   * Converts time in minutes to a string formatted as "x h y min"
   * 
   * @param mminutes time in minutes
   * @return formatted string of time 
   */
  public static minuteToHourString = (minutes: number): string => {
    const hour = Math.floor(minutes / 60);
    const minute = Math.abs(minutes % 60);

    return `${hour}h ${minute}min`;
  }
}
