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
    search: string;
    language: string;
    select: string;
  };

  /**
   * Translations related to drawer content
   */
  drawerContent: {
    userInfo: {
      id: string;
      active: string;
      inactive: string;
      userType: string;
      language: string;
      createdAt: string;
      updatedAt: string;
    },
    statistics: string;
    expected: string;
  };

  /**
   * Translations related to editor content
   */
  editorContent: {
    userNotSelected: string;
    workTime: string;
    filterStartingDate: string;
    filterEndingDate: string;
    scopeWeek: string;
    scopeDate: string;
    scopeMonth: string;
    scopeYear: string;
    selectYearStart: string;
    selectYearEnd: string;
    selectWeekStart: string;
    selectWeekEnd: string;
  };

  logged: string;
  expected: string;
  difference: string;
  sunday: string;
  monday: string;
  tuesday: string;
  wednesday: string;
  thursday: string;
  friday: string;
  saturday: string;

}

const strings: IStrings = new LocalizedStrings({ en, fi });

export default strings;
