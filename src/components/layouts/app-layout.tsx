import React from "react";
import { AppBar, Box, Drawer, Toolbar } from "@material-ui/core";
import { useAppLayoutStyles } from "styles/layouts/app-layout";

/**
 * Component properties
 */
interface Props {
  drawerContent: React.ReactNode;
  editorContent: React.ReactNode;
}

/**
 * Application layout component
 *
 * @param props component properties
 */
const AppLayout: React.VoidFunctionComponent<Props> = ({ drawerContent, editorContent }) => {
  const classes = useAppLayoutStyles();

  /**
   * Component render
   */
  return (
    <Box className={ classes.root }>
      <AppBar style={{ zIndex: 1201 }}>
        <Toolbar>
          
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={ classes.drawer }
        classes={{ paper: classes.drawerPaper }}
      >
        { drawerContent }
      </Drawer>
      <main className={ classes.content }>
        { editorContent }
      </main>
    </Box>
  );
}

export default AppLayout;