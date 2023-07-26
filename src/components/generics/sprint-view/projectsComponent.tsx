/* eslint-disable */

import { Button, Paper } from "@mui/material";
import React, { FC, useEffect, useState } from "react";
import { useAppSelector } from "app/hooks";
import { selectAuth } from "features/auth/auth-slice";
import useEditorContentStyles from "styles/editor-content/editor-content";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { DataGrid } from "@mui/x-data-grid";
import mockCombinedData from "./mockProjectsData"; // Adjust the path if necessary
import mockProjectsData from "./mockProjectsData";
import { Task } from "types";


/**
 * Component properties
 */
interface Props {
  selectedPerson: any;
}

/**
 * Project interface
 */
interface Project {
  id: number;
  ADADS: string;
  title: string;
  assignedPersons: string[];
  startDate: string;
  endDate: string;
  highPriority: boolean;
  estimate: number;
  name: string; // Add this property to the interface
  status: string; // Add this property to the interface
  projectName: string;
  assignees: string[];
  priority: number;
  timeEntries: TimeEntry[];
  linkedTasks: Task[];
}

type TimeEntry = {
  // Define properties for TimeEntry
  // For example:
  startTime: Date;
  endTime: Date;
  description: string;
  // Add more properties as needed
};

interface ProjectsComponentProps {
  activeProjects: Project[];
  linkedTasks: Task[];
  selectedPerson: any; // Replace 'any' with the actual type of selected person data
}

/**
 * projectsComponent
 */
const projectsComponent: FC<ProjectsComponentProps> = ({ selectedPerson }) => {
  const tasksApi_Url = 'https://10zpthpuwc.execute-api.us-east-2.amazonaws.com/tasks?';
  const [access_token, setAccess_token] = useState<string>();
  const { accessToken } = useAppSelector(selectAuth);
  const classes = useEditorContentStyles();
  const [rowsHeight, setRowsHeight] = useState<number>(50);
  const [selectedPersonId, setSelectedPersonId] = useState<number>();
  const [searchedProjectTasks, setSearchedProjectTasks] = useState<number>();
  const [activeProjects, setActiveProjects] = useState<Project[]>(mockCombinedData); // Use mockCombinedData instead of mockProjectsData
  const [linkedTasks, setLinkedTasks] = useState<Task[]>(mockCombinedData.flatMap((project) => project.linkedTasks));

  const renderColumn = (project: any, columns: any) => {
    columns.push(
      {
        field: "ADADS",
        headerName: (
          <Button onClick={() => setRowsHeight(rowsHeight === 50 ? 0 : 50)}>
            {rowsHeight === 50 ? <ExpandMoreIcon /> : <ExpandLessIcon />}{" "}
          </Button>
        ),
        flex: 1,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator,
      },
      {
        field: "ProjectName",
        headerName: project + "Project number only",
        flex: 10,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator,
      },
      {
        field: "Assignees",
        headerName: "Assignees",
        flex: 2,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator,
      },
      {
        field: "Status",
        headerName: "Status",
        type: "string",
        flex: 2,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator,
      },
      {
        field: "Priority",
        headerName: "Priority",
        description: "Allocation time left",
        flex: 2,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator,
      },
      {
        field: "Estimate",
        headerName: "Estimate",
        flex: 2,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator,
      },
      {
        field: "TimeEntries",
        headerName: "Time Entries",
        flex: 2,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator,
      }
    );
  };

  const renderRows = (project: Project, rows: any[]) => {
    // Filter the linked tasks for the current project based on projectId
    const projectTasks = linkedTasks.filter((task: any) => task.projectId === project.id);
  
    projectTasks.forEach((task: any, index: any) => {
      const estimateHours = Math.floor(task.estimate / 60);
      const estimateMinutes = task.estimate % 60;
  
      rows.push({
        id: task.id,
        ADADS: task.ADADS,
        ProjectName: project.projectName,
        Assignees: project.assignees,
        Status: task.status,
        Priority: project.priority,
        Estimate: `${estimateHours}h ${estimateMinutes}m`,
        TimeEntries: project.timeEntries,
      });
    });
  
    console.log("Rendered rows:", rows);
  
    return rows;
  };

  const renderMyProjects = (activeProjects: Project[]) => {
    return activeProjects.map((project) => {
      let columns: any[] = [];
      let rows: any[] = [];
      renderColumn(project, columns);
      renderRows(project, rows);
      console.log("Columns for Project ID", project.id, columns);
      console.log("Rows for Project ID", project.id, rows);
  
      return (
        <Paper elevation={3} className={classes.myEtraCloud} key={project.id}>
          {/* Add the key prop above to provide a unique key for each DataGrid */}
          <DataGrid
            getRowClassName={(params) => `super-app-theme--${params.row.status}`}
            autoHeight
            rows={rows}
            rowHeight={rowsHeight}
            columns={columns}
            hideFooter
            disableRowSelectionOnClick
            disableColumnMenu
            disableColumnSelector
          />
        </Paper>
      );
    });
  };
  

  useEffect(() => {
    setSelectedPersonId(selectedPerson.id);
    // Use the projectsData from the JSON file to initialize the activeProjects state
    setActiveProjects(mockCombinedData as Project[]);
  }, [selectedPerson.id]);

  /**
   * API calls to fetch activeProjects and linkedTasks
   */
  useEffect(() => {
    // Make API calls to fetch activeProjects and linkedTasks
    // For example, using Axios or Fetch library

    const fetchProjects = async () => {
      try {
        // Make an API call to fetch activeProjects
        const projectsResponse = await fetch("/api/projects"); // Replace "/api/projects" with the actual API endpoint to fetch projects
        const projectsData = await projectsResponse.json();
        setActiveProjects(projectsData);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    const fetchLinkedTasks = async () => {
      try {
        // Make an API call to fetch linkedTasks
        const tasksResponse = await fetch("/api/tasks"); // Replace "/api/tasks" with the actual API endpoint to fetch tasks
        const tasksData = await tasksResponse.json();
        setLinkedTasks(tasksData);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    // Call the functions to fetch data
    fetchProjects();
    fetchLinkedTasks();
  }, []);

  /**
   * Component render
   */
  return (
    <div>
      {renderMyProjects(activeProjects)}
    </div>
  );
};

export default projectsComponent;