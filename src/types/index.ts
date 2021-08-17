/**
 * Values for filtering scopes
 */
export enum FilterScopes {
  WEEK = "week",
  DATE = "date",
  MONTH = "month",
  YEAR = "year"
};

/**
 * Values for date formats
 */
export enum DateFormats {
  DATE = "dd/MM/yyyy",
  MONTH = "MM/yyyy",
  YEAR = "yyyy"
};

/**
 * Enum for work time category
 */
export enum WorkTimeCategory {
  PROJECT = "Project",
  INTERNAL = "Internal",
  EXPECTED = "Ecpected"
};

/**
 * Type for work time data
 */
export interface WorkTimeTotalData {
  name: WorkTimeCategory;
  value: number;
}

/**
 * Type for work time data
 */
export interface WorkTimeData {
  name: string;
  expected: number;
  project: number;
  internal: number
}