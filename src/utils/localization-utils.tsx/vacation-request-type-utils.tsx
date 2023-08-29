import { VacationType } from "generated/client";
import strings from "localization/strings";

/**
 * Get a localized string corresponding to vacation type 
 *
 * @param type Type of vacation, an enum case
 */
const getLocalizedRequestType = (type: VacationType) => {
  switch (type) {
    case VacationType.VACATION:
      return strings.vacationRequests.vacation;
    case VacationType.PERSONAL_DAYS:
      return strings.vacationRequests.personalDays;
    case VacationType.UNPAID_TIME_OFF:
      return strings.vacationRequests.unpaidTimeOff;
    case VacationType.MATERNITY_PATERNITY:
      return strings.vacationRequests.maternityPaternityLeave;
    case VacationType.SICKNESS:
      return strings.vacationRequests.sickness;
    case VacationType.CHILD_SICKNESS:
      return strings.vacationRequests.childSickness;
    default:
      return strings.vacationRequests.vacation;
  }
};

export default getLocalizedRequestType;