import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, TextField, Typography } from "@material-ui/core";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, TooltipProps } from "recharts";
import Autocomplete from "@material-ui/lab/Autocomplete";
import UserInfo from "components/generics/user-info/user-info";
import useDrawerContentStyles from "styles/drawer-content/drawer-content";
import SearchIcon from "@material-ui/icons/Search";
import strings from "localization/strings";
import { PersonDto, TimebankControllerGetTotalRetentionEnum } from "generated/client";
import Api from "api/api";
import { selectPerson, setPerson, setPersonTotalTime } from "features/person/person-slice";
import { useAppDispatch, useAppSelector } from "app/hooks";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TimeUtils from "utils/time-utils";
import theme from "theme/theme";
import { CustomPieLabel, WorkTimeCategory, WorkTimeTotalData } from "types/index";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

/**
 * Component properties
 */
interface Props {
}

/**
 * Application drawer content component
 *
 * @param props component properties
 */
const DrawerContent: React.FC<Props> = () => {
  const dispatch = useAppDispatch();
  const { person, personTotalTime } = useAppSelector(selectPerson);

  const classes = useDrawerContentStyles();
  const [ persons, setPersons ] = React.useState<PersonDto[]>([]);
  const [ searchInput, setSearchInput ] = React.useState<string>("");
  
  /**
   * Fetches the person data 
   */
  const fetchPersonData = async () => {
    try {
      const fetchedPersons = await Api.getTimeBankApi().timebankControllerGetPersons();
      setPersons(fetchedPersons);
    } catch (error) {
      console.error(error);
    }
  };

  /**
   * Fetches the total work time data 
   */
  const fetchWorkTimeData = async () => {
    if (person && person.id) {
      try {
        const fetchedPersonTotalTime = await Api.getTimeBankApi()
          .timebankControllerGetTotal({
            personId: person.id.toString(),
            retention: TimebankControllerGetTotalRetentionEnum.ALLTIME
          });
        dispatch(setPersonTotalTime(fetchedPersonTotalTime[0]));
      } catch (error) {
        console.error(error);
      }
    }
  };

  React.useEffect(() => {
    fetchPersonData();
  }, []);

  React.useEffect(() => {
    fetchWorkTimeData();
  }, [ person ]);

  /**
   * Event Handler for autocomplete value change
   * 
   * @param newValue new value for the person data
   */
  const onSearchBoxChange = (newValue: string | PersonDto) => {
    typeof newValue !== "string" && dispatch(setPerson(newValue));
  };

  /**
   * Event Handler for autocomplete input change
   * 
   * @param newValue new input value
   */
  const onSearchBoxInputChange = (newValue: string) => {
    setSearchInput(newValue);
  };

  /**
   * Renders the autocomplete options 
   * 
   * @param personOptions person option to be rendered
   */
  const renderOptions = (personOptions: PersonDto) => {
    return (
      <Box p={ 0.5 }>
        <Typography variant="h5">
          { `${personOptions.firstName} ${personOptions.lastName}` }
        </Typography>
        <Typography variant="h6" style={{ color: "rgba(0, 0, 0, 0.6)" }}>
          { personOptions.email }
        </Typography>
      </Box>
    );
  };

  /**
   * Renders the search box
   */
  const renderSearchBox = () => {
    return (
      <>
        <Box className={ classes.searchBoxContainer }>
          <SearchIcon className={ classes.searchIcon }/>
          <Autocomplete
            freeSolo
            options={ persons }
            inputValue={ searchInput }
            getOptionLabel={ personLabel => `${personLabel.firstName} ${personLabel.lastName}` }
            renderOption={ renderOptions }
            onChange={ (event, newValue) => onSearchBoxChange(newValue as PersonDto) }
            onInputChange={ (event, newInputValue) => onSearchBoxInputChange(newInputValue) }
            renderInput={ params => (
              <TextField
                { ...params }
                variant="outlined"
                placeholder={ strings.drawerContent.searchPlaceholder }
              />
            )}
            classes={{
              root: classes.searchBox,
              inputRoot: classes.inputRoot,
              input: classes.input
            }}
          />
        </Box>
      </>
    );
  };

  /**
   * Renders the Total work time section
   * 
   * @param name name of the row
   * @param value value of the row
   * @param color color of the row value
   */
  const renderAccordionRow = (name: string, value: string, color?: string) => {
    return (
      <Box className={ classes.accordionRow }>
        <Typography className={ classes.accordionRowNames }>
          { name }
        </Typography>
        <Typography
          style={{ color: color }}
          className={ classes.accordionRowValues }
        >
          { value }
        </Typography>
      </Box>
    );
  };

  /**
   * Renders the customized label for charts
   * 
   * @param props props of the custom label
   */
  const renderCustomizedLabel = (props: CustomPieLabel) => {
    return TimeUtils.minuteToHourString(props.value);
  };

  /**
   * Renders the customized tooltip for charts
   * 
   * @param props props of the custom tooltip
   */
  const renderCustomizedTooltip = (props: TooltipProps<ValueType, NameType>) => {
    const { active, payload } = props;

    if (!active || !payload || !payload.length) {
      return null;
    }

    const selectedData = payload[0];

    if (!selectedData.value || !selectedData.name) {
      return null;
    }

    const sectionName = {
      [WorkTimeCategory.PROJECT]: strings.project,
      [WorkTimeCategory.INTERNAL]: strings.internal
    }[selectedData.name];

    return (
      <Box style={{ backgroundColor: "rgba(0, 0, 0)" }}>
        <Typography
          variant="h6"
          style={{
            color: "#fff",
            padding: theme.spacing(1)
          }}
        >
          { `${sectionName}: ${TimeUtils.minuteToHourString(selectedData.value as number)}` }
        </Typography>
      </Box>
    );
  };

  /**
   * Renders the Total work time section
   */
  const renderTotalWorkTime = () => {
    if (!person || !personTotalTime) {
      return null;
    }
    let initialTimeHour = TimeUtils.minuteToHourString(person.initialTime);
    person.initialTime >= 0 && (initialTimeHour = `+${initialTimeHour}`);
    const initialTimeColor = person.initialTime < 0 ?
      theme.palette.error.dark :
      theme.palette.success.main;

    let totalHour = TimeUtils.minuteToHourString(personTotalTime.total + person.initialTime);
    personTotalTime.total >= 0 && (totalHour = `+${totalHour}`);
    const totalColor = personTotalTime.total < 0 ?
      theme.palette.error.dark :
      theme.palette.success.main;

    const workTimeDatas: WorkTimeTotalData[] = [
      { name: WorkTimeCategory.PROJECT, total: personTotalTime.projectTime },
      { name: WorkTimeCategory.INTERNAL, total: personTotalTime.internalTime }
    ];

    const COLORS = [ theme.palette.success.main, theme.palette.warning.main ];

    return (
      <>
        <Accordion defaultExpanded className={ classes.drawerAccordion }>
          <AccordionSummary
            expandIcon={ <ExpandMoreIcon/> }
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h4" style={{ fontWeight: 600 }}>
              { strings.drawerContent.statistics }
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={ classes.accordionDetails }>
            <Box
              p={ 1 }
              paddingRight={ 3 }
              width="100%"
            >
              { renderAccordionRow(`${strings.total}:`, totalHour, totalColor) }
              { renderAccordionRow(`${strings.initialTime}:`, initialTimeHour, initialTimeColor) }
              { renderAccordionRow(`${strings.logged}:`, TimeUtils.minuteToHourString(personTotalTime.logged)) }
              { renderAccordionRow(`${strings.expected}:`, TimeUtils.minuteToHourString(personTotalTime.expected)) }
            </Box>
            <ResponsiveContainer className={ classes.pieChartContainer }>
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  dataKey="total"
                  data={ workTimeDatas }
                  label={ renderCustomizedLabel }
                >
                  { workTimeDatas.map((entry, index) => (
                    <Cell fill={ COLORS[index % COLORS.length] }/>
                  )) }
                </Pie>
                <Tooltip content={ renderCustomizedTooltip }/>
              </PieChart>
            </ResponsiveContainer>
          </AccordionDetails>
        </Accordion>
      </>
    );
  };

  /**
   * Renders the expected work time section
   */
  const renderExpectedWork = () => {
    if (!person) {
      return null;
    }

    return (
      <>
        <Accordion className={ classes.drawerAccordion }>
          <AccordionSummary
            expandIcon={ <ExpandMoreIcon/> }
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h4" style={{ fontWeight: 600 }}>
              { strings.drawerContent.expected }
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              p={ 1 }
              paddingRight={ 3 }
              width="100%"
            >
              { renderAccordionRow(`${strings.sunday}:`, TimeUtils.minuteToHourString(person.sunday)) }
              { renderAccordionRow(`${strings.monday}:`, TimeUtils.minuteToHourString(person.monday)) }
              { renderAccordionRow(`${strings.tuesday}:`, TimeUtils.minuteToHourString(person.tuesday)) }
              { renderAccordionRow(`${strings.wednesday}:`, TimeUtils.minuteToHourString(person.wednesday)) }
              { renderAccordionRow(`${strings.thursday}:`, TimeUtils.minuteToHourString(person.thursday)) }
              { renderAccordionRow(`${strings.friday}:`, TimeUtils.minuteToHourString(person.friday)) }
              { renderAccordionRow(`${strings.saturday}:`, TimeUtils.minuteToHourString(person.saturday)) }
            </Box>
          </AccordionDetails>
        </Accordion>
      </>
    );
  };

  /**
   * Component render
   */
  return (
    <>
      <Box className={ classes.drawerSearchBoxContainer }>
        { renderSearchBox() }
      </Box>
      { person &&
        <>
          <Box className={ classes.drawerUserInfoContainer }>
            <UserInfo/>
          </Box>
          <Divider/>
          <Box mt={ 2 }>
            { renderTotalWorkTime() }
            { renderExpectedWork() }
          </Box>
        </>
      }
    </>
  );
};

export default DrawerContent;