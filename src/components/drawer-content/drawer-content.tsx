import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, TextField, Typography } from "@material-ui/core";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, TooltipProps } from "recharts";
import Autocomplete from "@material-ui/lab/Autocomplete";
import UserInfo from "components/generics/user-info/user-info";
import useDrawerContentStyles from "styles/drawer-content/drawer-content";
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
import { ErrorContext } from "components/error-handler/error-handler";
import { selectAuth } from "features/auth/auth-slice";

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
  const { accessToken } = useAppSelector(selectAuth);
  const classes = useDrawerContentStyles();
  const [ persons, setPersons ] = React.useState<PersonDto[]>([]);
  const [ searchInput, setSearchInput ] = React.useState<string>("");
  const context = React.useContext(ErrorContext);
  
  /**
   * Fetches the person data 
   */
  const fetchPersonData = async () => {
    try {
      const fetchedPersons = await Api.getTimeBankApi().timebankControllerGetPersons();
      setPersons(fetchedPersons);
    } catch (error) {
      context.setError(strings.errorHandling.fetchUserDataFailed, error);
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
        return;
      } catch (error) {
        context.setError(strings.errorHandling.fetchTimeDataFailed, error);
      }
    }
    dispatch(setPersonTotalTime(undefined));
  };

  React.useEffect(() => {
    if (!accessToken) {
      return;
    }

    fetchPersonData();
  }, []);

  React.useEffect(() => {
    if (!accessToken) {
      return;
    }

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
          <Autocomplete
            forcePopupIcon={ false }
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
              input: classes.input,
              endAdornment: classes.endAdornment
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
    return TimeUtils.convertToMinutesAndHours(props.value);
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
          { `${sectionName}: ${TimeUtils.convertToMinutesAndHours(selectedData.value as number)}` }
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

    const totalHourString = TimeUtils.convertToMinutesAndHours(personTotalTime.total);
    const totalColor = personTotalTime.total < 0 ?
      theme.palette.error.dark :
      theme.palette.success.main;

    const workTimeData: WorkTimeTotalData[] = [
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
            <Typography variant="h3">
              { strings.drawerContent.statistics }
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={ classes.accordionDetails }>
            <Box
              width="100%"
            >
              { renderAccordionRow(`${strings.total}:`, totalHourString, totalColor) }
              { renderAccordionRow(`${strings.logged}:`, TimeUtils.convertToMinutesAndHours(personTotalTime.logged)) }
              { renderAccordionRow(`${strings.expected}:`, TimeUtils.convertToMinutesAndHours(personTotalTime.expected)) }
            </Box>
            <ResponsiveContainer className={ classes.pieChartContainer }>
              <PieChart>
                <Pie
                  cx="50%"
                  cy="50%"
                  dataKey="total"
                  data={ workTimeData }
                  label={ renderCustomizedLabel }
                >
                  { workTimeData.map((entry, index) => (
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
            <Typography variant="h3">
              { strings.drawerContent.expected }
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              width="100%"
            >
              { renderAccordionRow(`${strings.monday}:`, TimeUtils.convertToMinutesAndHours(person.monday)) }
              { renderAccordionRow(`${strings.tuesday}:`, TimeUtils.convertToMinutesAndHours(person.tuesday)) }
              { renderAccordionRow(`${strings.wednesday}:`, TimeUtils.convertToMinutesAndHours(person.wednesday)) }
              { renderAccordionRow(`${strings.thursday}:`, TimeUtils.convertToMinutesAndHours(person.thursday)) }
              { renderAccordionRow(`${strings.friday}:`, TimeUtils.convertToMinutesAndHours(person.friday)) }
              { renderAccordionRow(`${strings.saturday}:`, TimeUtils.convertToMinutesAndHours(person.saturday)) }
              { renderAccordionRow(`${strings.sunday}:`, TimeUtils.convertToMinutesAndHours(person.sunday)) }
            </Box>
          </AccordionDetails>
        </Accordion>
      </>
    );
  };

  /**
   * Renders the user account detail entrys 
   * 
   * @param name name of the subtitle text
   * @param value value of the subtitle text
   */
  const renderUserDetailEntry = (name: string, value: string | number) => {
    return (
      <>
        <Typography
          variant="body1"
          className={ classes.infoValue }
          style={{ fontWeight: 600 }}
        >
          { name }
        </Typography>
        <Typography
          variant="body1"
          className={ classes.infoValue }
          style={{ textAlign: "right" }}
        >
          { value }
        </Typography>
      </>
    );
  };

  /**
   * Renders the user account info section
   */
  const renderUserAccountInfo = () => {
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
            <Typography variant="h3">
              { strings.drawerContent.additional }
            </Typography>
          </AccordionSummary>
          <AccordionDetails className={ classes.accordionDetails }>
            <Box className={ classes.userDetailEntry }>
              { renderUserDetailEntry(strings.drawerContent.userInfo.id, person.id) }
            </Box>
            <Box className={ classes.userDetailEntry }>
              { renderUserDetailEntry(strings.drawerContent.userInfo.userType, person.userType) }
            </Box>
            <Box className={ classes.userDetailEntry }>
              { renderUserDetailEntry(strings.drawerContent.userInfo.language, person.language) }
            </Box>
            <Box className={ classes.userDetailEntry }>
              { renderUserDetailEntry(strings.drawerContent.userInfo.createdAt, person.createdAt.toLocaleString()) }
            </Box>
            <Box className={ classes.userDetailEntry }>
              { renderUserDetailEntry(strings.drawerContent.userInfo.updatedAt, person.updatedAt.toLocaleString()) }
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
      { renderSearchBox() }
      { person ?
        <>
          <Box className={ classes.userInfoContainer }>
            <UserInfo
              person={ person }
            />
          </Box>
          <Box>
            { renderTotalWorkTime() }
            { renderExpectedWork() }
            { renderUserAccountInfo() }
          </Box>
        </> :
        <Box className={ classes.noUserContainer }>
          <Typography style={{ fontStyle: "italic", fontWeight: 600 }}>
            { strings.drawerContent.noUser }
          </Typography>
        </Box>
      }
    </>
  );
};

export default DrawerContent;