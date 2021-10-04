import { PersonDto } from "generated/client/models";

/**
 * Utility class for personDto
 */
export default class PersonUtils {

  /**
   * Filters inactive and system user from a personDto list
   * 
   * @param personList person list
   * @return filtered person
   */
  public static filterPerson = (personList: PersonDto[]): PersonDto[] => {
    return personList.filter(person => (person.active && person.userType !== "SYSTEM"));
  };

}