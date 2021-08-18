import React, { useState } from "react";
import { Paper, Typography, MenuItem, TextField, Box, Accordion, AccordionSummary, AccordionDetails, Switch, Divider } from "@material-ui/core";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { MuiPickersUtilsProvider, KeyboardDatePicker, DatePickerView } from "@material-ui/pickers";
import { useEditorContentStyles } from "styles/editor-content/editor-content";
import { useAppSelector } from "app/hooks";
import { selectPerson } from "features/person/person-slice";
import Api from "api/api";
import strings from "localization/strings";
import theme from "theme/theme";
import TimeUtils from "utils/time-utils";
import { FilterScopes, DateFormats, WorkTimeData, WorkTimeCategory, WorkTimeTotalData } from "types/index";
import { TimebankControllerGetTotalRetentionEnum, TimeEntryTotalDto } from "generated/client";
import TotalChart from "components/generics/total-chart/total-chart";
import OverviewChart from "components/generics/overview-chart/overview-chart";

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

  const [ todayDate, /*setTodayDate*/ ] = useState(new Date());
  const [ startDateOnly, setStartDateOnly ] = useState(false);
  const [ currentWeekNumber, setCurrentWeekNumber ] = useState(0);
  const [ selectedStartDate, setSelectedStartDate ] = useState<Date>(new Date());
  const [ selectedEndDate, setSelectedEndDate ] = useState<Date | null>(null);
  const [ scope, setScope ] = React.useState<FilterScopes>(FilterScopes.WEEK);
  const [ dateFormat, setDateFormat ] = React.useState<string | undefined>("dd/MM/yyyy");
  const [ datePickerView, setDatePickerView ] = React.useState<DatePickerView>("date");
  const [ startWeek, setStartWeek ] = React.useState<number | undefined>(undefined);
  const [ endWeek, setEndWeek ] = React.useState<number | null>(null);
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ totalWeekEntries, setTotalWeekEntries ] = React.useState<TimeEntryTotalDto[] | undefined>(undefined);
  const [ totalMonthEntries, setTotalMonthEntries ] = React.useState<TimeEntryTotalDto[] | undefined>(undefined);
  const [ totalYearEntries, setTotalYearEntries ] = React.useState<TimeEntryTotalDto[] | undefined>(undefined);
  const [ displayedTimeData, setDisplayedTimeData ] = React.useState<WorkTimeData[] | undefined>(undefined);
  const [ displayedTotal, setDisplayedTotal ] = React.useState<WorkTimeTotalData | undefined>(undefined);

  React.useEffect(() => {
    initializeData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  React.useEffect(() => {
    updateTimeData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [person, scope, startWeek, endWeek, selectedStartDate, selectedEndDate])

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
   * @param event React change event 
   */
  const handleStartWeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setStartWeek(Number(value));
  };

  /**
   * Method to handle ending week change
   * 
   * @param event React change event
   */
  const handleEndWeekChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setEndWeek(Number(value));
  };

  /**
   * Start date only change handler
   */
  const onStartDateOnlyChange = () => {
    setStartDateOnly(!startDateOnly);
    setEndWeek(null);
    setSelectedEndDate(null);
  };

  /**
   * Changes the presented date format according to selected scope
   *
   * @param event React change event
   */
  const handleDateFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFilterScope  = event.target.value as FilterScopes;

    setScope(selectedFilterScope);
    setDatePickerView(selectedFilterScope as DatePickerView);
    setDateFormat({
      [FilterScopes.DATE]: DateFormats.DATE,
      [FilterScopes.WEEK]: DateFormats.DATE,
      [FilterScopes.MONTH]: DateFormats.MONTH,
      [FilterScopes.YEAR]: DateFormats.YEAR,
    }[selectedFilterScope]);
  };

  /**
   * Generate week numbers for the select component 
   * 
   * @returns current week number
   */
  const getCurrentWeek = () => {
    const today = new Date();  
    const oneJan = new Date(today.getFullYear(), 0, 1);   
    const numberOfDays = Math.ceil((today.getTime() - oneJan.getTime()) / (24 * 60 * 60 * 1000));   
    const numberOfWeeks = Math.floor((numberOfDays - today.getDay() - 1) / 7);

    return numberOfWeeks + Math.ceil(today.getDay() / 7);   
  };


  /**
   * Initialize the component data
   */
  const initializeData = async () => {
    setSelectedStartDate(todayDate)

    const currentWeek = getCurrentWeek();
    setCurrentWeekNumber(currentWeek);

    // set scope to the current sprint
    if ((currentWeek % 2) === 0) {
      setStartWeek(currentWeek - 1);
      setSelectedEndDate(todayDate);
      setEndWeek(currentWeek);
    } else {
      setStartWeek(currentWeek);
      setStartDateOnly(true)
    }
  }

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
    await loadData()
    setIsLoading(false);
  }

  /**
   * Load the date data
   */
  const loadDateData = async () => {
    if (!person || !selectedStartDate) {
      return;
    }

    const timeBankApi = Api.getTimeBankApi();
    const dateEntries = await timeBankApi.timebankControllerGetEntries({
      personId: person.id.toString(),
      after: selectedStartDate,
      before: selectedEndDate || selectedStartDate
    });

    dateEntries.sort((date1, date2) => date1.date.getTime() - date2.date.getTime());

    const workTimeDatas: WorkTimeData[] = [];
    let totalTime = 0;

    dateEntries.forEach(
      entry => {
        workTimeDatas.push({
          name: entry.date.toISOString().split("T")[0],
          expected: entry.expected,
          project: entry.projectTime,
          internal: entry.internalTime
        });
        totalTime += entry.total;
      }
    );

    setDisplayedTimeData(workTimeDatas);

    const TotalWorkTime: WorkTimeTotalData = {
      name: WorkTimeCategory.TOTAL,
      total: totalTime
    };
    setDisplayedTotal(TotalWorkTime);

    return workTimeDatas;
  }

  /**
   * Load the week data
   */
  const loadWeekData = async () => {
    if (!person || !startWeek || !selectedStartDate) {
      return;
    }

    let weekEntries: TimeEntryTotalDto[] = [];

    if (!totalWeekEntries) {
      const timeBankApi = Api.getTimeBankApi();
      weekEntries = await timeBankApi.timebankControllerGetTotal({
        personId: person.id.toString(),
        retention: TimebankControllerGetTotalRetentionEnum.WEEK
      });
      weekEntries.sort((entry1, entry2) => TimeUtils.WeekOrMonthComparator(entry1.id?.year!, entry1.id?.week!, entry2.id?.year!, entry2.id?.week!));
      setTotalWeekEntries(weekEntries);
    }else {
      weekEntries = totalWeekEntries;
    }

    const workTimeDatas: WorkTimeData[] = [];
    let totalTime = 0;
    
    weekEntries.filter(
      entry => TimeUtils.WeekOrMonthInRange(
        selectedStartDate.getFullYear(),
        startWeek,
        (!selectedEndDate || !endWeek) ? selectedStartDate.getFullYear() : selectedEndDate.getFullYear(),
        (!selectedEndDate || !endWeek) ? startWeek : endWeek,
        entry.id?.year!,
        entry.id?.week!
      )
    ).forEach(
      entry => {
        workTimeDatas.push({
          name: `${entry.id?.year!} ${FilterScopes.WEEK} ${entry.id?.week!}`,
          expected: entry.expected,
          project: entry.projectTime,
          internal: entry.internalTime
        });
        totalTime += entry.total;
      }
    );

    setDisplayedTimeData(workTimeDatas);

    const TotalWorkTime: WorkTimeTotalData = {
      name: WorkTimeCategory.TOTAL,
      total: totalTime
    };
    setDisplayedTotal(TotalWorkTime);

    return workTimeDatas;
  }

  /**
   * Load the month data
   */
  const loadMonthData = async () => {
    if (!person || !selectedStartDate) {
      return;
    }

    let monthEntries: TimeEntryTotalDto[] = [];

    if (!totalMonthEntries) {
      const timeBankApi = Api.getTimeBankApi();
      monthEntries = await timeBankApi.timebankControllerGetTotal({
        personId: person.id.toString(),
        retention: TimebankControllerGetTotalRetentionEnum.MONTH
      });
      monthEntries.sort((entry1, entry2) => TimeUtils.WeekOrMonthComparator(entry1.id?.year!, entry1.id?.month!, entry2.id?.year!, entry2.id?.month!));
      setTotalMonthEntries(monthEntries);
    }else {
      monthEntries = totalMonthEntries;
    }

    const workTimeDatas: WorkTimeData[] = [];
    let totalTime = 0;
    
    monthEntries.filter(
      entry => TimeUtils.WeekOrMonthInRange(
        selectedStartDate.getFullYear(),
        selectedStartDate.getMonth() + 1,
        selectedEndDate ? selectedEndDate.getFullYear() : selectedStartDate.getFullYear() ,
        selectedEndDate ? selectedEndDate.getMonth() + 1: selectedStartDate.getMonth() + 1,
        entry.id?.year!,
        entry.id?.month!
      )
    ).forEach(
      entry => {
        workTimeDatas.push({
          name: `${entry.id?.year!}-${entry.id?.month!}`,
          expected: entry.expected,
          project: entry.projectTime,
          internal: entry.internalTime
        });
        totalTime += entry.total;
      }
    );

    setDisplayedTimeData(workTimeDatas);

    const TotalWorkTime: WorkTimeTotalData = {
      name: WorkTimeCategory.TOTAL,
      total: totalTime
    };
    setDisplayedTotal(TotalWorkTime);

    return workTimeDatas;
  }  
  
  /**
  * Load the year data
  */
  const loadYearData = async () => {
    if (!person || !selectedStartDate) {
      return;
    }

    let yearEntries: TimeEntryTotalDto[] = [];

    if (!totalYearEntries) {
      const timeBankApi = Api.getTimeBankApi();
      yearEntries = await timeBankApi.timebankControllerGetTotal({
        personId: person.id.toString(),
        retention: TimebankControllerGetTotalRetentionEnum.YEAR
      });
      yearEntries.sort((year1, year2) => year1.id?.year! - year2.id?.year!);
      setTotalYearEntries(yearEntries);
    }else {
      yearEntries = totalYearEntries;
    }

    const workTimeDatas: WorkTimeData[] = [];
    let totalTime = 0;
    
    yearEntries.filter(
      entry => (selectedStartDate.getFullYear() <= entry.id?.year!) && (entry.id?.year! <= (selectedEndDate || selectedStartDate).getFullYear())
    ).forEach(
      entry => {
        workTimeDatas.push({
          name: `${entry.id?.year!}`,
          expected: entry.expected,
          project: entry.projectTime,
          internal: entry.internalTime
        });
        totalTime += entry.total;
      }
    );

    setDisplayedTimeData(workTimeDatas);

    const TotalWorkTime: WorkTimeTotalData = {
      name: WorkTimeCategory.TOTAL,
      total: totalTime
    };
    setDisplayedTotal(TotalWorkTime);

    return workTimeDatas;
  }

  /**
   * Renders week numbers to select component
   */
  const renderStartWeekNumbers = () => {
    if (!selectedStartDate) {
      return;
    }

    const weekOpts = []

    for (let week = 1; week <= currentWeekNumber; week++) {
      weekOpts.push((
        <MenuItem value={ week }>
          { week }
        </MenuItem>
      ))
    } 
    return weekOpts;
  };

  /**
   * Renders week numbers to select component
   */
  const renderEndWeekNumbers = () => {
    if (!selectedEndDate) {
      return;
    }

    const weekOpts = []

    if (selectedStartDate?.getFullYear() === selectedEndDate.getFullYear() && !!startWeek) {
      for (let week = startWeek; week <= currentWeekNumber; week++) {
        weekOpts.push((
          <MenuItem value={ week }>
            { week }
          </MenuItem>
        ))
      } 
    } else {
      for (let week = 1; week <= currentWeekNumber; week++) {
        weekOpts.push((
          <MenuItem value={ week }>
            { week }
          </MenuItem>
        ))
      } 
    }

    return weekOpts;
  };

  /**
   * Renders scope options for select component
   */
  const renderSelectOptions = Object.values(FilterScopes).map(scope =>
    <MenuItem
      value={ scope }
      key={ scope }
    >
      { strings.editorContent[scope as keyof object] }
    </MenuItem>
  );

  /**
   * Renders the filter subtitle text
   * 
   * @param name name of the subtitle text
   * @param value value of the subtitle text
   */
  const renderFilterSubtitleText = (name: string, value: number) => {
    return (
      <>
        <Typography
          variant="h5"
          style={{ 
            marginLeft: theme.spacing(2) 
          }}
        >
          { name }
        </Typography>
        <Typography
          variant="h5"
          style={{
            marginLeft: theme.spacing(1),
            fontStyle: "italic"
          }}
        >
          { TimeUtils.minuteToHourString(value) }
        </Typography>
      </>
    );
  }

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
          notchedOutline: classes.notchedOutline,
        }
      }}
    >
      { renderSelectOptions }
    </TextField>
  );

  /**
   * Renders start date picker 
   */
  const renderStartDatePicker = () => {
    const { filterStartingDate } = strings.editorContent;

    return (
      <MuiPickersUtilsProvider utils={ DateFnsUtils } >
        <KeyboardDatePicker
          inputVariant="standard"
          variant="inline"
          views={[ datePickerView ]}
          format={ dateFormat }
          maxDate={ todayDate }
          label={ filterStartingDate }
          value={ selectedStartDate }
          onChange={ handleStartDateChange }
          className={ classes.datePicker }
          KeyboardButtonProps={{ "aria-label": `${ filterStartingDate }` }}
        />
      </MuiPickersUtilsProvider>
    );
  }
  
  /**
   * Renders start year picker and week selector 
   */
  const renderStartYearPickerAndWeekSelector = () =>  (
    <>
      <MuiPickersUtilsProvider utils={ DateFnsUtils } >
        <KeyboardDatePicker
          views={[ FilterScopes.YEAR ]}
          variant="inline"
          inputVariant="standard"
          format="yyyy"
          maxDate={ todayDate }
          label={ strings.editorContent.selectYearStart }
          value={ selectedStartDate }
          onChange={ handleStartDateChange }
          className={ classes.yearPicker }
          KeyboardButtonProps={{ "aria-label": `${ strings.editorContent.filterStartingDate }` }}
        />
      </MuiPickersUtilsProvider>
      <TextField
        select
        variant="standard"
        value={ startWeek }
        onChange={ handleStartWeekChange }
        label={ strings.editorContent.selectWeekStart }
        className={ classes.weekPicker }
      >
        { renderStartWeekNumbers() }
      </TextField>
    </>
  );
  

  /**
   * Renders end date picker
   */
  const renderEndDate = () => (
    <MuiPickersUtilsProvider utils={ DateFnsUtils }>
      <KeyboardDatePicker
        disabled={ startDateOnly }
        inputVariant="standard"
        variant="inline"
        format={ dateFormat }
        views={[ datePickerView ]}
        minDate={ selectedStartDate }
        maxDate={ todayDate }
        label={ strings.editorContent.filterEndingDate }
        value={ selectedEndDate } 
        onChange={ handleEndDateChange }
        className={ classes.datePicker }
        KeyboardButtonProps={{ "aria-label": `${ strings.editorContent.filterEndingDate }`}}
      />
    </MuiPickersUtilsProvider>
  );

  /**
   * Renders end year picker and week selector 
   */
  const renderEndYearPickerAndWeekSelector = () => (
    <>
      <MuiPickersUtilsProvider utils={ DateFnsUtils } >
        <KeyboardDatePicker
          disabled={ startDateOnly }
          inputVariant="standard"
          variant="inline"
          views={[ FilterScopes.YEAR ]}
          format="yyyy"
          minDate={ selectedStartDate }
          maxDate={ todayDate }
          label={ strings.editorContent.selectYearEnd }
          value={ selectedEndDate }
          onChange={ handleEndDateChange }
          className={ classes.yearPicker }
          KeyboardButtonProps={{ "aria-label": `${ strings.editorContent.filterStartingDate }` }}
        />
      </MuiPickersUtilsProvider>
      <TextField
      // TODO label when start only
        disabled={ startDateOnly }
        select
        variant="standard"
        id="scope-select-outlined"
        value={ endWeek }
        onChange={ handleEndWeekChange }
        label={ strings.editorContent.selectWeekEnd }
        className={ classes.weekPicker }
      >
        { renderEndWeekNumbers() }
      </TextField>
    </>
  );
  

  /**
   * Renders starting datepicker or week/year selector depending on scope
   */
  const renderStartDatePickersAndWeekSelector = () => {
    return scope.toString() !== FilterScopes.WEEK ?
      renderStartDatePicker() :
      renderStartYearPickerAndWeekSelector();
  }

  /**
   * Renders ending datepicker/week selector depending on scope
   */
  const renderEndDatePickersAndWeekSelector = () => {
    return scope.toString() !== FilterScopes.WEEK ?
      renderEndDate() :
      renderEndYearPickerAndWeekSelector();
  }

  /**
   * Renders the filter component
   */
  const renderFilter = () => {
    if (!personTotalTime) {
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

    return (
      <Accordion>
        <AccordionSummary
          expandIcon={ <ExpandMoreIcon /> }
          aria-controls="panel1a-content"
          className={ classes.filterSummary }
        >
          <Typography variant="h4" style={{ fontWeight: 600, fontStyle: "italic" }}>
            { strings.editorContent.workTime }
          </Typography>
          <Box className={ classes.filterSubtitle } >
            { renderFilterSubtitleText(`${strings.logged}:`, personTotalTime!.logged) }
            { renderFilterSubtitleText(`${strings.expected}:`, personTotalTime!.expected) }
            { renderFilterSubtitleText(`${strings.total}:`, personTotalTime!.total) }
          </Box>
        </AccordionSummary>
        <AccordionDetails className={ classes.filterContent }>
          { renderSelectScope() }
          <Box className={ classes.startDateOnly }>
            <Switch
              color="secondary"
              checked={ startDateOnly }
              onChange={ onStartDateOnlyChange }
            />
            <Typography variant="h5" style={{ paddingLeft: theme.spacing(0.5) }}>
              { "Start only" }
            </Typography>
          </Box>
          <Box className={ classes.datePickers }>
            <Box display="flex" alignItems="center">
              {/* TODO stylesheet localization */}
              <Typography variant="h5" style={{ marginRight: theme.spacing(3) }}>
                { "from: " }
              </Typography>
              { renderStartDatePickersAndWeekSelector() }
            </Box>
            <Box marginLeft={ 4 } display="flex" alignItems="center">
              <Typography variant="h5" style={{ marginRight: theme.spacing(3) }}>
                { "to: " }
              </Typography>
              { renderEndDatePickersAndWeekSelector() }
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    );
  }

  /**
   * Renders the filter component
   */
  const renderCharts = () => {
    // TODO fix this
    if (!personTotalTime) {
      return null;
    }

    return (
      <Paper 
        elevation={ 3 }
        className={ classes.chartsContainer }
      >
        { renderOverview() }
        <Divider/>
        { renderTotal() }
      </Paper>
    );
  }

  /**
   * Renders the overview chart
   */
  const renderOverview = () => {
    if (!displayedTimeData) {
      return;
    }

    return (
      <Box className={ classes.overViewContainer }>
        <Typography variant="h2">
          { "Overview" }
        </Typography>
        <Box className={ classes.overViewChartContainer }>
          <OverviewChart
            displayedData={ displayedTimeData }
            isLoading={ isLoading }
          />
        </Box>
      </Box>
    );
  }

  /**
   * Renders the total chart
   */
  const renderTotal = () => {
    if (!displayedTotal) {
      return;
    }

    return (
      <Box className={ classes.totalContainer }>
        <Typography variant="h2">
          { "Total" }
        </Typography>
        <Box className={ classes.totalChartContainer }>
          <TotalChart
            displayedData={ displayedTotal }
            isLoading={ isLoading }
          />
        </Box>
      </Box>
    );
  }

  /**
   * Component render
   */
  return (
    <>
      { renderFilter() }
      { renderCharts() }
    </>
  );

}

export default EditorContent;
