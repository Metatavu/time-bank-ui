/* eslint-disable */
import React, { ChangeEvent, useState } from "react";
import { Paper, Typography, MenuItem, TextField, Box, Accordion, AccordionSummary, AccordionDetails, IconButton, List, ListItem, Tab, Button, InputLabel, Select, SelectChangeEvent, FormControl, Container, TableCell, TableContainer, Table, TableHead, TableRow, TableBody, Collapse, TableCellProps, styled, tableCellClasses } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { CalendarPickerView } from "@mui/x-date-pickers";
import useEditorContentStyles from "styles/editor-content/editor-content";
import { useAppSelector } from "app/hooks";
import { selectPerson } from "features/person/person-slice";
import Api from "api/api";
import strings from "localization/strings";
import theme from "theme/theme";
import TimeUtils from "utils/time-utils";
import { FilterScopes, DateFormats, WorkTimeData, WorkTimeTotalData, VacationWeekData } from "types/index";
import { Timespan } from "generated/client";
import TotalChart from "components/generics/total-chart/total-chart";
import OverviewChart from "components/generics/overview-chart/overview-chart";
import WorkTimeDataUtils from "utils/work-time-data-utils";
import moment from "moment";
import DateRangePicker from "components/generics/date-range-picker/date-range-picker";
import { ErrorContext } from "components/error-handler/error-handler";
import DeleteIcon from "@mui/icons-material/Delete";
import VacationDataUtils from "utils/vacation-data-utils";
import { selectAuth } from "features/auth/auth-slice";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import TestRangePicker from "components/generics/vacation-test-forms/testVacationComponent";
import renderVacationRequests from "components/generics/vacation-test-forms/testVacationRequests";
import renderAllVacationRequests from "components/generics/vacation-test-forms/testVacationAllRequests";
import Holidays from "date-holidays";
import vacationRequests from "components/generics/vacation-test-forms/testVacationMockData.json"
import DateFilterPicker from "components/generics/date-range-picker/test-date-range-picker";
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';


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
  const [ dateFormat, setDateFormat ] = React.useState<string | undefined>("yyyy.MM.dd");
  const [ datePickerView, setDatePickerView ] = React.useState<CalendarPickerView>("day");
  const [ selectedStartDate, setSelectedStartDate ] = useState<unknown>(new Date());
  const [ selectedVacationStartDate, setSelectedVacationStartDate ] = useState<any>(new Date());
  const [ selectedVacationEndDate, setSelectedVacationEndDate ] = useState<any>(new Date())
  const [ selectedEndDate, setSelectedEndDate ] = useState<unknown>(null);
  const [ startWeek, setStartWeek ] = React.useState<number | null>(null);
  const [ endWeek, setEndWeek ] = React.useState<number | null>(null);
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ displayedTimeData, setDisplayedTimeData ] = React.useState<WorkTimeData[] | undefined>(undefined);
  const [ displayedTotal, setDisplayedTotal ] = React.useState<WorkTimeTotalData | undefined>(undefined);
  const [ vacationDayList, setVacationDayList ] = React.useState<VacationWeekData[]>([]);
  const currentVacationSeasonStart = `${new Date().getFullYear()}-04-01`;
  const currentVacationSeasonEnd = `${new Date().getFullYear() + 1}-03-31`;
  const context = React.useContext(ErrorContext);
  const [ tabIndex, setTabIndex ] = React.useState("1");
  const [ textContent, setTextContent ] = React.useState("");
  const [ vacationType, setVacationType ] = React.useState("");
  const [ employee, setEmployee ] = React.useState("");
  const [ status, setStatus ] = React.useState("");
  const [open, setOpen] = React.useState(false);

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
        before: selectedEndDate as Date || undefined,
        after: selectedStartDate as Date
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

      const startMoment = moment().year((selectedStartDate as Date).getFullYear()).week(startWeek);
      const endMoment = startMoment.clone();
      selectedEndDate && endMoment.year((selectedEndDate as Date).getFullYear());
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

      const startMoment = moment().year((selectedStartDate as Date).getFullYear()).month((selectedStartDate as Date).getMonth());
      const endMoment = startMoment.clone();
      selectedEndDate && endMoment.year((selectedEndDate as Date).getFullYear()).month((selectedEndDate as Date).getMonth());

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

      const startMoment = moment().year((selectedStartDate as Date).getFullYear());
      const endMoment = startMoment.clone();
      selectedEndDate && endMoment.year((selectedEndDate as Date).getFullYear());

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
   * load vacation data
   */
  const loadVacationData = async () => {
    if (!person) {
      return;
    }

    try {
      const vacationEntries = await Api.getDailyEntriesApi(accessToken?.access_token).listDailyEntries({
        personId: person.id,
        before: new Date(currentVacationSeasonEnd),
        after: new Date(currentVacationSeasonStart)
      });
      setVacationDayList(VacationDataUtils.vacationDaysProcess(vacationEntries));
    } catch (error) {
      context.setError(strings.errorHandling.fetchVacationDataFailed, error);
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
    loadVacationData();
  }, [person, scope, startWeek, endWeek, selectedStartDate, selectedEndDate]);

  /**
   * Method to handle starting date change
   *
   * @param date selected date
   */
  const handleStartDateChange = (date: unknown) => {
    date && setSelectedStartDate(date);
  };

  /**
   * Method to handle ending date change
   *
   * @param date selected date
   */
  const handleEndDateChange = (date: unknown) => {
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
    setDatePickerView(selectedFilterScope as CalendarPickerView);
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
   * @param total if it"s displaying the total value
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
        size="large"
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
  * Renders vacation days subtitle text
  * 
  * @param name name of subtitle text
  * @param value value of subtitle text
  * @param unspent if it"s displaying unspent vacation days
  * @param positiveValue if amount of unused vacation days is positive 
  */
  const renderVacationDaysSubtitleText = (name: string, value: number, unspent: boolean, positiveValue?: boolean) => {
    const valueColor = positiveValue ? theme.palette.success.main : theme.palette.error.main;
    const valueText = value;

    return (
      <>
        <Typography
          variant="h4"
          style={{ marginLeft: theme.spacing(2) }}
        >
          { name }
        </Typography>
        <Typography
          variant="h3"
          style={{
            color: unspent ? valueColor : undefined,
            marginLeft: theme.spacing(1),
            fontStyle: "italic"
          }}
        >
          { Math.abs(valueText) }
        </Typography>
      </>
    );
  };

  /**
  * Renders vacation days summary
  */
  const renderVacationDaysSummary = () => (
    <>
      <Typography variant="h2">
        { strings.editorContent.vacationDays }
      </Typography>
      <Box className={ classes.vacationDaysSubtitle }>
        { renderVacationDaysSubtitleText(`${strings.editorContent.spentVacationDays}`, person!.spentVacations, false) }
        { renderVacationDaysSubtitleText(`${person!.unspentVacations >= 0 ? strings.editorContent.unspentVacationDays : strings.editorContent.extraVacationDays}`,
          person!.unspentVacations, true, person!.unspentVacations >= 0) }
      </Box>
    </>
  );

  /**
   * Renders vacation days list per week
   */
  const renderVacationDaysList = () => (
    vacationDayList?.map((entry: VacationWeekData) => {
      return (
        <List className={classes.vacationList}>
          <Typography style={{ fontSize: "1.2em" }}>{ strings.editorContent.week + entry.weekNumber }</Typography>
          {entry.vacationDays.map(oneDay => {
            return (
              <ListItem>{oneDay.day.toLocaleDateString("fi-FI")}</ListItem>
            );
          })}
        </List>
      );
    })
  );
  
  /**
  * Render vacation days component 
  */
  const renderVacationDays = () => {
    if (!person || !personTotalTime) {
      return null;
    }
    return (
      <Accordion className={ classes.vacationDaysAccordion }>
        <AccordionSummary
          expandIcon={ <ExpandMoreIcon/> }
          aria-controls="panel1a-content"
          className={ classes.vacationDaysSummary }
        >
          { renderVacationDaysSummary() }
        </AccordionSummary>
        <AccordionDetails className={ classes.vacationContent }>
          <Typography variant="h4">
            { strings.editorContent.listOfVacationDays }
          </Typography>
          { vacationDayList.length === 0
            ? <Typography variant="h4">{ strings.editorContent.noVacationDays }</Typography>
            : <Box>{ renderVacationDaysList() }</Box>
          }
        </AccordionDetails>
      </Accordion>
    );
  };
  /**
   * Method to handle vacation starting date change
   *
   * @param date selected date
   */
  const handleVacationStartDateChange = (date: unknown) => {
    date && setSelectedVacationStartDate(date);
  };

  /**
   * Method to handle vacation ending date change
   *
   * @param date selected date
   */
  const handleVacationEndDateChange = (date: unknown) => {
    date && setSelectedVacationEndDate(date);
  };

  /**
   * Test new vacation calculations
   */

  function getVacationDays(startDate: Date, endDate: Date, holidays: Date[]): number{
    const totalDays = Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24))
    let vacationDays = 0
    let currentDate = new Date(startDate)
    for (let i = 0; i <= totalDays; i++) {
        if (currentDate.getDay() != 0 && !holidays.some(holiday => holiday.getTime() === currentDate.getTime())) {
            vacationDays++
        }
        currentDate.setDate(currentDate.getDay() + 1)
    }
    return vacationDays
  }

  const startDate = new Date(selectedVacationStartDate)
  const endDate = new Date(selectedVacationEndDate)

  const holidays = [
    new Date('2023-01-01'),
    new Date('2023-01-06'),
    new Date('2023-04-23'),
    new Date('2023-04-25'),
    new Date('2023-04-26')
  ]

  const vacationDays = getVacationDays(startDate, endDate, holidays)
  
   /**
   * Renders and calculates days spend for vacation
   */

   const renderVacationDaysSpend = () => {
    // Define the date range to compare with holidays
    const holidaysFi = new Holidays('FI')
    const startDate = new Date(selectedVacationStartDate)
    const endDate = new Date(selectedVacationEndDate)
    let days = 0

    // Iterate over each date in the date range and check if it is a holiday
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      if (!holidaysFi.isHoliday(d) && d.getDay() != 0) {
        days++
      }
    }
    return(
      <Typography variant="h4">
        {(`Amount of vacation days spend ${days}`)}
      </Typography>
      )
    };

    /**
    * Handle vacation comment box content
    */

  const handleVacationCommentContent = (event: React.ChangeEvent<HTMLInputElement>) => {
    const contentValue = event.target.value;
    setTextContent(contentValue)
  }

/**
 * Handle vacation type 
 */

  const handleVacationTypeChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value;
    setVacationType(contentValue as string)
  }

  /**
   * Renders the vacation type selection
   */
  const renderVacationType = () => (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120, marginBottom: 3 }}>
      <InputLabel>Vacation type</InputLabel>
      <Select
        value={vacationType}
        onChange={handleVacationTypeChange}
        label="Type"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={"Paid leave"}>Paid leave</MenuItem>
        <MenuItem value={"Parental leave"}>Parental leave</MenuItem>
        <MenuItem value={"Unpaid leave"}>Unpaid leave</MenuItem>
        <MenuItem value={"Surplus balance"}>Surplus balance</MenuItem>
      </Select>
    </FormControl>
  )
  
  /**
   * Handle employee change
   */

  const handleEmployeeChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value;
    setEmployee(contentValue as string)
  }

  /**
   * interface type request
   */
  interface Request {
    id: number;
    vacationType: string;
    comment: string;
    employee: string;
    days: number;
    startDate: string;
    endDate: string;
    remainingDays: number;
    status: string;
    created: string;
    updated: string;
    projectManager: string;
    humanResourcesManager: string;
  }

  /**
   * Renders employee selection
   */
  const renderEmployeeSelection = () => (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120, marginBottom: 3 }}>
      <InputLabel>Employee</InputLabel>
      <Select
        value={employee}
        onChange={handleEmployeeChange}
        label="Eployee"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {Object.values(vacationRequests).map((request: Request) => (
          <MenuItem value={request.employee}>{request.employee}</MenuItem>
        ))}
      </Select>
    </FormControl>
  )

  /**
   * Handle employee change
   */
  const handleStatusChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value;
    setStatus(contentValue as string)
  }

  /**
   * Renders the vacation type selection
   */
  const renderRequestStatus = () => (
    <FormControl variant="standard" sx={{ m: 1, minWidth: 120, marginBottom: 3 }}>
      <InputLabel>Status</InputLabel>
      <Select
        value={status}
        onChange={handleStatusChange}
        label="Status"
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        <MenuItem value={"Pending"}>Pending</MenuItem>
        <MenuItem value={"Approved"}>Approved</MenuItem>
        <MenuItem value={"Declined"}>Declined</MenuItem>
      </Select>
    </FormControl>
  )

  /**
   * Renders datefilter to view requests
   */
  const renderDateFilter = () => {
    return (
      <Box sx={{float: "right", paddingRight: "15px"}}>
        <DateFilterPicker 
          dateFormat={dateFormat}
          selectedFilteredStartDate={selectedVacationStartDate}
          selectedFilteredEndDate={selectedVacationEndDate}
          datePickerView={datePickerView}
          onStartDateChange={handleVacationStartDateChange}
          onEndDateChange={handleVacationEndDateChange} 
          onStartWeekChange={function (weekNumber: number): void {
            throw new Error("Function not implemented.");
          } } 
          onEndWeekChange={function (weekNumber: number): void {
            throw new Error("Function not implemented.");
          } }        
        />
      </Box>
    )
  };

  /**
    * Renders vacation comment box
    */
  const renderVacationCommentBox = () => (
    <TextField 
      id="outlined-multiline-flexible"
      multiline maxRows={5}
      label="Leave a comment"
      variant='outlined'
      value={textContent}
      onChange={handleVacationCommentContent}
    />
  );

  /**
  * Handle vacation apply button
  */
  const handleVacationApplyButton = () => {
    return(
      console.log(`this is START DATE ${selectedVacationStartDate} and this is END DATE${selectedVacationEndDate} and this is TEXT CONTENT ${textContent}. Vacation type ${vacationType}`)
    )
  }

  /**
    * Renders vacation apply button
    */
  const renderVacationApplyButton = () => (
    <Button
      color="secondary"
      variant="contained"
      onClick={ handleVacationApplyButton }
    >
      <Typography style={{ fontWeight: 600, color: "white" }}>
        { (`APPLY`) }
      </Typography>
    </Button>
  );

  /**
   * 
   * Renders vacation info summary
   */
  const renderVacationInfoSummary = () => {
    if (!person || !personTotalTime) {
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
    return(
    <Accordion className={classes.vacationDaysAccordion}>
      <AccordionSummary 
        expandIcon={ <ExpandMoreIcon/> }
        aria-controls="panel1a-content"
        className={ classes.vacationDaysSummary }
      >
        { renderVacationDaysSummary() }
        </AccordionSummary>
        <AccordionDetails className={ classes.vacationContent}>
          <Typography variant="h4">
            { strings.editorContent.listOfVacationDays }
          </Typography>
          { vacationDayList.length === 0
            ? <Typography variant="h4">{ strings.editorContent.noVacationDays }</Typography>
            : <Box>{ renderVacationDaysList() }</Box>
          }
        </AccordionDetails>
        <AccordionDetails >
          <Typography variant="h2" padding={theme.spacing(2)}>
            { `Apply for vacation` }
          </Typography>
        </AccordionDetails>
        <AccordionDetails 
          className={ classes.vacationInfoContent }>
            <TestRangePicker
              dateFormat={ dateFormat }
              selectedVacationStartDate={ selectedVacationStartDate }
              selectedVacationEndDate={ selectedVacationEndDate }
              datePickerView={ datePickerView }
              onStartDateChange={ handleVacationStartDateChange }
              onEndDateChange={ handleVacationEndDateChange }
            />
          <Box className={ classes.vacationDetailsContent }>
            { renderVacationType() }
          </Box>
          <Box className={ classes.vacationDetailsContent }>
            { renderVacationDaysSpend() }
            { renderVacationCommentBox() }
            { renderVacationApplyButton() }
          </Box>
        </AccordionDetails>
    </Accordion>
    )
  }
  
/**
 * Styled expandable table
 */
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.white,
      color: theme.palette.common.black,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));
  
  /**
   * 
   * @param id 
   * @param vacationType 
   * @param comment 
   * @param employee 
   * @param days 
   * @param startDate 
   * @param endDate 
   * @param remainingDays 
   * @param status 
   * @param created 
   * @param updated 
   * @param projectManager 
   * @param humanResourcesManager 
   * @returns 
   */
  const createData = (
    id: number,
    vacationType: string,
    comment: string,
    employee: string,
    days: number,
    startDate: string,
    endDate: string,
    remainingDays: number,
    status: string,
    created: string,
    updated: string,
    projectManager: string,
    humanResourcesManager: string
  ) => {
    return {
      id,
      vacationType,
      comment,
      employee,
      days,
      startDate,
      endDate,
      remainingDays,
      status,
      created,
      updated,
      projectManager,
      humanResourcesManager
      
    }
  };
  /**
   * 
   * Expandable row
   */
  const ExpandableRow = (props: { request: ReturnType<typeof createData> }) => {
    const { request } = props;
    const [open, setOpen] = React.useState(false);
    return (
      <React.Fragment>
        <StyledTableRow key={request.id}>
          <StyledTableCell component="th" scope="row">{request.vacationType}</StyledTableCell>
          <StyledTableCell>{request.employee}</StyledTableCell>
          <StyledTableCell>{request.days}</StyledTableCell>
          <StyledTableCell>{request.startDate}</StyledTableCell>
          <StyledTableCell>{request.endDate}</StyledTableCell>
          <StyledTableCell>{request.remainingDays}</StyledTableCell>
          <StyledTableCell>{request.status}</StyledTableCell>
          <StyledTableCell>
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          </StyledTableCell>
        </StyledTableRow>
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={8}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box sx={{ margin: 1, width: "100%" }}>
                <Table size="small" aria-label="purchases">
                  <TableHead>
                    <TableRow>
                      <TableCell>Comment:</TableCell>
                      <TableCell>Created:</TableCell>
                      <TableCell>Updated:</TableCell>
                      <TableCell>Project manager:</TableCell>
                      <TableCell>Human resources manager:</TableCell>
                      <TableCell/>
                      <TableCell/>
                      <TableCell/>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {Object.values(vacationRequests).map((request) => (
                      <TableRow key={request.id}>
                        <TableCell component="th" scope="row">{request.comment}</TableCell>
                        <TableCell>{request.created}</TableCell>
                        <TableCell>{request.updated}</TableCell>
                        <TableCell>{request.projectManager}</TableCell>
                        <TableCell>{request.humanResourcesManager}</TableCell>
                        <TableCell/>
                        <TableCell align="right"><Button sx={{color: "#F9473B"}}>DECLINE</Button></TableCell>
                        <TableCell align="right"><Button sx={{color: "green"}}>APPROVED</Button></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      </React.Fragment>
    )
  };

  /**
   * 
   * renders employee vacation request view
   */
  const renderEmployeeVacationRequests = () => {
    return (
      <Box className={classes.employeeVacationRequests}>
        <Box>
          <Typography variant="h2" padding={theme.spacing(2)}>
            {`Requests`}
          </Typography>
          <Box sx={{paddingLeft: "250px"}}>
            { renderVacationType() }
            { renderEmployeeSelection() }
            { renderRequestStatus() }
            { renderDateFilter() }
          </Box>
        </Box>
        <Box>
          <TableContainer style={{ height: 300, width: "100%" }}>
            <Table aria-label="customized table" style={{ marginBottom: "1em" }}>
              <TableHead>
                <TableRow>
                  <TableCell>Vacation type</TableCell>
                  <TableCell>Employee</TableCell>
                  <TableCell>Days</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Remaining Days</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell/>
                </TableRow>
              </TableHead>
              <TableBody>
                {Object.values(vacationRequests).map((request: Request) => (
                  <ExpandableRow key={request.id} request={request}/>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Box>
    )
  }

  /**
   * 
   * @param event 
   * @param newTabIndex 
   */
  const handleChange = (event: ChangeEvent<{}>, newTabIndex: string) => {
    setTabIndex(newTabIndex);
  };

  /**
   * Component render
   */
  const tabStyle = {
    fontFamily: "Trebuchet MS, sans-serif",
    '&:focus': {
      backgroundColor: "red",
      color: "white"
    }
  }
  return (
  <Box sx={{ width: "100%" }}>
    <TabContext value={tabIndex}>
      <Box>
        <TabList onChange={ (event, value) => handleChange(event, value) } className={ classes.navBarContainer }>
          <Tab sx={tabStyle} label="Timebank" value="1"/>
          <Tab sx={tabStyle} label="My Vacations" value="2"/> 
          <Tab sx={tabStyle} label="Employee Vacation Requests" value="3"/> 
        </TabList>
      </Box>
      <TabPanel value="1">
        { renderFilter }
        { renderFilter() }
        { renderCharts() }
        { renderVacationDays() }
      </TabPanel>
      <TabPanel value="2">
        { renderVacationInfoSummary() }
        { renderVacationRequests() }
      </TabPanel>
      <TabPanel value="3">
        { renderEmployeeVacationRequests() }
        
      </TabPanel>
    </TabContext>
  </Box>
  );
};

export default EditorContent;