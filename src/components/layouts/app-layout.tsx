import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AppBar, Box, Drawer, Toolbar, Typography, Select, MenuItem } from "@material-ui/core";
import useAppLayoutStyles from "styles/layouts/app-layout";
import siteLogo from "../../gfx/Metatavu-icon.svg";
import strings from "localization/strings";
import { selectLocale, setLocale } from "features/locale/locale-slice";

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
  const dispatch = useAppDispatch();
  const { locale } = useAppSelector(selectLocale);

  /**
   * Renders language selection
   */
  const renderLanguageSelection = () => (
    <Select
      className={ classes.languageSelect }
      value={ locale }
      onChange={ event => dispatch(setLocale(event.target.value as string)) }
    >
      {
        strings.getAvailableLanguages().map(language =>
          <MenuItem key={ language } value={ language }>
            { language.toUpperCase() }
          </MenuItem>
          )
        }
      </Select>
  );

  /**
   * Renders the header component 
   */
  const renderHeader = () => {
    return (
      <AppBar style={{ zIndex: 1201 }}>
        <Toolbar>
          <Box className={ classes.titleContainer }>
            <img
              src={ siteLogo }
              className={ classes.logo }
              alt={ strings.header.logo }
            />
            <Typography className={ classes.title }>
              { strings.header.title }
            </Typography>
            { renderLanguageSelection() }
          </Box>
        </Toolbar>
      </AppBar>
    );
  };

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
};

export default AppLayout;