import { VacationRequestStatuses } from "generated/client";

/**
 * Set the string to corresponding enum value
 *
 * @param statusString String of status, an enum case
 */
const getLocalizedVacationStatus = (statusString: string) => {
  switch (statusString) {
    case "PENDING":
      return VacationRequestStatuses.PENDING;
    case "APPROVED":
      return VacationRequestStatuses.APPROVED;
    case "DECLINED":
      return VacationRequestStatuses.DECLINED;
    default:
      return null;
  }
};

export default getLocalizedVacationStatus;