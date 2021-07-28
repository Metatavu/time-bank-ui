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
      userType: string;
      language: string;
      createdAt: string;
      updatedAt: string;
    }
  };

  /**
   * Translations related to editor content
   */
  editorContent: {
    userNotSelected: string;
    totalWorkTime: string;
  };

  logged: string;
  expected: string;
  total: string;

}

const strings: IStrings = new LocalizedStrings({ en, fi });

export default strings;
