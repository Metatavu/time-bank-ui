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

import { exists, mapValues } from '../runtime';
/**
 * Person Data from Forecast API
 * @export
 * @interface Person
 */
export interface Person {
    /**
     * Person ID in Forecast.
     * @type {number}
     * @memberof Person
     */
    id: number;
    /**
     * Person first name.
     * @type {string}
     * @memberof Person
     */
    firstName: string;
    /**
     * Person last name.
     * @type {string}
     * @memberof Person
     */
    lastName: string;
    /**
     * Person email.
     * @type {string}
     * @memberof Person
     */
    email: string;
    /**
     * Persons expected working hours in minutes.
     * @type {number}
     * @memberof Person
     */
    monday: number;
    /**
     * Persons expected working hours in minutes.
     * @type {number}
     * @memberof Person
     */
    tuesday: number;
    /**
     * Persons expected working hours in minutes.
     * @type {number}
     * @memberof Person
     */
    wednesday: number;
    /**
     * Persons expected working hours in minutes.
     * @type {number}
     * @memberof Person
     */
    thursday: number;
    /**
     * Persons expected working hours in minutes.
     * @type {number}
     * @memberof Person
     */
    friday: number;
    /**
     * Persons expected working hours in minutes.
     * @type {number}
     * @memberof Person
     */
    saturday: number;
    /**
     * Persons expected working hours in minutes.
     * @type {number}
     * @memberof Person
     */
    sunday: number;
    /**
     * Defining is person active e.g. is employeed.
     * @type {boolean}
     * @memberof Person
     */
    active: boolean;
    /**
     * Persons language
     * @type {string}
     * @memberof Person
     */
    language?: string;
    /**
     * Start date of employment, String.
     * @type {string}
     * @memberof Person
     */
    startDate?: string;
    /**
     * Amount of unspent vacations from last year.
     * @type {number}
     * @memberof Person
     */
    unspentVacations: number;
    /**
     * Amount of spent vacations from last year.
     * @type {number}
     * @memberof Person
     */
    spentVacations: number;
    /**
     * Persons minimum billable rate
     * @type {number}
     * @memberof Person
     */
    minimumBillableRate: number;
}

export function PersonFromJSON(json: any): Person {
    return PersonFromJSONTyped(json, false);
}

export function PersonFromJSONTyped(json: any, ignoreDiscriminator: boolean): Person {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'firstName': json['firstName'],
        'lastName': json['lastName'],
        'email': json['email'],
        'monday': json['monday'],
        'tuesday': json['tuesday'],
        'wednesday': json['wednesday'],
        'thursday': json['thursday'],
        'friday': json['friday'],
        'saturday': json['saturday'],
        'sunday': json['sunday'],
        'active': json['active'],
        'language': !exists(json, 'language') ? undefined : json['language'],
        'startDate': !exists(json, 'startDate') ? undefined : json['startDate'],
        'unspentVacations': json['unspentVacations'],
        'spentVacations': json['spentVacations'],
        'minimumBillableRate': json['minimumBillableRate'],
    };
}

export function PersonToJSON(value?: Person | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'firstName': value.firstName,
        'lastName': value.lastName,
        'email': value.email,
        'monday': value.monday,
        'tuesday': value.tuesday,
        'wednesday': value.wednesday,
        'thursday': value.thursday,
        'friday': value.friday,
        'saturday': value.saturday,
        'sunday': value.sunday,
        'active': value.active,
        'language': value.language,
        'startDate': value.startDate,
        'unspentVacations': value.unspentVacations,
        'spentVacations': value.spentVacations,
        'minimumBillableRate': value.minimumBillableRate,
    };
}


