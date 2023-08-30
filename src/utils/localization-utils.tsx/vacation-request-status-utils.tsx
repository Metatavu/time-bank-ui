import { VacationRequestStatuses } from "generated/client";
import strings from "localization/strings";

/**
 * Handle request status
 *
 * @param requestStatus Vacation request status
 */
const getLocalizedRequestStatus = (requestStatus: VacationRequestStatuses) => ({
  [VacationRequestStatuses.PENDING]: strings.vacationRequests.pending,
  [VacationRequestStatuses.APPROVED]: strings.vacationRequests.approved,
  [VacationRequestStatuses.DECLINED]: strings.vacationRequests.declined
})[requestStatus];

export default getLocalizedRequestStatus;