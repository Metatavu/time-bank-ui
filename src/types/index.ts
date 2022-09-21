import { Person, PersonTotalTime } from "generated/client";

/**
 * Access token
 */
export interface AccessToken {
  created: Date;
  access_token: string;
  email?: string;
  expires_in?: number;
  refresh_token?: string;
  refresh_expires_in?: number;
  firstName?: string;
  lastName?: string;
  userId?: string;
  roles?: string[];
}

/**
 * Configuration
 */
export interface Configuration {
  auth: {
    url: string;
    realm: string;
    clientId: string;
  };
  api: {
    baseUrl: string;
  };
}

/**
 * Values for filtering scopes
 */
export enum FilterScopes {
  WEEK = "week",
  DATE = "date",
  MONTH = "month",
  YEAR = "year"
}

/**
 * Values for date formats
 */
export enum DateFormats {
  DATE = "dd.MM.yyyy",
  MONTH = "MM/yyyy",
  YEAR = "yyyy"
}

/**
 * Enum for work time category
 */
export enum WorkTimeCategory {
  BILLABLE_PROJECT = "Billable Project",
  NON_BILLABLE_PROJECT = "Non Billable Project",
  INTERNAL = "Internal",
  EXPECTED = "Expected",
  BALANCE = "Balance",
  LOGGED = "Logged"
}

/**
 * Type for work time data
 */
export interface WorkTimeTotalData {
  name: WorkTimeCategory;
  balance: number;
  logged?: number;
  expected?: number;
}

/**
 * Type for work time data
 */
export interface WorkTimeData {
  name: string;
  expected: number;
  billableProject: number;
  nonBillableProject: number;
  internal: number;
}

/**
 * Type for work time data and total data
 */
export interface WorkTimeDatas {
  workTimeData: WorkTimeData[];
  workTimeTotalData: WorkTimeTotalData;
}

/**
 * Type for single vacation day data
 */
export interface VacationDayData {
  weekNumber: number;
  day: Date;
}

/**
 * Type for vacation week data
 */
export interface VacationWeekData {
  weekNumber: number;
  vacationDays: VacationDayData[];
}

/**
 * Type for custom pie label
 */
export interface CustomPieLabel {
  value: number;
}

/**
 * Interface for person with total time
 */
export interface PersonWithTotalTime {
  person: Person;
  personTotalTime?: PersonTotalTime;
}

/**
 * Interface for error context type
 */
export interface ErrorContextType {
  error?: string;
  setError: (message: string, error?: any) => void;
}

/**
 * Interface for synch context type
 */
export interface SyncOrUpdateContextType {
  syncOrUpdate?: string;
  setSyncOrUpdate: (message: string) => void;
}