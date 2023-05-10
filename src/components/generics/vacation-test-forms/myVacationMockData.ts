import { VacationRequestStatus, VacationType } from "generated/client";
import { Request } from "types/index";

const myRequests: Request[] = [
  {
    id: "1958228",
    vacationType: "Personal day" as VacationType,
    message: "Time off",
    person: 123456,
    employee: "A.Anonyme",
    days: 2,
    startDate: "01.04.2023" as unknown as Date,
    endDate: "02.04.2023" as unknown as Date,
    remainingDays: 25,
    status: "APPROVED" as VacationRequestStatus,
    created: "2023-01-25" as unknown as Date,
    updated: "2023-01-30" as unknown as Date,
    projectManager: "Approved",
    humanResourcesManager: "Pending"
  },
  {
    id: "29582526",
    vacationType: "Vacation" as VacationType,
    message: "Holiday",
    person: 123456,
    employee: "A.Anonyme",
    days: 2,
    startDate: "15.04.2023" as unknown as Date,
    endDate: "16.04.2023" as unknown as Date,
    remainingDays: 25,
    status: "PENDING" as VacationRequestStatus,
    created: "2023-01-25" as unknown as Date,
    updated: "2023-01-30" as unknown as Date,
    projectManager: "Approved",
    humanResourcesManager: "Pending"
  },
  {
    id: "3951226",
    vacationType: "Vacation" as VacationType,
    message: "Summervacation",
    person: 123456,
    employee: "A.Anonyme",
    days: 10,
    startDate: "01.06.2023" as unknown as Date,
    endDate: "14.06.2023" as unknown as Date,
    remainingDays: 25,
    status: "PENDING" as VacationRequestStatus,
    created: "2023-01-25" as unknown as Date,
    updated: "2023-01-30" as unknown as Date,
    projectManager: "Approved",
    humanResourcesManager: "Pending"
  },
  {
    id: "4958226",
    vacationType: "Vacation" as VacationType,
    message: "Wintervacation",
    person: 123456,
    employee: "A.Anonyme",
    days: 15,
    startDate: "01.02.2023" as unknown as Date,
    endDate: "21.02.2023" as unknown as Date,
    remainingDays: 25,
    status: "DECLINED" as VacationRequestStatus,
    created: "2023-01-25" as unknown as Date,
    updated: "2023-01-30" as unknown as Date,
    projectManager: "Approved",
    humanResourcesManager: "Pending"
  }
];

export default myRequests;