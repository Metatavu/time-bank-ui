import { VacationRequestStatuses } from "generated/client";

/**
 * set the string to corresponding enum value
 *
 * @param filterString filter scope as string
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