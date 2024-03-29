import AppLayout from "../layouts/app-layout";
import useMainScreenStyles from "styles/screens/main-screen";
import { Toolbar, Box } from "@mui/material";
import DrawerContent from "components/drawer-content/drawer-content";
import EditorContent from "components/editor-content/editor-content";

/** Minimum time that loader is visible */

/**
 * Main screen component
 */
const MainScreen = () => {
  const classes = useMainScreenStyles();

  /**
   * Renders the drawer content 
   */
  const renderDrawer = () => {
    return (
      <>
        <Toolbar/>
        <Box className={ classes.scrollableContainer }>
          <Box className={ classes.drawerContainer }>
            <DrawerContent/>
          </Box>
        </Box>
      </>
    );
  };

  /**
   * Renders the editor content 
   */
  const renderEditorContent = () => {
    return (
      <>
        <Toolbar/>
        <Box className={ classes.scrollableEditorContainer }>
          <Box className={ classes.editorContainer }>
            <EditorContent/>
          </Box>
        </Box>
      </>
    );
  };

  /**
   * Component render
   */
  return (
    <AppLayout
      drawerContent={ renderDrawer() }
    >
      { renderEditorContent() }
    </AppLayout>
  );
};

export default MainScreen;