import { VacationRequestStatus, VacationType } from "generated/client";
import { Request } from "types/index";

const vacationRequests: Request[] = [
  {
    id: "6958221",
    vacationType: "VACATION" as VacationType,
    message: "Summervacation",
    person: 123456,
    employee: "A. Anonyme",
    days: 2,
    startDate: "01.04.2023" as unknown as Date,
    endDate: "02.04.2023" as unknown as Date,
    remainingDays: 25,
    status: "APPROVED" as VacationRequestStatus,
    created: "03.03.2023" as unknown as Date,
    updated: "05.03.2023" as unknown as Date,
    projectManager: "Approved",
    humanResourcesManager: "Pending"
  },
  {
    id: "8297984",
    vacationType: "VACATION" as VacationType,
    message: "I need some time off",
    person: 234567,
    employee: "B. Anonyme",
    days: 3,
    startDate: "08.05.2023" as unknown as Date,
    endDate: "10.05.2023" as unknown as Date,
    remainingDays: 26,
    status: "PENDING" as VacationRequestStatus,
    created: "02.02.2023" as unknown as Date,
    updated: "02.02.2023" as unknown as Date,
    projectManager: "Approved",
    humanResourcesManager: "Pending"
  },
  {
    id: "5667678",
    vacationType: "VACATION" as VacationType,
    message: "Leave",
    person: 345678,
    employee: "C. Anonyme",
    days: 7,
    startDate: "13.03.2023" as unknown as Date,
    endDate: "20.03.2023" as unknown as Date,
    remainingDays: 20,
    status: "PENDING" as VacationRequestStatus,
    created: "05.01.2023" as unknown as Date,
    updated: "10.01.2023" as unknown as Date,
    projectManager: "Approved",
    humanResourcesManager: "Pending"
  },
  {
    id: "3244556",
    vacationType: "VACATION" as VacationType,
    message: "I want a holiday",
    person: 456789,
    employee: "D. Anonyme",
    days: 5,
    startDate: "05.06.2023" as unknown as Date,
    endDate: "09.06.2023" as unknown as Date,
    remainingDays: 10,
    status: "PENDING" as VacationRequestStatus,
    created: "08.05.2023" as unknown as Date,
    updated: "08.05.2023" as unknown as Date,
    projectManager: "Approved",
    humanResourcesManager: "Pending"
  }
];

export default vacationRequests;