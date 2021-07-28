import React from "react";
import { Box } from "@material-ui/core";
import Api from "api/api";
import { useEditorContentStyles } from "styles/editor-content copy/editor-content";

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
   * Component render
   */
  return (
    <>
      <Box className={ classes.root }>

      </Box>
    </>
  );


}

export default EditorContent;