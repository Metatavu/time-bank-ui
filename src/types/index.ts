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
  INTERNAL = "Internal"
};

/**
 * Type for work time data
 */
export interface WorkTimeData {
  name: WorkTimeCategory;
  value: number;
}