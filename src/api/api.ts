import { Configuration, TimebankApi } from "../generated/client";

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
   * @param AccessToken Gets knots API
   * @returns initialized Knots API
   */
  public static getTimeBankApi() {
    return new TimebankApi(Api.getConfiguration());
  }

}