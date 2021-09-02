import React from "react";
import AppLayout from "../layouts/app-layout";
import useManagementScreenStyles from "styles/screens/management-screen";
import { Toolbar, Box, CircularProgress, Paper, Typography, List, ListItem, Divider, IconButton } from "@material-ui/core";
import { useAppDispatch } from "app/hooks";
import Api from "api/api";
import { PersonDto, TimebankControllerGetTotalRetentionEnum } from "generated/client";
import { ErrorContext } from "components/error-handler/error-handler";
import { PersonWithTotalTime } from "types";
import strings from "localization/strings";
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";
import { useHistory, Link } from "react-router-dom";
import TimeUtils from "utils/time-utils";
import theme from "theme/theme";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { setPerson } from "features/person/person-slice";

/** Minimum time that loader is visible */

/**
 * Management screen screen component
 */
const ManagementScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const classes = useManagementScreenStyles();
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ personsTotalTime, setPersonsTotalTime ] = React.useState<PersonWithTotalTime[]>([]);
  const context = React.useContext(ErrorContext);
  const history = useHistory();

  /**
   * Populate one person's total work data
   */
  const populatePersonTotalTimeData = async (person: PersonWithTotalTime) => {
    let personTotalTime: PersonWithTotalTime = {
      ...person
    };

    try {
      await Api.getTimeBankApi()
        .timebankControllerGetTotal({
          personId: personTotalTime.person.id.toString(),
          retention: TimebankControllerGetTotalRetentionEnum.ALLTIME
        })
        .then(totalTime => {
          personTotalTime = {
            ...personTotalTime,
            timeEntryTotal: totalTime[0]
          };
        });
    } catch (error) {
      context.setError(strings.errorHandling.fetchTimeDataFailed, error);
    }
    return personTotalTime;
  };

  /**
   * Fetches the person data & person total time data
   */
  const fetchData = async () => {
    const fetchedPersons: PersonWithTotalTime[] = [];

    setIsLoading(true);
    try {
      await Api.getTimeBankApi()
        .timebankControllerGetPersons()
        .then(persons => {
          persons.forEach(person =>
            fetchedPersons.push({
              person: person
            } as PersonWithTotalTime));
        });
    } catch (error) {
      context.setError(strings.errorHandling.fetchUserDataFailed, error);
    }

    const personsTotalTimePromises = fetchedPersons.map(populatePersonTotalTimeData);

    const fetchedPersonsTotalTime = await Promise.all(personsTotalTimePromises);

    setPersonsTotalTime(fetchedPersonsTotalTime);
    setIsLoading(false);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  /**
   * Person Redirect click handler
   * 
   * @param person person data
   */
  const handlePersonRedirectClick = (person: PersonDto) => {
    dispatch(setPerson(person));
    history.push("/");
  };

  /**
   * Renders the redirect link 
   */
  const renderRedirect = () => {
    return (
      <Link to="/">
        <Paper className={ classes.redirectLinkPaper }>
          <SubdirectoryArrowLeftIcon fontSize="large"/>
        </Paper>
      </Link>
    );
  };

  /**
   * Renders the person entry text
   * 
   * @param name name of the subtitle text
   * @param value value of the subtitle text
   * @param total if it's displaying the total value
   * @param positiveTotal if the total is positive
   */
  const renderPersonEntrySubtitleText = (name: string, value: number, total: boolean, positiveTotal?: boolean) => {
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
          { total ? valueText : TimeUtils.convertToMinutesAndHours(value) }
        </Typography>
      </>
    );
  };

  /**
   * Renders person entry 
   */
  const renderPersonEntry = (personTotalTime: PersonWithTotalTime) => {
    const { person, timeEntryTotal } = personTotalTime;

    if (!person.active || !timeEntryTotal || timeEntryTotal.expected === 0) {
      return;
    }

    return (
      <ListItem style={{ width: "100%" }}>
        <Paper className={ classes.personEntry }>
          <Box className={ classes.userInfoContainer }>
            <Typography variant="h2">
              { `${person.firstName} ${person.lastName}` }
            </Typography>
            <Typography variant="h4">
              { `${person.startDate}-` }
            </Typography>
          </Box>
          <Box className={ classes.personEntrySubtitle } >
            { renderPersonEntrySubtitleText(`${strings.logged}:`, timeEntryTotal!.logged || 0, false) }
            { renderPersonEntrySubtitleText(`${strings.expected}:`, timeEntryTotal!.expected || 0, false) }
            { renderPersonEntrySubtitleText(`${strings.total}:`, timeEntryTotal!.total, true, timeEntryTotal!.total >= 0) }
          </Box>
          <Divider orientation="vertical"/>
          <IconButton
            onClick={ () => handlePersonRedirectClick(person) }
            className={ classes.personRedirect }
          >
            <KeyboardArrowRightIcon/>
          </IconButton>
        </Paper>
      </ListItem>
    );
  };

  /**
   * Renders the time list 
   */
  const renderTimeList = () => {
    return (
      <>
        <List className={ classes.timeListContainer }>
          { personsTotalTime.map(renderPersonEntry) }
        </List>
      </>
    );
  };

  if (isLoading) {
    return (
      <AppLayout managementScreen>
        <Box className={ classes.loadingContainer }>
          <CircularProgress/>
        </Box>
      </AppLayout>
    );
  }

  /**
   * Component render
   */
  return (
    <AppLayout managementScreen>
      <Toolbar/>
      <Box className={ classes.root }>
        { renderTimeList() }
      </Box>
      { renderRedirect() }
    </AppLayout>
  );
};

export default ManagementScreen;