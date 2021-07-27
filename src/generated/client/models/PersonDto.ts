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
 * 
 * @export
 * @interface PersonDto
 */
export interface PersonDto {
    /**
     * 
     * @type {number}
     * @memberof PersonDto
     */
    id: number;
    /**
     * 
     * @type {string}
     * @memberof PersonDto
     */
    firstName: string;
    /**
     * 
     * @type {string}
     * @memberof PersonDto
     */
    lastName: string;
    /**
     * 
     * @type {string}
     * @memberof PersonDto
     */
    email: string;
    /**
     * 
     * @type {string}
     * @memberof PersonDto
     */
    userType: string;
    /**
     * 
     * @type {number}
     * @memberof PersonDto
     */
    clientId: number;
    /**
     * 
     * @type {number}
     * @memberof PersonDto
     */
    holidayCalendarId: number;
    /**
     * 
     * @type {number}
     * @memberof PersonDto
     */
    monday: number;
    /**
     * 
     * @type {number}
     * @memberof PersonDto
     */
    tuesday: number;
    /**
     * 
     * @type {number}
     * @memberof PersonDto
     */
    wednesday: number;
    /**
     * 
     * @type {number}
     * @memberof PersonDto
     */
    thursday: number;
    /**
     * 
     * @type {number}
     * @memberof PersonDto
     */
    friday: number;
    /**
     * 
     * @type {number}
     * @memberof PersonDto
     */
    saturday: number;
    /**
     * 
     * @type {number}
     * @memberof PersonDto
     */
    sunday: number;
    /**
     * 
     * @type {boolean}
     * @memberof PersonDto
     */
    active: boolean;
    /**
     * 
     * @type {number}
     * @memberof PersonDto
     */
    defaultRole: number;
    /**
     * 
     * @type {number}
     * @memberof PersonDto
     */
    cost: number;
    /**
     * 
     * @type {string}
     * @memberof PersonDto
     */
    language: string;
    /**
     * 
     * @type {number}
     * @memberof PersonDto
     */
    createdBy: number;
    /**
     * 
     * @type {number}
     * @memberof PersonDto
     */
    updatedBy: number;
    /**
     * 
     * @type {Date}
     * @memberof PersonDto
     */
    createdAt: Date;
    /**
     * 
     * @type {Date}
     * @memberof PersonDto
     */
    updatedAt: Date;
}

export function PersonDtoFromJSON(json: any): PersonDto {
    return PersonDtoFromJSONTyped(json, false);
}

export function PersonDtoFromJSONTyped(json: any, ignoreDiscriminator: boolean): PersonDto {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'id': json['id'],
        'firstName': json['first_name'],
        'lastName': json['last_name'],
        'email': json['email'],
        'userType': json['user_type'],
        'clientId': json['client_id'],
        'holidayCalendarId': json['holiday_calendar_id'],
        'monday': json['monday'],
        'tuesday': json['tuesday'],
        'wednesday': json['wednesday'],
        'thursday': json['thursday'],
        'friday': json['friday'],
        'saturday': json['saturday'],
        'sunday': json['sunday'],
        'active': json['active'],
        'defaultRole': json['default_role'],
        'cost': json['cost'],
        'language': json['language'],
        'createdBy': json['created_by'],
        'updatedBy': json['updated_by'],
        'createdAt': (new Date(json['created_at'])),
        'updatedAt': (new Date(json['updated_at'])),
    };
}

export function PersonDtoToJSON(value?: PersonDto | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'id': value.id,
        'first_name': value.firstName,
        'last_name': value.lastName,
        'email': value.email,
        'user_type': value.userType,
        'client_id': value.clientId,
        'holiday_calendar_id': value.holidayCalendarId,
        'monday': value.monday,
        'tuesday': value.tuesday,
        'wednesday': value.wednesday,
        'thursday': value.thursday,
        'friday': value.friday,
        'saturday': value.saturday,
        'sunday': value.sunday,
        'active': value.active,
        'default_role': value.defaultRole,
        'cost': value.cost,
        'language': value.language,
        'created_by': value.createdBy,
        'updated_by': value.updatedBy,
        'created_at': (value.createdAt.toISOString()),
        'updated_at': (value.updatedAt.toISOString()),
    };
}


