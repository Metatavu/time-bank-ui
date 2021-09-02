import React from "react";
import AppLayout from "../layouts/app-layout";
import useManagementScreenStyles from "styles/screens/management-screen";
import { Toolbar, Box, CircularProgress } from "@material-ui/core";
// import { useAppDispatch, useAppSelector } from "app/hooks";
import Api from "api/api";
import { TimebankControllerGetTotalRetentionEnum } from "generated/client";
import { ErrorContext } from "components/error-handler/error-handler";
import { PersonWithTotalTime } from "types";
// import { selectPerson } from "features/person/person-slice";
import strings from "localization/strings";

/** Minimum time that loader is visible */

/**
 * Management screen screen component
 */
const ManagementScreen: React.FC = () => {
  // const dispatch = useAppDispatch();
  // const { person, personTotalTime } = useAppSelector(selectPerson);
  const classes = useManagementScreenStyles();
  const [ isLoading, setIsLoading ] = React.useState(false);
  const [ personsTotalTime, setPersonsTotalTime ] = React.useState<PersonWithTotalTime[]>([]);
  const context = React.useContext(ErrorContext);

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
   * Renders the editor content 
   */
  const renderTimeList = () => {
    console.log(personsTotalTime);
    return (
      <>
        <Toolbar/>
        <Box className={ classes.scrollableEditorContainer }>
          <Box className={ classes.editorContainer }>
            Hello
          </Box>
        </Box>
      </>
    );
  };

  if (isLoading) {
    console.log("isLoading");
    return (
      <AppLayout>
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
    <AppLayout>
      { renderTimeList() }
    </AppLayout>
  );
};

export default ManagementScreen;