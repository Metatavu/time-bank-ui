/* eslint-disable */
import React, { FC, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Paper, Typography } from "@material-ui/core";
import useEditorContentStyles from "styles/editor-content/editor-content";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import allocations from "./allocationsMockData.json"; // Allocation mock data Filtered by person and date
import myProjects from "./projectByAllocationMockData.json"; // get project data from allocations with project Id
import tasksMockData from "./tasksMockData.json"; // get Mock data by project Id from forecast and this is result
import timeRegistrations from "./timeRegistrationMockData.json"; // get time registration by projectId and person id

interface Props {
}

/**
 * 
 * @param param0 
 * @returns 
 */
const renderMyEtraCloudComponent: FC<Props> = ({

}) => {

  const [rowsHeight, setRowsHeight] = React.useState<number>(50);
  const [rows, setRows] = React.useState<any[]>([]);
  const classes = useEditorContentStyles();
  const [columni, setColumni] = React.useState<GridColDef[]>([]);


  const renderColumns = (project: any, columns: any) => {
    columns.push({
      field: "ADADS",
      headerName: <Button onClick={() => setRowsHeight(rowsHeight === 50 ? 0 : 50)}>{rowsHeight === 50 ? <ExpandMoreIcon /> : <ExpandLessIcon />} </Button>,
      flex: 1,
      hideSortIcons: true,
      headerClassName: classes.hideRightSeparator
    },
      {
        field: "ProjectName",
        headerName: project.name,
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

  const renderRows = (project: any, rows: any) => { // Here in future call for TasksApi and get tasks by project Id
    // const taskMockData = getTasksByProjectId(project);
    tasksMockData.map((task, index) => {
      if (task.projectId === project.id) {
        task.assignedPersons.forEach(person => { 
          if (person === 395923) { //Manually gave random person Id, fix later
            const estimateHours = Math.floor(task.estimate / 60);
            const estimateMinutes = task.estimate % 60;
            let loggedMinutes = 0;  
            timeRegistrations.forEach((timeRegistration => {
              if (timeRegistration.task === task.id) {
                loggedMinutes = loggedMinutes + timeRegistration.timeRegistered;
              }
            }));

            rows.push({
              id: index,
              ProjectName: task.title,
              Assignees: task.assignedPersons,
              Status: new Date() > new Date(task.startDate) && new Date() < new Date(task.endDate) ? "In progress" : "Done / not started",
              Priority: task.highPriority ? "High" : "Normal",
              Estimate: `${estimateHours}h ${estimateMinutes}min`,
              TimeEntries:`${ Math.floor(loggedMinutes / 60) }h ${ loggedMinutes % 60 }min`
            })
          }
        })
      }
    })
    return rows;
  };

  const renderMyProjects = () => {
    return allocations.map((allocation => {
      return myProjects.map((project => {
        if (project.id === allocation.project) {
          let columns: any[] = [];
          let rows: any[] = [];
          renderColumns(project, columns);
          renderRows(project, rows);
          return (
            <Paper
              elevation={3}
              className={classes.myEtraCloud}
            >
              <DataGrid
                getRowClassName={(params) => `super-app-theme--${params.row.status}`}
                autoHeight={true}
                rows={rows}
                rowHeight={rowsHeight}
                columns={columns}
                hideFooter={true}
                pageSize={25}
                rowsPerPageOptions={[5]}
                disableSelectionOnClick
                showCellRightBorder={false}
                showColumnRightBorder={false}
                disableColumnMenu={true}
                disableColumnSelector={true}
              />
            </Paper>
          )
        }
      }))
    }));
  };

  return (
    <>
      {renderMyProjects()}
    </>
  );
};

export default renderMyEtraCloudComponent;

