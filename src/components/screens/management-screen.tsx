import React from "react";
import AppLayout from "../layouts/app-layout";
import useManagementScreenStyles from "styles/screens/management-screen";
import { Toolbar, Box, CircularProgress, Paper, Typography, Divider, Button, TextField, Tooltip, Grid, Card } from "@mui/material";
import { PieChart, Pie, Cell, ResponsiveContainer, TooltipProps, Tooltip as RechartTooltip, Legend } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { useAppDispatch, useAppSelector } from "app/hooks";
import Api from "api/api";
import { Person, Timespan } from "generated/client";
import { ErrorContext } from "components/error-handler/error-handler";
import { PersonWithTotalTime, WorkTimeCategory, WorkTimeTotalData } from "types";
import strings from "localization/strings";
import SubdirectoryArrowLeftIcon from "@mui/icons-material/SubdirectoryArrowLeft";
import { useHistory, Link } from "react-router-dom";
import TimeUtils from "utils/time-utils";
import theme from "theme/theme";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { setPerson } from "features/person/person-slice";
import UserInfo from "components/generics/user-info/user-info";
import SearchIcon from "@mui/icons-material/Search";
import { selectAuth } from "features/auth/auth-slice";
import moment from "moment";
import { Create } from "@mui/icons-material";
import GenericDialog from "components/generics/generic-dialog/generic-dialog";
import { SyncOrUpdateContext } from "components/sync-or-update-handler/sync-or-update-handler";
import AuthUtils from "utils/auth";
import CloseIcon from "@mui/icons-material/Close";

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
  const [ billableHoursUpdate, setBillableHoursUpdate ] = React.useState(false);
  const [ errorState, setErrorState ] = React.useState(false);
  const [ newBillablePercentage, setNewBillablePercentage ] = React.useState<number>(0);
  const context = React.useContext(ErrorContext);
  const syncOrUpdateContext = React.useContext(SyncOrUpdateContext);
  const history = useHistory();

  /**
   * Populate one person's total work data
   * 
   * @param person person with total time data
   */
  const populatePersonTotalTimeData = async (person: PersonWithTotalTime): Promise<PersonWithTotalTime> => {
    let totalTime: any[] = [];

    try {
      totalTime = await Api.getPersonsApi(accessToken?.access_token).listPersonTotalTime({
        personId: person.person.id,
        timespan: Timespan.ALL_TIME
      });
    } catch (error) {
      context.setError(strings.errorHandling.fetchTimeDataFailed, error);
    }

    return {
      ...person,
      personTotalTime: totalTime[0]
    };
  };

  /**
   * Fetches the person data & person total time data
   */
  const fetchData = async () => {
    setIsLoading(true);

    try {
      const persons = await Api.getPersonsApi(accessToken?.access_token).listPersons({
        active: true
      });
      const personTotalsTimeList: PersonWithTotalTime[] = persons.map(_person => ({ person: _person }));

      const populatedPersonTotalsTimeList = await Promise.all(personTotalsTimeList.map(populatePersonTotalTimeData));

      setPersonsTotalTime(populatedPersonTotalsTimeList);
      setDisplayedPersonsTotalTime(populatedPersonTotalsTimeList);
    } catch (error) {
      context.setError(strings.errorHandling.fetchUserDataFailed, error);
    }

    setIsLoading(false);
  };

  /**
   * Event handler for billing rate update button click
   */
  const handleBillingRateUpdateClick = async () => {
    if (!selectedPersonWithTotalTime?.personTotalTime) {
      return null;
    }

    if (newBillablePercentage >= 0 && newBillablePercentage <= 100) {
      const { person } = selectedPersonWithTotalTime;
      setBillableHoursUpdate(false);

      try {
        const updatedPerson: PersonWithTotalTime = {
          person: await Api.getPersonsApi(accessToken?.access_token).updatePerson({
            personId: person.id,
            person: { ...person, minimumBillableRate: newBillablePercentage }
          }),
          personTotalTime: selectedPersonWithTotalTime.personTotalTime
        };
        syncOrUpdateContext.setSyncOrUpdate(strings.billableHoursHandling.updateBillableHoursSuccess);
        const personIndex = personsTotalTime.findIndex(_person => _person.person.id === person.id);

        setPersonsTotalTime([
          ...personsTotalTime,
          personsTotalTime[personIndex] = updatedPerson
        ]);
        setSelectedPersonWithTotalTime(updatedPerson);
      } catch (error) {
        context.setError(strings.errorHandling.updateBillingPercentageFailed, error);
      }
    } else {
      setErrorState(true);
      const timer = setTimeout(() => {
        setErrorState(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
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
  const handlePersonRedirectClick = (person: Person) => {
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
   * Handler for billable hours update dialog
   */
  const handleClickOpen = () => {
    setBillableHoursUpdate(true);
  };

  /**
   * Handler for new billable percentage
   * 
   */
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.value;
    const newValueNumber = Number(newValue);
    setNewBillablePercentage(newValueNumber);
  };

  /**
   * Person detail close icon click handler
   */
  const handlePersonCloseClick = () => {
    setSelectedPersonWithTotalTime(undefined);
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
      [WorkTimeCategory.BILLABLE_PROJECT]: strings.billableProject,
      [WorkTimeCategory.NON_BILLABLE_PROJECT]: strings.nonBillableProject,
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
  * Renders the minimum billable hours section
  * 
  * @param name name of the row
  * @param value value of the row
  * @param color color of the row value
  */
  const renderExpectedBillableHours = (name: string, value: string, color?: string) => (
    <Box className={ classes.expectedWorkRow }>
      <Typography className={ classes.expectedWorkNames }>
        { name }
      </Typography>
      <Typography
        style={{ color: color }}
        className={ classes.billableHours }
      >
        <Button
          onClick={ handleClickOpen }
        >
          <Create color="primary"/>
        </Button>
        { `${value} %` }
      </Typography>
    </Box>
  );

  /**
   * Renders piechart
   */
  const renderPieChart = (personWithTotalTime: PersonWithTotalTime, legend: boolean) => {
    const { person, personTotalTime } = personWithTotalTime;

    if (!person || !personTotalTime) {
      return null;
    }

    const workTimeData: WorkTimeTotalData[] = [
      { name: WorkTimeCategory.BILLABLE_PROJECT, balance: personTotalTime.billableProjectTime },
      { name: WorkTimeCategory.NON_BILLABLE_PROJECT, balance: personTotalTime.nonBillableProjectTime },
      { name: WorkTimeCategory.INTERNAL, balance: personTotalTime.internalTime }
    ];

    const COLORS = [ theme.palette.success.main, theme.palette.warning.main ];

    return (
      <ResponsiveContainer className={ classes.pieChartContainer }>
        <PieChart>
          <Pie
            cx="50%"
            cy="50%"
            dataKey="balance"
            data={ workTimeData }
            label={ props => TimeUtils.convertToMinutesAndHours(props.value) }
          >
            { workTimeData.map((entry, index) => (
              <Cell fill={ COLORS[index % COLORS.length] }/>
            )) }
          </Pie>
          { legend ? <Legend wrapperStyle={{ position: "relative" }}/> : null }
          <RechartTooltip content={ renderCustomizedTooltip }/>
        </PieChart>
      </ResponsiveContainer>
    );
  };

  /**
   * Renders the person detail 
   */
  const renderPersonDetail = () => {
    if (!selectedPersonWithTotalTime || !selectedPersonWithTotalTime.personTotalTime) {
      return null;
    }

    const { person } = selectedPersonWithTotalTime;

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
          { renderExpectedBillableHours(`${strings.billableHours}:`, person.minimumBillableRate.toString()) }
        </Box>
        { renderPieChart(selectedPersonWithTotalTime, true) }
        <Box className={ classes.personRedirect }>
          <Divider/>
          <Box className={ classes.personRedirectBox }>
            <Button
              onClick={ () => handlePersonCloseClick() }
              className={ classes.personCloseButton }
            >
              <CloseIcon/>
            </Button>
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
        </Box>
      </Paper>
    );
  };

  /**
   * Renders person entry
   * 
   * @param personsTotalTimeEntry person total time data
   */
  const renderPersonEntry = (personsTotalTimeEntry: PersonWithTotalTime) => {
    const { person, personTotalTime } = personsTotalTimeEntry;

    if (!personTotalTime) {
      return;
    }

    const expectedTime = TimeUtils.convertToHours(personTotalTime.expected);
    const loggedTime = TimeUtils.convertToHours(personTotalTime.logged);

    return (
      <Grid
        item
        lg={3}
        onClick={ handleListItemClick(personsTotalTimeEntry) }
        className={ classes.personListEntry }
      >
        <Card className={ classes.personEntry }>
          <Box className={ classes.userInfoContainer }>
            <Typography variant="h2">
              { `${person.firstName} ${person.lastName}` }
            </Typography>
            <Typography
              variant="h4"
              className={ classes.personEntryDate }
            >
              { `${moment(person.startDate).format("DD.MM.YYYY")} -` }
            </Typography>
            { renderPieChart(personsTotalTimeEntry, false) }
          </Box>
          <Box className={ classes.personEntrySubtitle } >
            <Tooltip
              title={ `${strings.expected}: ${expectedTime}, ${strings.logged}: ${loggedTime}` }
            >
              <Typography
                className={ classes.personEntryTime }
                style={{
                  color: personTotalTime!.balance >= 0 ? theme.palette.success.main : theme.palette.error.main
                }}
              >
                { TimeUtils.convertToHours(personTotalTime.balance) }
              </Typography>
            </Tooltip>
          </Box>
        </Card>
      </Grid>
    );
  };

  /**
   * Renders billiable hours update dialog
   */
  const renderBillableHoursUpdateDialog = () => {
    if (!selectedPersonWithTotalTime || !selectedPersonWithTotalTime.personTotalTime) {
      return null;
    }

    const { person } = selectedPersonWithTotalTime;
    
    return (
      <GenericDialog
        title={ strings.billableHoursHandling.title }
        open={ billableHoursUpdate }
        error={ false }
        onClose={ () => setBillableHoursUpdate(false) }
        onCancel={ () => setBillableHoursUpdate(false) }
        onConfirm={ () => setBillableHoursUpdate(false) }
      >
        <Box className={ classes.updateBillableHoursContent }>
          <Box>
            <Typography variant="h5">
              { `${person.firstName} ${person.lastName}` }
            </Typography>
          </Box>
          <Box
            style={{
              marginTop: theme.spacing(1)
            }}
          >
            <Typography>
              { strings.billableHoursHandling.updateBillableHours }
            </Typography>
            <TextField
              helperText={ strings.billableHoursHandling.billingPercentageError }
              error={ errorState }
              style={{
                marginTop: theme.spacing(1)
              }}
              label={ strings.billableHoursHandling.billingRate }
              type="number"
              defaultValue={ person.minimumBillableRate }
              onChange={ handleChange }
            />
          </Box>
          <Button
            onClick={ handleBillingRateUpdateClick }
            color="secondary"
            variant="contained"
          >
            { strings.billableHoursHandling.updateButton }
          </Button>
        </Box>
      </GenericDialog>
    );
  };

  /**
   * Renders bottom padding 
   */
  const renderBottomPadding = () => (
    <Grid item>
      <Box style={{ height: theme.spacing(14) }}/>
    </Grid>
  );

  /**
   * Renders the time list 
   */
  const renderTimeList = () => {
    if (displayedPersonsTotalTime.length === 0) {
      return (
        <Grid container className={ classes.timeListContainer }>
          <Grid
            item
            sm={12}
          >
            <Typography variant="h4">
              { strings.managementScreen.noUser }
            </Typography>
          </Grid>
        </Grid>
      );
    }

    return (
      <Grid
        container
        className={ classes.timeListContainer }
        spacing={2}
      >
        { displayedPersonsTotalTime.map(renderPersonEntry) }
        { renderBottomPadding() }
      </Grid>
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
        { renderSearch() }
        <Box className={ classes.mainContent }>
          { renderTimeList() }
        </Box>
        { renderRedirect() }
        { renderPersonDetail() }
        { renderBillableHoursUpdateDialog() }
      </Box>
    </AppLayout>
  );
};

export default ManagementScreen;