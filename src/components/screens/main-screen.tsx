import React from "react";
import AppLayout from "../layouts/app-layout";
import { useMainScreenStyles } from "styles/screens/main-screen";
import { Toolbar } from "@material-ui/core";
import { Box } from "@material-ui/core";
import DrawerContent from "components/drawer-content/drawer-content";

/** Minimum time that loader is visible */

/**
 * Main screen component
 */
const MainScreen: React.FC = () => {
  const classes = useMainScreenStyles();

  /**
   * Renders the drawer content 
   */
  const renderDrawer = () => {
    return (
      <>
        <Toolbar />
        <Box className={ classes.root }>
          <DrawerContent />
        </Box>
      </>
    );
  }

  /**
   * Component render
   */
  return (
    <AppLayout
      drawerContent={ renderDrawer() }
      editorContent={ null }
    />
  );
}

export default MainScreen;