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

        headerParameters["Authorization"] = `bearer eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJjZklBRE5feHhDSm1Wa1d5Ti1QTlhFRXZNVVdzMnI2OEN4dG1oRUROelhVIn0.eyJleHAiOjE2NTY2ODM4MTMsImlhdCI6MTY1NjY1NTAxMywianRpIjoiNmRmMjc4ZDQtYzYwZS00ZWEzLTk5ZTAtYzFlNjUxY2FkM2QxIiwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdDo4MDgwL3JlYWxtcy9xdWFya3VzIiwic3ViIjoiZWI0MTIzYTMtYjcyMi00Nzk4LTlhZjUtODk1N2Y4MjM2NTdhIiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiYmFja2VuZC1zZXJ2aWNlIiwic2Vzc2lvbl9zdGF0ZSI6IjBhOTJlYzBlLTdjZTAtNDI2Yi1iOGYyLTViZThhZmE5ZDJkNiIsImFjciI6IjEiLCJzY29wZSI6IiIsInNpZCI6IjBhOTJlYzBlLTdjZTAtNDI2Yi1iOGYyLTViZThhZmE5ZDJkNiJ9.JO8G3PM-Jb0DxL5riVFCI8OnOPvMkeKdyHj_Sy8GiHRAGVMlkVImxk4YwrmPWQDTTBvTfDipoSzEiwnfLPrF4tbh1pf3CYoR9u61BffN_zeQ6mK6VHismvQIp3ZzPm2xH4ngVC-YjAMmc5VwMR2YZvylj3qtL4zqpSApGIVDEAcntHQ0R5ah0lvOfgawuEDkPap519NpUseYzEYT-0L_Ugcp2mHVOZ63rcaP3TWskvEf_0twXQE3oVDGmOnrSw-h5Rcn7-OUeUavq4odLPox0e3PzDzPYZIGshTqzmZsbTesviVE8_o5pKBlqv-L5fdDxag6k8yHjuI0PkHyaReAcA`;

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
