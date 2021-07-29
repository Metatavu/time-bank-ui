export default class TimeUtils {
  /**
   * Utility method converts time in minute to a string formatted as xhymin 
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