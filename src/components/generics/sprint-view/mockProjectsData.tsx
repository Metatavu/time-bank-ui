import { Task } from "types";

const mockProjectsData = [
  {
    id: 1,
    ADADS: "ADADS-1",
    title: "Project A",
    name: "Project A", // Added 'name' property
    assignedPersons: ["John", "Jane"],
    startDate: "2023-07-01",
    endDate: "2023-07-15",
    highPriority: true,
    estimate: 200,
    status: "In Progress",
    projectName: "Project A",
    assignees: ["John", "Jane"],
    priority: 1,
    timeEntries: []
  },
  {
    id: 2,
    ADADS: "ADADS-2",
    title: "Project B",
    name: "Project B",
    assignedPersons: ["Alice", "Bob"],
    startDate: "2023-07-10",
    endDate: "2023-07-25",
    highPriority: false,
    estimate: 150,
    status: "Pending",
    projectName: "Project B",
    assignees: ["Alice", "Bob"],
    priority: 2,
    timeEntries: []
  }
];
  
const mockLinkedTasksData: Task[] = [
  {
    id: 1,
    projectId: 1, // Linked to Project ID 1
    ADADS: "ADADS-1-TASK1",
    title: "Task 1 for Project A",
    status: "In Progress",
    estimate: 60,
    assignees: ["John"]
  },
  {
    id: 2,
    projectId: 1, // Linked to Project ID 1
    ADADS: "ADADS-1-TASK2",
    title: "Task 2 for Project A",
    status: "Completed",
    estimate: 90,
    assignees: ["Jane"]
  },
  {
    id: 3,
    projectId: 2, // Linked to Project ID 2
    ADADS: "ADADS-2-TASK1",
    title: "Task 1 for Project B",
    status: "In Progress",
    estimate: 50,
    assignees: ["Alice"]
  }
  // Add more linked tasks if needed
];
  
// Combine the linked tasks with the corresponding projects
const mockCombinedData = mockProjectsData.map(project => ({
  ...project,
  linkedTasks: mockLinkedTasksData.filter(task => task.projectId === project.id)
}));
  
export default mockCombinedData;