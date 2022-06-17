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
import {
    DailyEntry,
    DailyEntryFromJSON,
    DailyEntryToJSON,
} from '../models';

export interface ListDailyEntriesRequest {
    personId?: number;
    before?: Date;
    after?: Date;
}

/**
 * 
 */
export class DailyEntriesApi extends runtime.BaseAPI {

    /**
     * Lists daily time entries.
     * Lists daily time entries.
     */
    async listDailyEntriesRaw(requestParameters: ListDailyEntriesRequest): Promise<runtime.ApiResponse<Array<DailyEntry>>> {
        const queryParameters: any = {};

        if (requestParameters.personId !== undefined) {
            queryParameters['personId'] = requestParameters.personId;
        }

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
            path: `/v1/dailyEntries`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(DailyEntryFromJSON));
    }

    /**
     * Lists daily time entries.
     * Lists daily time entries.
     */
    async listDailyEntries(requestParameters: ListDailyEntriesRequest): Promise<Array<DailyEntry>> {
        const response = await this.listDailyEntriesRaw(requestParameters);
        return await response.value();
    }

}