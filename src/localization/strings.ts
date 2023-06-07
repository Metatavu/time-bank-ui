import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";
import en from "./en.json";
import fi from "./fi.json";

/**
 * Interface describing localized strings
 */
export interface IStrings extends LocalizedStringsMethods {
  [x: string]: any;

  /**
   * Translations related to header words
   */
  header: {
    title: string;
    logo: string;
    managementLink: string;
    logout: string;
    syncData: string;
    syncDataLoading: string;
    myVacations: string;
    employeeVacationRequests: string;
    requests: string;
    vacationType: string;
    employee: string;
    days: string;
    startDate: string;
    endDate: string;
    remainingDays: string;
    status: string;
  }

  /**
   * Translations related to generic words
   */
  generic: {
    add: string;
    cancel: string;
    confirm: string;
    copy: string;
    save: string;
    delete: string;
    language: string;
    select: string;
    apply: string;
    saveChanges: string;
  };

  /**
   * Translations related to drawer content
   */
  drawerContent: {
    userInfo: {
      id: string;
      language: string;
      startDate: string;
    },
    noUser: string;
    statistics: string;
    expected: string;
    searchPlaceholder: string;
    additional: string;
  };

  /**
   * Translations related to editor content
   */
  editorContent: {
    userNotSelected: string;
    noTimeEntries: string;
    overview: string;
    balance: string;
    vacationDays: string;
    spentVacationDays: string;
    unspentVacationDays: string;
    extraVacationDays: string;
    listOfVacationDays: string;
    noVacationDays: string;
    workTime: string;
    filterStartingDate: string;
    filterEndingDate: string;
    week: string;
    day: string;
    month: string;
    year: string;
    selectYearStart: string;
    selectYearEnd: string;
    selectWeekStart: string;
    selectWeekEnd: string;

  };

  /**
   * Translations related to management screen
   */
  managementScreen: {
    seeMore: string;
    searchPlaceholder: string;
    noUser: string;
    statistics: string;
  };

  /**
   * Translations related to billable hour update handling
   */
  billableHoursHandling: {
    title: string;
    updateBillableHours: string;
    billingRate: string;
    billingPercentageError: string;
    updateButton: string;
    updateBillableHoursSuccess: string;
  };

  /**
   * Translations related to error handling
   */
  errorHandling: {
    fetchDateDataFailed: string;
    fetchTimeDataFailed: string;
    fetchVacationDataFailed: string;
    fetchUserDataFailed: string;
    syncTimeDataFailed: string;
    updateBillingPercentageFailed: string;
    title: string;
  };

  /**
   * Translations related to sync handling
   */
  syncHandling: {
    syncTimeDataSuccess: string;
    sync: string;
    title: string;
    syncStart: string;
  };

  /**
 * Translations related to vacation requests
 */
  vacationRequests: {
    from: string;
    to: string;
    startOnly: string;
    amountOfChosenVacationDays: string;
    vacationType: string;
    vacation: string;
    maternityPaternityLeave: string;
    unpaidTimeOff: string;
    sickness: string;
    personalDays: string;
    childSickness: string;
    surplusBalance: string;
    employee: string;
    status: string;
    applyForVacation: string;
    message: string;
    created: string;
    updated: string;
    projectManager: string;
    humanResourcesManager: string;
    leaveAComment: string;
    pending: string;
    approved: string;
    declined: string;
    everyone: string;
    all: string;
  };

  startDate: string;
  week: string;
  logged: string;
  expected: string;
  initialTime: string;
  balance: string;
  billableProject: string;
  nonBillableProject: string;
  internal: string;
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;
  billableHours: string;
}

const strings: IStrings = new LocalizedStrings({ en: en, fi: fi });

export default strings;