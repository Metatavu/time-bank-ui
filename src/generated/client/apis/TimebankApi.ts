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
    PersonDto,
    PersonDtoFromJSON,
    PersonDtoToJSON,
    TimeEntry,
    TimeEntryFromJSON,
    TimeEntryToJSON,
    TimeEntryTotalDto,
    TimeEntryTotalDtoFromJSON,
    TimeEntryTotalDtoToJSON,
} from '../models';

export interface TimebankControllerGetEntriesRequest {
    personId: string;
    before?: string;
    after?: string;
}

export interface TimebankControllerGetTotalRequest {
    personId: string;
    retention?: TimebankControllerGetTotalRetentionEnum;
}

/**
 * 
 */
export class TimebankApi extends runtime.BaseAPI {

    /**
     */
    async timebankControllerGetEntriesRaw(requestParameters: TimebankControllerGetEntriesRequest): Promise<runtime.ApiResponse<Array<TimeEntry>>> {
        if (requestParameters.personId === null || requestParameters.personId === undefined) {
            throw new runtime.RequiredError('personId','Required parameter requestParameters.personId was null or undefined when calling timebankControllerGetEntries.');
        }

        const queryParameters: any = {};

        if (requestParameters.before !== undefined) {
            queryParameters['before'] = requestParameters.before;
        }

        if (requestParameters.after !== undefined) {
            queryParameters['after'] = requestParameters.after;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/timebank/entries/{personId}`.replace(`{${"personId"}}`, encodeURIComponent(String(requestParameters.personId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(TimeEntryFromJSON));
    }

    /**
     */
    async timebankControllerGetEntries(requestParameters: TimebankControllerGetEntriesRequest): Promise<Array<TimeEntry>> {
        const response = await this.timebankControllerGetEntriesRaw(requestParameters);
        return await response.value();
    }

    /**
     */
    async timebankControllerGetPersonsRaw(): Promise<runtime.ApiResponse<Array<PersonDto>>> {
        const queryParameters: any = {};

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/timebank/persons`,
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(PersonDtoFromJSON));
    }

    /**
     */
    async timebankControllerGetPersons(): Promise<Array<PersonDto>> {
        const response = await this.timebankControllerGetPersonsRaw();
        return await response.value();
    }

    /**
     */
    async timebankControllerGetTotalRaw(requestParameters: TimebankControllerGetTotalRequest): Promise<runtime.ApiResponse<Array<TimeEntryTotalDto>>> {
        if (requestParameters.personId === null || requestParameters.personId === undefined) {
            throw new runtime.RequiredError('personId','Required parameter requestParameters.personId was null or undefined when calling timebankControllerGetTotal.');
        }

        const queryParameters: any = {};

        if (requestParameters.retention !== undefined) {
            queryParameters['retention'] = requestParameters.retention;
        }

        const headerParameters: runtime.HTTPHeaders = {};

        const response = await this.request({
            path: `/timebank/total/{personId}`.replace(`{${"personId"}}`, encodeURIComponent(String(requestParameters.personId))),
            method: 'GET',
            headers: headerParameters,
            query: queryParameters,
        });

        return new runtime.JSONApiResponse(response, (jsonValue) => jsonValue.map(TimeEntryTotalDtoFromJSON));
    }

    /**
     */
    async timebankControllerGetTotal(requestParameters: TimebankControllerGetTotalRequest): Promise<Array<any>> {
        const response = await this.timebankControllerGetTotalRaw(requestParameters);
        return await response.value();
    }

}

/**
    * @export
    * @enum {string}
    */
export enum TimebankControllerGetTotalRetentionEnum {
    ALLTIME = 'ALL_TIME',
    YEAR = 'YEAR',
    MONTH = 'MONTH',
    WEEK = 'WEEK'
}
