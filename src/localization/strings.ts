import LocalizedStrings, { LocalizedStringsMethods } from "localized-strings";
import en from "./en.json";
import fi from "./fi.json";

/**
 * Interface describing localized strings
 */
export interface IStrings extends LocalizedStringsMethods {

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
    workTime: string;
    filterStartingDate: string;
    filterEndingDate: string;
    week: string;
    date: string;
    month: string;
    year: string;
    selectYearStart: string;
    selectYearEnd: string;
    selectWeekStart: string;
    selectWeekEnd: string;
    from: string;
    to: string;
    startOnly: string;
  };

  /**
   * Translations related to management screen
   */
  managementScreen: {
    seeMore: string;
    searchPlaceholder: string;
    noUser: string;
  };

  /**
   * Translations related to error handling
   */
  errorHandling: {
    fetchDateDataFailed: string;
    fetchTimeDataFailed: string;
    fetchUserDataFailed: string;
    syncTimeDataFailed: string;
    title: string;
  }

  /**
   * Translations related to sync handling
   */

  syncHandling: {
    syncTimeDataSuccess: string;
    syncAll: string;
    title: string;
    syncStart: string;
    syncStartDate: string;
  }

  startDate: string;
  week: string;
  logged: string;
  expected: string;
  initialTime: string;
  balance: string;
  project: string;
  internal: string;
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;

}

const strings: IStrings = new LocalizedStrings({ en: en, fi: fi });

export default strings;