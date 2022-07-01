import { Configuration, DailyEntriesApi, PersonsApi, SynchronizeApi } from "../generated/client";

/**
 * Utility class for loading api with predefined configuration
 */
export default class Api {

  /**
   * Gets api configuration
   *
   * @returns new configuration
   */
  private static getConfiguration() {
    return new Configuration({
      basePath: process.env.REACT_APP_API_BASE_URL
    });
  }

  /**
   * Gets initialized Knots API
   * 
   * @returns initialized Knots API
   */
  public static getDailyEntriesApi() {
    return new DailyEntriesApi(Api.getConfiguration());
  }

  /**
   * Gets initialized Knots API
   * 
   * @returns initialized Knots API
   */
  public static getPersonsApi() {
    return new PersonsApi(Api.getConfiguration());
  }

  /**
   * Gets initialized Knots API
   * 
   * @returns initialized Knots API
   */
  public static getSynchronizeApi() {
    return new SynchronizeApi(Api.getConfiguration());
  }

}