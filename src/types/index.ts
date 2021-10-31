import { PersonDto, TimeEntryTotalDto } from "generated/client";

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
  PROJECT = "Project",
  INTERNAL = "Internal",
  EXPECTED = "Expected",
  TOTAL = "Total",
  LOGGED = "Logged"
}

/**
 * Type for work time data
 */
export interface WorkTimeTotalData {
  name: WorkTimeCategory;
  total: number;
  logged?: number;
  expected?: number;
}

/**
 * Type for work time data
 */
export interface WorkTimeData {
  name: string;
  expected: number;
  project: number;
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
 * Type for custom pie label
 */
export interface CustomPieLabel {
  value: number;
}

/**
 * Interface for person with total time
 */
export interface PersonWithTotalTime {
  person: PersonDto;
  timeEntryTotal?: TimeEntryTotalDto;
}

/**
 * Interface for error context type
 */
export interface ErrorContextType {
  error?: string;
  setError: (message: string, error?: any) => void;
}