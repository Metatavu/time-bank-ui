import React from "react";
import AppLayout from "../layouts/app-layout";
import useManagementScreenStyles from "styles/screens/management-screen";
import { Toolbar, Box, CircularProgress, Paper, Typography, List, ListItem, Divider, Button, TextField } from "@material-ui/core";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, TooltipProps } from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";
import { useAppDispatch } from "app/hooks";
import Api from "api/api";
import { PersonDto, TimebankControllerGetTotalRetentionEnum } from "generated/client";
import { ErrorContext } from "components/error-handler/error-handler";
import { CustomPieLabel, PersonWithTotalTime, WorkTimeCategory, WorkTimeTotalData } from "types";
import strings from "localization/strings";
import SubdirectoryArrowLeftIcon from "@material-ui/icons/SubdirectoryArrowLeft";
import { useHistory, Link } from "react-router-dom";
import TimeUtils from "utils/time-utils";
import theme from "theme/theme";
import KeyboardArrowRightIcon from "@material-ui/icons/KeyboardArrowRight";
import { setPerson } from "features/person/person-slice";
import UserInfo from "components/generics/user-info/user-info";
import SearchIcon from "@material-ui/icons/Search";

/**
 * Management screen screen component
 */
const ManagementScreen: React.FC = () => {
  const dispatch = useAppDispatch();

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
    setDisplayedPersonsTotalTime(fetchedPersonsTotalTime);
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
   * List Item click handler
   * 
   * @param event mouse event
   * @param personWithTotalTime person with total time data
   */
  const handleListItemClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>, personWithTotalTime: PersonWithTotalTime) => {
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
  const renderSearch = () => {
    return (
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
   * 
   * @param name name of the row
   * @param value value of the row
   * @param color color of the row value
   */
  const renderExpectedWorkRow = (name: string, value: string, color?: string) => {
    return (
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
  };

  /**
   * Renders the person detail 
   */
  const renderPersonDetail = () => {
    if (!selectedPersonWithTotalTime || !selectedPersonWithTotalTime.timeEntryTotal) {
      return;
    }

    const { person, timeEntryTotal } = selectedPersonWithTotalTime;

    const workTimeData: WorkTimeTotalData[] = [
      { name: WorkTimeCategory.PROJECT, total: timeEntryTotal.projectTime },
      { name: WorkTimeCategory.INTERNAL, total: timeEntryTotal.internalTime }
    ];

    const COLORS = [ theme.palette.success.main, theme.palette.warning.main ];

    return (
      <Paper className={ classes.redirectPersonDetailPaper }>
        <Box mb={ 2 }>
          <UserInfo
            person={ selectedPersonWithTotalTime.person }
          />
        </Box>
        <Divider/>
        <Box width="100%" my={ 2 }>
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
              label={ renderCustomizedLabel }
            >
              { workTimeData.map((entry, index) => (
                <Cell fill={ COLORS[index % COLORS.length] }/>
              )) }
            </Pie>
            <Tooltip content={ renderCustomizedTooltip }/>
          </PieChart>
        </ResponsiveContainer>
        <Button
          onClick={ () => handlePersonRedirectClick(person) }
          className={ classes.personRedirect }
        >
          <Typography style={{ fontWeight: 600 }}>
            { strings.managementScreen.seeMore }
          </Typography>
          <KeyboardArrowRightIcon/>
        </Button>
      </Paper>
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
      <ListItem
        button
        disableRipple
        disableTouchRipple
        selected={ selectedPersonWithTotalTime?.person.id === person.id }
        onClick={ event => handleListItemClick(event, personTotalTime) }
        className={ classes.personListEntry }
      >
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
          { displayedPersonsTotalTime.map(renderPersonEntry) }
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