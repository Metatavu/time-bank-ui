import React from "react";
import { Box, Paper, Typography } from "@material-ui/core";
import Api from "api/api";
import { useEditorContentStyles } from "styles/editor-content/editor-content";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectPerson, setPersonTotalTime } from "features/person/person-slice";
import strings from "localization/strings";
import { TimebankControllerGetTotalRetentionEnum } from "generated/client";
import theme from "theme/theme";

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
  const dispatch = useAppDispatch();

  const { person, personTotalTime } = useAppSelector(selectPerson);

  /**
   * Fetches the person data 
   */
  const fetchData = async () => {
    if (person && person.id) {
      Api.getTimeBankApi()
        .timebankControllerGetTotal({
          personId: person.id.toString(),
          retention: TimebankControllerGetTotalRetentionEnum.ALLTIME
        })
        .then(fetchedPersonTotalTime =>
          dispatch(setPersonTotalTime(fetchedPersonTotalTime[0]))
        );
    }
  }

  React.useEffect(() => {
    fetchData();    
  }, [ person ]);

  /**
   * Utility method converts time in minute to a string formatted as xhymin 
   * 
   * @param mminutes time in minutes
   * @return formatted string of time 
   */
  const timeConverterUtil = (minutes: number): string => {
    const hour = Math.floor(minutes / 60);
    const minute = minutes % 60;

    return `${hour}h ${minute}min`;
  }

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
          style={{ marginLeft: theme.spacing(2) }}
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
          { timeConverterUtil(value) }
        </Typography>
      </>
    );
  }

  /**
   * Renders the filter component
   */
  const renderFilter = () => {
    if (!personTotalTime) {
      return (
        <Paper 
          elevation={ 3 }
          className={ classes.filterContainer }
        >
          <Typography style={{ fontStyle: "italic" }}>
            { strings.editorContent.userNotSelected }
          </Typography>
        </Paper>
      );
    }

    return (
      <Paper 
        elevation={ 3 }
        className={ classes.filterContainer }
      >
        <Typography
          variant="h4"
          style={{
            fontWeight: 600,
            fontStyle: "italic",
          }}
        >
          { strings.editorContent.totalWorkTime }
        </Typography>
        { renderFilterSubtitleText(strings.logged, personTotalTime.logged) }
        { renderFilterSubtitleText(strings.expected, personTotalTime.expected) }
        { renderFilterSubtitleText(strings.total, personTotalTime.total) }
      </Paper>
    );
  }

  /**
   * Renders the filter component
   */
  const renderOverview = () => {
    if (!personTotalTime) {
      return null;
    }

    return (
      <Paper 
        elevation={ 3 }
        className={ classes.overviewContainer }
      >
      </Paper>
    );
  }

  /**
   * Component render
   */
  return (
    <>
      { renderFilter() }
      {/* TODO */}
      {/* { renderOverview() } */}
    </>
  );


}

export default EditorContent;
