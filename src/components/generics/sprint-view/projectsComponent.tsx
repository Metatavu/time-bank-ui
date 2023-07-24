/* eslint-disable */

import { Button, Pagination, Paper } from "@mui/material";
import React, { FC, useEffect } from "react";
import { useAppSelector } from "app/hooks";
import { selectAuth } from "features/auth/auth-slice";
import useEditorContentStyles from "styles/editor-content/editor-content";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { DataGrid } from "@mui/x-data-grid";
/**
 * Component properties
 */
interface Props {
  activeProjects: any[];
  linkedTasks: any;
  selectedPerson: any;
}

/**
 * myAllocation component
 */
const projectsComponent: FC<Props> = ({
  activeProjects,
  linkedTasks,
  selectedPerson

}) => {
  const tasksApi_Url = 'https://10zpthpuwc.execute-api.us-east-2.amazonaws.com/tasks?';
  const [access_token, setAccess_token] = React.useState<string>();
  const { accessToken } = useAppSelector(selectAuth);
  const classes = useEditorContentStyles();
  const [rowsHeight, setRowsHeight] = React.useState<number>(50);
  const [selectedPersonId, setSelectedPersonId] = React.useState<number>();
  const [searchedProjectTasks, setSearchedProjectTasks] = React.useState<number>();

  const renderColumn = (project: any, columns: any) => {
    columns.push({
      field: "ADADS",
      headerName: <Button onClick={() => setRowsHeight(rowsHeight === 50 ? 0 : 50)}>{rowsHeight === 50 ? <ExpandMoreIcon /> : <ExpandLessIcon />} </Button>,
      flex: 1,
      hideSortIcons: true,
      headerClassName: classes.hideRightSeparator
    },
      {
        field: "ProjectName",
        headerName: project + "Project number only",
        flex: 10,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator
      },
      {
        field: "Assignees",
        headerName: "Assignees",
        flex: 2,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator
      },
      {
        field: "Status",
        headerName: "Status",
        type: "string",
        flex: 2,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator
      },
      {
        field: "Priority",
        headerName: "Priority",
        description: "Allocation time left",
        flex: 2,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator
      },
      {
        field: "Estimate",
        headerName: "Estimate",
        flex: 2,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator
      },
      {
        field: "TimeEntries",
        headerName: "Time Entries",
        flex: 2,
        hideSortIcons: true,
        headerClassName: classes.hideRightSeparator
      })
  };

  //
  const haeData = async (project: any, tasks: any) => {
    console.log(project);
    if (access_token) {
      console.log("access token on ja haetaan taskit");
    /* let projectId = "projectId=" + project;
    let data2;
    try {
    const data = await fetch(tasksApi_Url + projectId, {
        "headers": {
          "Authorization": access_token
        }
      });

      tasks= await data.json();
      console.log(tasks);

    }catch (error) {
      console.log(error);
    }
    setSearchedProjectTasks(project);
    return tasks;
    */
    }
  };

  const renderRows = (project: any, rows: any) => { 
    if (linkedTasks) {
    linkedTasks.map((task: any, index: any) => {
      if (task.projectId === project) {
        console.log(task);
    const estimateHours = Math.floor(task.estimate / 60);
            const estimateMinutes = task.estimate % 60;
            let loggedMinutes = 0;  

            rows.push({
              id: index,
              ProjectName: task.title,
              Assignees: task.assignedPersons,
              Status: new Date() > new Date(task.startDate) && new Date() < new Date(task.endDate) ? "In progress" : "Done / not started",
              Priority: task.highPriority ? "High" : "Normal",
              Estimate: `${estimateHours}h ${estimateMinutes}min`,
              TimeEntries:`${ Math.floor(loggedMinutes / 60) }h ${ loggedMinutes % 60 }min`
            })
    }})
    } else {
      return;
    }
    return rows;
  };

  const renderMyProjects = (activeProjects: any) => {
    return activeProjects.map((project: any) => {
      if (project !== null) {
    let columns: any[] = [];
    let rows: any[] = [];
    renderColumn(project, columns);
    renderRows(project, rows);
    console.log(rows);
    return (
      <Paper elevation={3} className={classes.myEtraCloud}>
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
    )
  }})
  };


  useEffect(() => {
    setAccess_token("Bearer " + accessToken?.access_token);
    setSelectedPersonId(selectedPerson.id);
    });

  /**
   * Component render
   */
  return (
    <>
      { renderMyProjects(activeProjects) }
    </>
  );
};

export default projectsComponent;