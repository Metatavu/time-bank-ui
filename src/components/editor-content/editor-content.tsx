import React from "react";
import { Box, Paper, Typography } from "@material-ui/core";
import Api from "api/api";
import { useEditorContentStyles } from "styles/editor-content copy/editor-content";
import { useAppSelector } from "app/hooks";
import { selectPerson } from "features/person/person-slice";
import strings from "localization/strings";

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

  const { person, personTotalTime } = useAppSelector(selectPerson)

  /**
   * Fetches the person data 
   */
  const fetchData = async () => {
    const timeBankApi = Api.getTimeBankApi();
    // TODO
  }

  React.useEffect(() => {
    fetchData();    
  }, [])

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
          variant="h4"
          style={{
            marginLeft: 8
          }}
        >
          { name }
        </Typography>
        <Typography
          variant="h4"
          style={{
            marginLeft: 8
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
    return (
      <Paper 
        elevation={ 3 }
        className={ classes.filterContainer }
      >
        { personTotalTime ? (<Box>
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
          </Box>) : (
          <Typography
            variant="h5"
            style={{
              fontStyle: "italic",
            }}
          >
              { strings.editorContent.userNotSelected }
            </Typography>
          )
        }
      </Paper>
    );
  }

  /**
   * Renders the filter component
   */
  const renderOverview = () => {
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
      { renderOverview() }
    </>
  );


}

export default EditorContent;