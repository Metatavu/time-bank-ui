import React from "react";
import { Box, Paper, Typography } from "@material-ui/core";
import Api from "api/api";
import { useEditorContentStyles } from "styles/editor-content/editor-content";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectPerson, setPersonTotalTime } from "features/person/person-slice";
import strings from "localization/strings";
import { TimebankControllerGetTotalRetentionEnum } from "generated/client";

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

  const { person, personTotalTime } = useAppSelector(selectPerson)

  /**
   * Fetches the person data 
   */
  const fetchData = async () => {
    if (person && person.id) {
      const timeBankApi = Api.getTimeBankApi();
      timeBankApi.timebankControllerGetTotal({
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
  }, [person])

  /**
   * Renders the filter subtitle text
   * 
   * @param name name of the subtitle text
   * @param value namevalue of the subtitle text
   */
  const renderFilterSubtitleText = (name: string, value: number) => {
    return (
      <>
        <Typography
          variant="h5"
          style={{
            marginLeft: 8
          }}
        >
          { name }
        </Typography>
        <Typography
          variant="h5"
          style={{
            marginLeft: 8,
            fontStyle: "italic"
          }}
        >
          { value.toString() }
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
          <Typography
            variant="h5"
            style={{
              fontStyle: "italic",
            }}
          >
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
            fontWeight: 600
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