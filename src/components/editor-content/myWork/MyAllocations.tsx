/* eslint-disable */
import React, { FC, useEffect } from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Button, Paper } from "@material-ui/core";
import useEditorContentStyles from "styles/editor-content/editor-content";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import allocations from "./allocationsMockData.json"; // Allocation mock data Filtered by person and date
import projects from "./projectByAllocationMockData.json" // get project data from allocations with project Id
import tasksMockData from "./tasksMockData.json"; // get Mock data by project Id from forecast and this is result
import timeRegistrations from "./timeRegistrationMockData.json"; // get time registration by projectId and person id
import { timeEnd } from "console";

interface Props {
}

/**
 * 
 * @param param0 
 * @returns 
 */
const renderMyEtraCloudComponent: FC<Props> = ({

}) => {

const [ rowsHeight, setRowsHeight ] = React.useState<number>(50);
const [ rows, setRows ] = React.useState<any[]>([]);
const classes = useEditorContentStyles();
const columns: GridColDef[] = [
  {
    field: "ADADS",
    headerName: <Button onClick={ () => setRowsHeight(rowsHeight === 50 ? 0 : 50)}>{ rowsHeight === 50 ? <ExpandMoreIcon/> : <ExpandLessIcon/> } </Button>,
    flex: 1,
    hideSortIcons: true,
    headerClassName: classes.hideRightSeparator
  },
  {
    field: "myAllocations",
    headerName: "My allocations",
    flex: 10,
    hideSortIcons: true,
    headerClassName: classes.hideRightSeparator
  },
  {
    field: "allocation",
    headerName: "Allocation",
    flex: 2,
    hideSortIcons: true,
    headerClassName: classes.hideRightSeparator
  },
  {
    field: "timeEntries",
    headerName: "Time Entries",
    type: "string",
    flex: 2,
    hideSortIcons: true,
    headerClassName: classes.hideRightSeparator
  },
  {
    field: "allocationLeft",
    headerName: "Allocations left",
    description: "Allocation time left",
    flex: 2,
    hideSortIcons: true,
    headerClassName: classes.hideRightSeparator
  }
];

const getAllocationsLeft = (allocations: number, timeRegistered: number) => {
  const allocationsLeft = allocations - timeRegistered;

  return `${ Math.floor(allocationsLeft / 60) }h ${ allocationsLeft % 60 }min`;
};

const checkAllocations = () => {
  allocations.forEach((allocation, index) => {
    let projectName = "";
    let allocations = 0;
    let timeRegistered = 0;
    // const projects = getProjectApi(allocation); //Find project by allocation project Id to get project data
    projects.map((project => {
      if (project.id === allocation.project) {
        projectName = project.name;
        tasksMockData.map((task => {
          if (task.projectId === project.id) {
            allocations = allocations + task.estimate;
          }
          timeRegistrations.map((timeRegistration => {
            if (timeRegistration.project === project.id && timeRegistration.task === task.id) {
              timeRegistered = timeRegistered + timeRegistration.timeRegistered;
              console.log(timeRegistration);
            }
          }));
        }));
      }
    }));

    const newRow = ({
      id: index + 1 as unknown as string,
      myAllocations: projectName,
      allocation: `${ Math.floor(allocations / 60) }h ${ allocations % 60 }min`,
      timeEntries: `${ Math.floor(timeRegistered / 60) }h ${ timeRegistered % 60 }min`,
      allocationLeft: getAllocationsLeft(allocations, timeRegistered)
    })
    setRows((rows: any) => [...rows, newRow]);
});
};

useEffect(() => {
  checkAllocations();
}, []);

  return (
    <>
      <Paper
        elevation={ 3 }
        className={classes.myEtraCloud}
      >
          <DataGrid
            autoHeight={ true }
            rows={rows}
            rowHeight={ rowsHeight }
            columns={columns}
            hideFooter={ true }
            pageSize={25}
            rowsPerPageOptions={[5]}
            disableSelectionOnClick
            showCellRightBorder={ false }
            showColumnRightBorder={ false }
            disableColumnMenu={ true }
            disableColumnSelector={ true }
          />
      </Paper>
    </>
  );
};

export default renderMyEtraCloudComponent;

