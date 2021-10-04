import React from "react";
import AppLayout from "../layouts/app-layout";
import useManagementScreenStyles from "styles/screens/management-screen";
import { Toolbar, Box, CircularProgress, Paper, Typography, List, ListItem, Divider, Button, TextField, Tooltip } from "@material-ui/core";
import { PieChart, Pie, Cell, ResponsiveContainer, TooltipProps, Tooltip as RechartTooltip } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { useAppDispatch, useAppSelector } from "app/hooks";
import Api from "api/api";
import { PersonDto, TimebankControllerGetTotalRetentionEnum } from "generated/client";
import { ErrorContext } from "components/error-handler/error-handler";
import { PersonWithTotalTime, WorkTimeCategory, WorkTimeTotalData } from "types";
import strings from "localization/strings";
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";
import { useHistory, Link } from "react-router-dom";
import TimeUtils from "utils/time-utils";
import theme from "theme/theme";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { setPerson } from "features/person/person-slice";
import UserInfo from "components/generics/user-info/user-info";
import SearchIcon from "@material-ui/icons/Search";
import { selectAuth } from "features/auth/auth-slice";
import moment from "moment";
import AuthUtils from "utils/auth";
import PersonUtils from "utils/person-utils";

/**
 * Management screen screen component
 */
const ManagementScreen: React.FC = () => {
  const dispatch = useAppDispatch();

  const { accessToken } = useAppSelector(selectAuth);
  const classes = useManagementScreenStyles();
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ personsTotalTime, setPersonsTotalTime ] = React.useState<PersonWithTotalTime[]>([]);
  const [ displayedPersonsTotalTime, setDisplayedPersonsTotalTime ] = React.useState<PersonWithTotalTime[]>([]);
  const [ selectedPersonWithTotalTime, setSelectedPersonWithTotalTime ] = React.useState<PersonWithTotalTime | undefined>(undefined);
  const [ searchInput, setSearchInput ] = React.useState("");
  const context = React.useContext(ErrorContext);
  const history = useHistory();

  /**
   * Populate one person's total work data
   * 
   * @param person person with total time data
   */
  const populatePersonTotalTimeData = async (person: PersonWithTotalTime): Promise<PersonWithTotalTime> => {
    let totalTime: any[] = [];

    try {
      totalTime = await Api.getTimeBankApi().timebankControllerGetTotal({
        personId: person.person.id.toString(),
        retention: TimebankControllerGetTotalRetentionEnum.ALLTIME
      });
    } catch (error) {
      context.setError(strings.errorHandling.fetchTimeDataFailed, error);
    }

    return {
      ...person,
      timeEntryTotal: totalTime[0]
    };
  };

  /**
   * Fetches the person data & person total time data
   */
  const fetchData = async () => {
    setIsLoading(true);

    try {
      const persons = await Api.getTimeBankApi().timebankControllerGetPersons();
      const filteredPersons = PersonUtils.filterPerson(persons);
      const personTotalsTimeList: PersonWithTotalTime[] = filteredPersons.map(_person => ({ person: _person }));

      const populatedPersonTotalsTimeList = await Promise.all(personTotalsTimeList.map(populatePersonTotalTimeData));

      setPersonsTotalTime(populatedPersonTotalsTimeList);
      setDisplayedPersonsTotalTime(populatedPersonTotalsTimeList);
    } catch (error) {
      context.setError(strings.errorHandling.fetchUserDataFailed, error);
    }

    setIsLoading(false);
  };

  React.useEffect(() => {
    if (!accessToken) {
      return;
    }

    if (!AuthUtils.isAdmin(accessToken)) {
      history.push("/");
    }

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
   * List Item click handler
   * 
   * @param personWithTotalTime person with total time data
   */
  const handleListItemClick = (personWithTotalTime: PersonWithTotalTime) => () => {
    setSelectedPersonWithTotalTime(personWithTotalTime);
  };

  /**
   * search input change handler
   * 
   * @param event input change event
   */
  const handleSearchInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchInput = event.target.value;
    setSearchInput(newSearchInput);

    if (newSearchInput === "") {
      setDisplayedPersonsTotalTime(personsTotalTime);
      return;
    }

    const newDisplayedPersonsTotalTime = personsTotalTime.filter(personTotalTime =>
      `${personTotalTime.person.firstName} ${personTotalTime.person.lastName}`.toLowerCase().includes(newSearchInput.toLowerCase()));

    setDisplayedPersonsTotalTime(newDisplayedPersonsTotalTime);
  };

  /**
   * Renders the search 
   */
  const renderSearch = () => (
    <Box className={ classes.searchContainer }>
      <TextField
        value={ searchInput }
        onChange={ handleSearchInputChange }
        placeholder={ strings.managementScreen.searchPlaceholder }
        variant="outlined"
        className={ classes.searchTextField }
        inputProps={{ style: { paddingLeft: theme.spacing(5) } }}
      />
      <SearchIcon className={ classes.searchIcon }/>
    </Box>
  );

  /**
   * Renders the redirect link 
   */
  const renderRedirect = () => (
    <Link to="/">
      <Paper className={ classes.redirectLinkPaper }>
        <SubdirectoryArrowLeftIcon fontSize="large"/>
      </Paper>
    </Link>
  );

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
   * 
   * @param name name of the row
   * @param value value of the row
   * @param color color of the row value
   */
  const renderExpectedWorkRow = (name: string, value: string, color?: string) => (
    <Box className={ classes.expectedWorkRow }>
      <Typography className={ classes.expectedWorkNames }>
        { name }
      </Typography>
      <Typography
        style={{ color: color }}
        className={ classes.expectedWorkValues }
      >
        { value }
      </Typography>
    </Box>
  );

  /**
   * Renders the person detail 
   */
  const renderPersonDetail = () => {
    if (!selectedPersonWithTotalTime || !selectedPersonWithTotalTime.timeEntryTotal) {
      return null;
    }

    const { person, timeEntryTotal } = selectedPersonWithTotalTime;

    const workTimeData: WorkTimeTotalData[] = [
      { name: WorkTimeCategory.PROJECT, total: timeEntryTotal.projectTime },
      { name: WorkTimeCategory.INTERNAL, total: timeEntryTotal.internalTime }
    ];

    const COLORS = [ theme.palette.success.main, theme.palette.warning.main ];

    return (
      <Paper className={ classes.redirectPersonDetailPaper }>
        <Box mb={ 2 } width="100%">
          <UserInfo
            person={ selectedPersonWithTotalTime.person }
          />
        </Box>
        <Divider/>
        <Box width="100%" my={ 2 }>
          { renderExpectedWorkRow(`${strings.startDate}:`, moment(person.startDate).format("DD.MM.YYYY")) }
          { renderExpectedWorkRow(`${strings.monday}:`, TimeUtils.convertToMinutesAndHours(person.monday)) }
          { renderExpectedWorkRow(`${strings.tuesday}:`, TimeUtils.convertToMinutesAndHours(person.tuesday)) }
          { renderExpectedWorkRow(`${strings.wednesday}:`, TimeUtils.convertToMinutesAndHours(person.wednesday)) }
          { renderExpectedWorkRow(`${strings.thursday}:`, TimeUtils.convertToMinutesAndHours(person.thursday)) }
          { renderExpectedWorkRow(`${strings.friday}:`, TimeUtils.convertToMinutesAndHours(person.friday)) }
          { renderExpectedWorkRow(`${strings.saturday}:`, TimeUtils.convertToMinutesAndHours(person.saturday)) }
          { renderExpectedWorkRow(`${strings.sunday}:`, TimeUtils.convertToMinutesAndHours(person.sunday)) }
        </Box>
        <ResponsiveContainer className={ classes.pieChartContainer }>
          <PieChart>
            <Pie
              cx="50%"
              cy="50%"
              dataKey="total"
              data={ workTimeData }
              label={ props => TimeUtils.convertToMinutesAndHours(props.value) }
            >
              { workTimeData.map((entry, index) => (
                <Cell fill={ COLORS[index % COLORS.length] }/>
              )) }
            </Pie>
            <RechartTooltip content={ renderCustomizedTooltip }/>
          </PieChart>
        </ResponsiveContainer>
        <Box className={ classes.personRedirect }>
          <Divider/>
          <Button
            onClick={ () => handlePersonRedirectClick(person) }
            className={ classes.personRedirectButton }
          >
            <Typography style={{ fontWeight: 600 }}>
              { strings.managementScreen.seeMore }
            </Typography>
            <KeyboardArrowRightIcon/>
          </Button>
        </Box>
      </Paper>
    );
  };

  /**
   * Renders person entry
   * 
   * @param personTotalTime person total time data
   */
  const renderPersonEntry = (personTotalTime: PersonWithTotalTime) => {
    const { person, timeEntryTotal } = personTotalTime;

    if (!timeEntryTotal) {
      return null;
    }

    const expectedTime = TimeUtils.convertToHours(timeEntryTotal.expected);
    const loggedTime = TimeUtils.convertToHours(timeEntryTotal.logged);

    return (
      <ListItem
        button
        disableRipple
        disableTouchRipple
        selected={ selectedPersonWithTotalTime?.person.id === person.id }
        onClick={ handleListItemClick(personTotalTime) }
        className={ classes.personListEntry }
      >
        <Paper className={ classes.personEntry }>
          <Box className={ classes.userInfoContainer }>
            <Typography variant="h2">
              { `${person.firstName} ${person.lastName}` }
            </Typography>
            <Typography
              variant="h4"
              className={ classes.personEntryDate }
            >
              { `${moment(person.startDate).format("DD.MM.YYYY")}-` }
            </Typography>
          </Box>
          <Box className={ classes.personEntrySubtitle } >
            <Tooltip
              title={ `${strings.expected}: ${expectedTime}, ${strings.logged}: ${loggedTime}` }
            >
              <Typography
                className={ classes.personEntryTime }
                style={{
                  color: timeEntryTotal!.total >= 0 ? theme.palette.success.main : theme.palette.error.main
                }}
              >
                { TimeUtils.convertToHours(timeEntryTotal.total) }
              </Typography>
            </Tooltip>
          </Box>
        </Paper>
      </ListItem>
    );
  };

  /**
   * Renders bottom padding 
   */
  const renderBottomPadding = () => (
    <ListItem>
      <Box style={{ height: theme.spacing(14) }}/>
    </ListItem>
  );

  /**
   * Renders the time list 
   */
  const renderTimeList = () => {
    if (displayedPersonsTotalTime.length === 0) {
      return (
        <List className={ classes.timeListContainer }>
          <Typography variant="h4">
            { strings.managementScreen.noUser }
          </Typography>
        </List>
      );
    }

    return (
      <List className={ classes.timeListContainer }>
        { displayedPersonsTotalTime.map(renderPersonEntry) }
        { renderBottomPadding() }
      </List>
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
        <Box className={ classes.mainContent }>
          { renderTimeList() }
        </Box>
        { renderSearch() }
        { renderRedirect() }
        { renderPersonDetail() }
      </Box>
    </AppLayout>
  );
};

export default ManagementScreen;