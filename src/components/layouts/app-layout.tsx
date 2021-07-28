import React from "react";
import { AppBar, Box, Drawer, Toolbar, Typography } from "@material-ui/core";
import { useAppLayoutStyles } from "styles/layouts/app-layout";
import siteLogo from "../../gfx/Metatavu-icon.svg";
import strings from "localization/strings";

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
   * Renders the header component 
   */
  const renderHeader = () => {
    return (
      <AppBar style={{ zIndex: 1201 }}>
        <Toolbar>
          <Box className={ classes.titleContainer }>
            <img src={ siteloge } className={ classes.logo }/>
            <Typography className={ classes.title }>
              { strings.header.title }
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>
    );
  }

  /**
   * Component render
   */
  return (
    <Box className={ classes.root }>
      { renderHeader() }
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
