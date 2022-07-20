/* tslint:disable */
/* eslint-disable */
/**
 * Timebank
 * Timebank API documentation
 *
 * The version of the OpenAPI document: 1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import * as runtime from '../runtime';

export interface SynchronizeTimeEntriesRequest {
    before?: Date;
    after?: Date;
}

/**
 * 
 */
export class SynchronizeApi extends runtime.BaseAPI {

    /**
     * Retrieves and synchronizes time entries from Forecast API.
     * Synchronizes time entries from Forecast API.
     */
    async synchronizeTimeEntriesRaw(requestParameters: SynchronizeTimeEntriesRequest): Promise<runtime.ApiResponse<void>> {
        const queryParameters: any = {};

        if (requestParameters.before !== undefined) {
            queryParameters['before'] = (requestParameters.before as any).toISOString().substr(0,10);
        }

        if (requestParameters.after !== undefined) {
            queryParameters['after'] = (requestParameters.after as any).toISOString().substr(0,10);
        }

        const headerParameters: runtime.HTTPHeaders = {};

        if (this.configuration && this.configuration.accessToken) {
            const token = this.configuration.accessToken;
            const tokenString = typeof token === 'function' ? token("bearerAuth", []) : token;

            if (tokenString) {
                headerParameters["Authorization"] = `Bearer ${tokenString}`;
            }
        }
        const response = await this.request({
            path: `/v1/synchronize`,
            method: 'POST',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.VoidApiResponse(response);
    }

    /**
     * Retrieves and synchronizes time entries from Forecast API.
     * Synchronizes time entries from Forecast API.
     */
    async synchronizeTimeEntries(requestParameters: SynchronizeTimeEntriesRequest): Promise<void> {
        await this.synchronizeTimeEntriesRaw(requestParameters);
    }

}
