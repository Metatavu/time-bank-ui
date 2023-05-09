/* eslint-disable */
import React, { ChangeEvent, useEffect, useState } from "react";
import { Paper, Typography, MenuItem, TextField, Box, Accordion, AccordionSummary, AccordionDetails, IconButton, Tab, Tabs, FormControlLabel, Switch } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { DatePickerView } from "@material-ui/pickers";
import useEditorContentStyles from "styles/editor-content/editor-content";
import { useAppSelector } from "app/hooks";
import { selectPerson } from "features/person/person-slice";
import Api from "api/api";
import strings from "localization/strings";
import theme from "theme/theme";
import TimeUtils from "utils/time-utils";
import { FilterScopes, DateFormats, WorkTimeData, WorkTimeTotalData } from "types/index";
import { Timespan } from "generated/client";
import TotalChart from "components/generics/total-chart/total-chart";
import OverviewChart from "components/generics/overview-chart/overview-chart";
import WorkTimeDataUtils from "utils/work-time-data-utils";
import moment from "moment";
import DateRangePicker from "components/generics/date-range-picker/date-range-picker";
import { ErrorContext } from "components/error-handler/error-handler";
import DeleteIcon from "@material-ui/icons/Delete";
import { selectAuth } from "features/auth/auth-slice";
import { TabContext, TabList, TabPanel } from "@material-ui/lab";
import MyProjectsComponent from "./myWork/myProjectsComponent";
import MySettingsComponent from "./myWork/settingsComponent";
import { link } from "fs";

/**
 * Component properties
 */
interface Props {
}

/**
 * Application editor content component
 *
 * @param props component properties
 */
const EditorContent: React.FC<Props> = () => {
  const classes = useEditorContentStyles();

  const { person, personTotalTime } = useAppSelector(selectPerson);
  const { accessToken } = useAppSelector(selectAuth);
  const [ scope, setScope ] = React.useState<FilterScopes>(FilterScopes.WEEK);
  const [ dateFormat, setDateFormat ] = React.useState<string | undefined>("dd.MM.yyyy");
  const [ datePickerView, setDatePickerView ] = React.useState<DatePickerView>("date");
  const [ selectedStartDate, setSelectedStartDate ] = useState<Date>(new Date());
  const [ selectedEndDate, setSelectedEndDate ] = useState<Date | null>(null);
  const [ startWeek, setStartWeek ] = React.useState<number | null>(null);
  const [ endWeek, setEndWeek ] = React.useState<number | null>(null);
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ displayedTimeData, setDisplayedTimeData ] = React.useState<WorkTimeData[] | undefined>(undefined);
  const [ displayedTotal, setDisplayedTotal ] = React.useState<WorkTimeTotalData | undefined>(undefined);
  const context = React.useContext(ErrorContext);
  const [tabIndex, setTabIndex] = React.useState("1");
  const [ sprintValue, setSprintValue ] = React.useState<string>("");
  const [ progressValue, setProgressValue ] = React.useState<string>("");
  const [access_token, setAccess_token] = React.useState<string>();
  const allocationApi_Url = 'https://10zpthpuwc.execute-api.us-east-2.amazonaws.com/allocations?';
  const tasksApi_Url = 'https://10zpthpuwc.execute-api.us-east-2.amazonaws.com/tasks?';
  const [ projektit, setProjects ] = React.useState<any>([]);
  const [ linkedTasks, setLinkedTasks ] = React.useState<any>();
  const [selectedPersonId, setSelectedPersonId] = React.useState<number>();

  /**
   * Initialize the component data
   */
  const initializeData = async () => {
    const currentWeek = TimeUtils.getCurrentWeek();

    // set scope to the current sprint
    if ((currentWeek % 2) === 0) {
      setStartWeek(currentWeek - 1);
      setSelectedEndDate(new Date());
      setEndWeek(currentWeek);
    } else {
      setStartWeek(currentWeek);
    }
  };

  /**
   * Load the daily data
   */
  const loadDateData = async () => {
    if (!person || !selectedStartDate) {
      return;
    }

    try {
      const dailyEntries = await Api.getDailyEntriesApi(accessToken?.access_token).listDailyEntries({
        personId: person.id,
        before: selectedEndDate || undefined,
        after: selectedStartDate
      });

      dailyEntries.sort((date1, date2) => moment(date1.date).diff(date2.date));

      const { workTimeData, workTimeTotalData } = WorkTimeDataUtils.dateEntriesPreprocess(dailyEntries);
  
      setDisplayedTimeData(workTimeData);
      setDisplayedTotal(workTimeTotalData);
    } catch (error) {
      context.setError(strings.errorHandling.fetchDateDataFailed, error);
    }
  };

  /**
   * Load the week data
   */
  const loadWeekData = async () => {
    if (!person || !startWeek) {
      return;
    }

    try {
      const weekEntries = await Api.getPersonsApi(accessToken?.access_token).listPersonTotalTime({
        personId: person.id,
        timespan: Timespan.WEEK
      });

      const startMoment = moment().year(selectedStartDate.getFullYear()).week(startWeek);
      const endMoment = startMoment.clone();
      selectedEndDate && endMoment.year(selectedEndDate.getFullYear());
      endWeek && endMoment.week(endWeek);

      const filteredWeekEntries = weekEntries.filter(
        entry => TimeUtils.DateInRange(
          startMoment.startOf("week"),
          endMoment.endOf("week"),
          TimeUtils.getWeekFromEntry(entry)
        )
      );

      filteredWeekEntries.sort(TimeUtils.sortEntriesByWeek);

      const { workTimeData, workTimeTotalData } = WorkTimeDataUtils.weeksYearsAndMonthsPreprocess(filteredWeekEntries, FilterScopes.WEEK);

      setDisplayedTimeData(workTimeData);
      setDisplayedTotal(workTimeTotalData);
    } catch (error) {
      context.setError(strings.errorHandling.fetchTimeDataFailed, error);
    }
  };

  /**
   * Load the month data
   */
  const loadMonthData = async () => {
    if (!person || !selectedStartDate) {
      return;
    }

    try {
      const monthEntries = await Api.getPersonsApi(accessToken?.access_token).listPersonTotalTime({
        personId: person.id,
        timespan: Timespan.MONTH
      });

      const startMoment = moment().year(selectedStartDate.getFullYear()).month(selectedStartDate.getMonth());
      const endMoment = startMoment.clone();
      selectedEndDate && endMoment.year(selectedEndDate.getFullYear()).month(selectedEndDate.getMonth());

      const filteredMonthEntries = monthEntries.filter(
        entry => TimeUtils.DateInRange(
          startMoment.startOf("month"),
          endMoment.endOf("month"),
          TimeUtils.getMonthFromEntry(entry)
        )
      );

      filteredMonthEntries.sort(TimeUtils.sortEntriesByMonth);

      const { workTimeData, workTimeTotalData } = WorkTimeDataUtils.weeksYearsAndMonthsPreprocess(filteredMonthEntries, FilterScopes.MONTH);
  
      setDisplayedTimeData(workTimeData);
      setDisplayedTotal(workTimeTotalData);
    } catch (error) {
      context.setError(strings.errorHandling.fetchTimeDataFailed, error);
    }
  };
  
  /**
  * Load the year data
  */
  const loadYearData = async () => {
    if (!person || !selectedStartDate) {
      return;
    }

    try {
      const yearEntries = await Api.getPersonsApi(accessToken?.access_token).listPersonTotalTime({
        personId: person.id,
        timespan: Timespan.YEAR
      });

      const startMoment = moment().year(selectedStartDate.getFullYear());
      const endMoment = startMoment.clone();
      selectedEndDate && endMoment.year(selectedEndDate.getFullYear());

      const filteredYearEntries = yearEntries.filter(
        entry => TimeUtils.DateInRange(
          startMoment.startOf("year"),
          endMoment.endOf("year"),
          TimeUtils.getYearFromEntry(entry)
        )
      );
  
      yearEntries.sort(TimeUtils.sortEntriesByYear);

      const { workTimeData, workTimeTotalData } = WorkTimeDataUtils.weeksYearsAndMonthsPreprocess(filteredYearEntries, FilterScopes.YEAR);
  
      setDisplayedTimeData(workTimeData);
      setDisplayedTotal(workTimeTotalData);
    } catch (error) {
      context.setError(strings.errorHandling.fetchTimeDataFailed, error);
    }
  };

  /**
   * update and set the time data
   */
  const updateTimeData = async () => {
    const loadData = {
      [FilterScopes.DATE]: loadDateData,
      [FilterScopes.WEEK]: loadWeekData,
      [FilterScopes.MONTH]: loadMonthData,
      [FilterScopes.YEAR]: loadYearData
    }[scope];

    setIsLoading(true);
    await loadData();
    setIsLoading(false);
  };

  React.useEffect(() => {
    if (!accessToken) {
      return;
    }

    initializeData();
  }, []);

  React.useEffect(() => {
    if (!accessToken) {
      return;
    }

    updateTimeData();
  }, [person, scope, startWeek, endWeek, selectedStartDate, selectedEndDate]);

  /**
   * Method to handle starting date change
   *
   * @param date selected date
   */
  const handleStartDateChange = (date: Date | null) => {
    date && setSelectedStartDate(date);
  };

  /**
   * Method to handle ending date change
   *
   * @param date selected date
   */
  const handleEndDateChange = (date: Date | null) => {
    date && setSelectedEndDate(date);
  };
  
  /**
   * Method to handle starting week change
   *
   * @param newValue new value
   */
  const handleStartWeekChange = (newValue: number) => {
    setStartWeek(newValue);
  };

  /**
   * Method to handle ending week change
   * 
   * @param newValue new value
   */
  const handleEndWeekChange = (newValue: number) => {
    setEndWeek(newValue);
  };

  /**
   * Start date only change handler
   */
  const handleStartDateOnlyClick = () => {
    setEndWeek(null);
    setSelectedEndDate(null);
  };

  /**
   * Changes the presented date format accordion to selected scope
   *
   * @param event React change event
   */
  const handleDateFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFilterScope = event.target.value as FilterScopes;

    setScope(selectedFilterScope);
    setDatePickerView(selectedFilterScope as DatePickerView);
    setDateFormat({
      [FilterScopes.DATE]: DateFormats.DATE,
      [FilterScopes.WEEK]: DateFormats.DATE,
      [FilterScopes.MONTH]: DateFormats.MONTH,
      [FilterScopes.YEAR]: DateFormats.YEAR
    }[selectedFilterScope]);
  };

  /**
   * Renders scope options for select component
   */
  const renderSelectOptions = Object.values(FilterScopes).map(selectScope =>
    <MenuItem
      value={ selectScope }
      key={ selectScope }
    >
      { strings.editorContent[selectScope as keyof object] }
    </MenuItem>);

  /**
   * Renders the filter subtitle text
   * 
   * @param name name of the subtitle text
   * @param value value of the subtitle text
   * @param total if it's displaying the total value
   * @param positiveTotal if the total is positive
   */
  const renderFilterSubtitleText = (name: string, value: number, total: boolean, positiveTotal?: boolean) => {
    const valueColor = positiveTotal ? theme.palette.success.main : theme.palette.error.main;
    const valueText = TimeUtils.convertToMinutesAndHours(value);

    return (
      <>
        <Typography
          variant="h5"
          style={{ marginLeft: theme.spacing(2) }}
        >
          { name }
        </Typography>
        <Typography
          variant="h5"
          style={{
            color: total ? valueColor : undefined,
            marginLeft: theme.spacing(1),
            fontStyle: "italic"
          }}
        >
          { valueText }
        </Typography>
      </>
    );
  };

  /**
   * Renders selector of filter scope
   */
  const renderSelectScope = () => (
    <TextField
      select
      variant="outlined"
      size="small"
      value={ scope }
      onChange={ handleDateFormatChange }
      className={ classes.scopeSelector }
      InputProps={{
        classes: {
          notchedOutline: classes.notchedOutline
        }
      }}
    >
      { renderSelectOptions }
    </TextField>
  );

  /**
   * Renders the filter summary
   * 
   * @param timeRangeText time range text
   */
  const renderFilterSummary = (timeRangeText: string) => (
    <>
      <Typography variant="h2">
        { strings.editorContent.workTime }
      </Typography>
      <Box>
        <Typography variant="h4">
          { timeRangeText }
        </Typography>
      </Box>
      <Box className={ classes.filterSubtitle } >
        { renderFilterSubtitleText(`${strings.logged}:`, displayedTotal!.logged || 0, false) }
        { renderFilterSubtitleText(`${strings.expected}:`, displayedTotal!.expected || 0, false) }
        { renderFilterSubtitleText(`${strings.balance}:`, displayedTotal!.balance, true, displayedTotal!.balance >= 0) }
      </Box>
    </>
  );

  /**
   * Renders the filter details
   */
  const renderFilterDetails = () => (
    <>
      { renderSelectScope() }
      <Box className={ classes.datePickers }>
        <DateRangePicker
          scope={ scope }
          dateFormat={ dateFormat }
          selectedStartDate={ selectedStartDate }
          selectedEndDate={ selectedEndDate }
          startWeek={ startWeek }
          endWeek={ endWeek }
          datePickerView={ datePickerView }
          onStartDateChange={ handleStartDateChange }
          onEndDateChange={ handleEndDateChange }
          onStartWeekChange={ handleStartWeekChange }
          onEndWeekChange={ handleEndWeekChange }
        />
      </Box>
      <IconButton
        onClick={ handleStartDateOnlyClick }
        aria-label="delete"
        className={ classes.deleteButton }
      >
        <DeleteIcon fontSize="medium"/>
      </IconButton>
    </>
  );

  /**
   * Renders the filter component
   */
  const renderFilter = () => {
    if (!person) {
      return (
        <Paper
          elevation={ 3 }
          className={ classes.emptyFilterContainer }
        >
          <Typography style={{ fontStyle: "italic" }}>
            { strings.editorContent.userNotSelected }
          </Typography>
        </Paper>
      );
    }

    if (!personTotalTime || !displayedTotal || !displayedTimeData) {
      return (
        <Paper
          elevation={ 3 }
          className={ classes.emptyFilterContainer }
        >
          <Typography style={{ fontStyle: "italic" }}>
            { strings.editorContent.noTimeEntries }
          </Typography>
        </Paper>
      );
    }

    const timeRangeText = TimeUtils.generateTimeRangeText(displayedTimeData);
    if (tabIndex !== "1") {
      return (
        <Accordion className={ classes.filterAccordion }>
          <AccordionSummary
            expandIcon={ <ExpandMoreIcon/> }
            aria-controls="panel1a-content"
            className={ classes.filterSummary }
          >
            { renderFilterSummary(timeRangeText) }
          </AccordionSummary>
          <AccordionDetails className={ classes.filterContent }>
            { renderFilterDetails() }
          </AccordionDetails>
        </Accordion>
      );
    };
  }

  /**
   * Renders the overview chart
   */
  const renderOverview = () => {
    if (!displayedTimeData) {
      return;
    }

    return (
      <Box className={ classes.overViewChartContainer }>
        <Typography variant="h2">
          { strings.editorContent.overview }
        </Typography>
        <OverviewChart
          displayedData={ displayedTimeData }
          isLoading={ isLoading }
        />
      </Box>
    );
  };

  /**
   * Renders the total chart
   */
  const renderTotal = () => {
    if (!displayedTotal) {
      return;
    }

    return (
      <Box>
        <Typography variant="h2">
          { strings.editorContent.balance }
        </Typography>
        <Box className={ classes.totalChartContainer }>
          <TotalChart
            displayedData={ displayedTotal }
            isLoading={ isLoading }
          />
        </Box>
      </Box>
    );
  };

  /**
   * Renders the filter component
   */
  const renderCharts = () => {
    if (!person || !personTotalTime) {
      return null;
    }

    return (
      <>
        <Paper
          elevation={ 3 }
          className={ classes.chartsContainer }
        >
          { renderOverview() }
        </Paper>
        <Paper
          elevation={ 3 }
          className={ classes.chartsContainer }
        >
          { renderTotal() }
        </Paper>
      </>
    );
  };

  /**
   * 
   * @param event 
   * @param newTabIndex 
   */
  const handleChange = (event: ChangeEvent<{}>, newTabIndex: string) => {
    setTabIndex(newTabIndex);
  };

  /**
   * 
   */
  const renderMyWork = () => {
    if (!person || !personTotalTime) {
      return null;
    }

    return (
      <Box className={ classes.filterOptions }>
        <FormControlLabel
          control={
            <Switch
            />
          }
          label="My tasks only"
        />
        <TextField
          className={ classes.textField }
          select
          value={ progressValue }
          onChange={ event => setProgressValue(event.target.value)}
        >
          <MenuItem value="Progress">Progress</MenuItem>
          <MenuItem value="Done">Done</MenuItem>
        </TextField>
        <TextField
          className={ classes.textField }
          select
          label="valittu sprint"
          value={ sprintValue }
          onChange={ event => setSprintValue(event.target.value)}
        >
          <MenuItem value="43-45">43-45</MenuItem>
        </TextField>
      </Box>    
    );
  };

//Load tasks for linked allocations/projects from API
const getTasks = (projects: any) => {
  let tasks: any = [];
  projects.map(async (project: any, index: any) => {
    if (project !== null) {
    let projectId = "projectId=" + project;
    
    try {
    const data = await fetch(tasksApi_Url + projectId, {
        "headers": {
          "Authorization": "Bearer " + accessToken?.access_token
        }
      });

      let projectTasks = await data.json();
      projectTasks.map((task: any) => {
        tasks.push(task);
      })
    
    }catch (error) {
      console.log(error);
    }
    return;
  }
  });
  setLinkedTasks(tasks);
};

  //Look for allocations from API
const checkAllocations = async () => {
  const activeProjects: any[] = [];
  activeProjects.length = 0;
  const current = new Date();
  const currentDate = current.getFullYear() + "-" + current.getMonth() + "-" + current.getDate();
  if (accessToken && person) {
  try {
  const selectedPerson = "personId=" + person.id;
  const apiUrlChoices = allocationApi_Url + selectedPerson;
  const data = await fetch(apiUrlChoices, {
      "headers": {
        "Authorization": "Bearer " + accessToken.access_token
      }
    });

    const data2 = await data.json();
    data2.map((allocation: any) => {
    if (allocation.endDate.toString() > "2023-03-22" ){
      if (!activeProjects.includes(allocation.project)) {
      activeProjects.push(allocation.project);
      }
      }
    })
    setProjects(activeProjects);
    getTasks(activeProjects);

  }catch (error) {
    console.log(error);
  }
  return;
}
};


//When person updates check allocations, projects and tasks
useEffect(() => {
  setProjects(undefined);
  setLinkedTasks(undefined);
  if (person) {
  checkAllocations();
  }
}, [person]);

const renderMyProjects = () => {
  if (projektit && projektit.length > 0 && linkedTasks && linkedTasks.length > 0) {
    console.log(linkedTasks);
    return (
      <MyProjectsComponent
      activeProjects={ projektit }
      linkedTasks={ linkedTasks }
      selectedPerson={ person }
      />
    )
    }
  };
  
  /**
   * Component render
   */
  return (
    <Box sx={{ width: "100%" }}>
      <TabContext value={tabIndex}>
        <Box>
          <TabList onChange={ (event, value) => handleChange(event, value) } className={ classes.navBarContainer }>
            <Tab label="My Work" value="1" />
            <Tab label="Time Bank" value="2" />
          </TabList>
        </Box>
        <TabPanel value="1">
        { renderFilter() }
        { renderMyWork() }
        { renderMyProjects() }
        </TabPanel>
        <TabPanel value="2">
        { renderFilter() }
        { renderCharts() }
        </TabPanel>
      </TabContext>
    </Box>
  );
};

export default EditorContent;