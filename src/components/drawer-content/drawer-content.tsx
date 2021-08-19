import React from "react";
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, TextField, Typography } from "@material-ui/core";
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
    Api.getTimeBankApi().timebankControllerGetPersons().then(setPersons);
  };

  /**
   * Fetches the total work time data 
   */
  const fetchWorkTimeData = async () => {
    if (person && person.id) {
      Api.getTimeBankApi()
        .timebankControllerGetTotal({
          personId: person.id.toString(),
          retention: TimebankControllerGetTotalRetentionEnum.ALLTIME
        })
        .then(fetchedPersonTotalTime =>
          dispatch(setPersonTotalTime(fetchedPersonTotalTime[0])));
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
  const renderAccordinRow = (name: string, value: string, color?: string) => {
    return (
      <Box className={ classes.accordinRow }>
        <Typography style={{ fontSize: 14, fontWeight: 600 }}>
          { name }
        </Typography>
        <Typography style={{
          fontSize: 14,
          fontStyle: "italic",
          color: color
        }}
        >
          { value }
        </Typography>
      </Box>
    );
  };

  /**
   * Renders the Total work time section
   */
  const renderTotalWorkTime = () => {
    if (!personTotalTime) {
      return null;
    }
    let totalHour = TimeUtils.minuteToHourString(personTotalTime.total);
    personTotalTime.total >= 0 && (totalHour = `+${totalHour}`);
    const totalColor = personTotalTime.total < 0 ?
      theme.palette.error.dark :
      theme.palette.success.main;

    return (
      <>
        <Accordion className={ classes.drawerAccordin }>
          <AccordionSummary
            expandIcon={ <ExpandMoreIcon/> }
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Typography variant="h4" style={{ fontWeight: 600 }}>
              { strings.drawerContent.statistics }
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Box
              p={ 1 }
              paddingRight={ 3 }
              width="100%"
            >
              { renderAccordinRow(`${strings.total}:`, totalHour, totalColor) }
              { renderAccordinRow(`${strings.logged}:`, TimeUtils.minuteToHourString(personTotalTime.logged)) }
              { renderAccordinRow(`${strings.expected}:`, TimeUtils.minuteToHourString(personTotalTime.expected)) }
            </Box>
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
        <Accordion className={ classes.drawerAccordin }>
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
              { renderAccordinRow(`${strings.sunday}:`, TimeUtils.minuteToHourString(person.sunday)) }
              { renderAccordinRow(`${strings.monday}:`, TimeUtils.minuteToHourString(person.monday)) }
              { renderAccordinRow(`${strings.tuesday}:`, TimeUtils.minuteToHourString(person.tuesday)) }
              { renderAccordinRow(`${strings.wednesday}:`, TimeUtils.minuteToHourString(person.wednesday)) }
              { renderAccordinRow(`${strings.thursday}:`, TimeUtils.minuteToHourString(person.thursday)) }
              { renderAccordinRow(`${strings.friday}:`, TimeUtils.minuteToHourString(person.friday)) }
              { renderAccordinRow(`${strings.saturday}:`, TimeUtils.minuteToHourString(person.saturday)) }
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
      <Divider/>
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