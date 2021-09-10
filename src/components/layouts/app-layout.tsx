import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AppBar, Box, Drawer, Toolbar, Typography, Select, MenuItem, Button } from "@material-ui/core";
import useAppLayoutStyles from "styles/layouts/app-layout";
import siteLogo from "../../gfx/Metatavu-icon.svg";
import strings from "localization/strings";
import { Link } from "react-router-dom";
import { selectLocale, setLocale } from "features/locale/locale-slice";
import classNames from "classnames";
import { logout, selectAuth } from "features/auth/auth-slice";
import theme from "theme/theme";
import AuthUtils from "utils/auth";

/**
 * Component properties
 */
interface Props {
  drawerContent?: React.ReactNode;
  children: React.ReactNode;
  managementScreen?: boolean
}

/**
 * Application layout component
 *
 * @param props component properties
 */
const AppLayout: React.VoidFunctionComponent<Props> = ({ drawerContent, children, managementScreen }) => {
  const classes = useAppLayoutStyles();
  const dispatch = useAppDispatch();
  const { accessToken } = useAppSelector(selectAuth);
  const { locale } = useAppSelector(selectLocale);

  /**
   * 
   * @returns Menu items for language select
   */
  const renderLanguageSelectOptions = () => {
    return (
      strings.getAvailableLanguages().map(language =>
        <MenuItem key={ language } value={ language }>
          { language.toUpperCase() }
        </MenuItem>)
    );
  };

  /**
   * Renders logout
   */
  const renderLogout = () => (
    <Button
      color="primary"
      variant="text"
      onClick={ () => dispatch(logout()) }
    >
      <Typography
        style={{
          color: theme.palette.secondary.main,
          textDecoration: "none",
          fontWeight: 600
        }}
      >
        { strings.header.logout }
      </Typography>
    </Button>
  );

  /**
   * Renders language selection
   */
  const renderLanguageSelection = () => (
    <Select
      className={ classes.languageSelect }
      value={ locale }
      onChange={ event => dispatch(setLocale(event.target.value as string)) }
    >
      { renderLanguageSelectOptions() }
    </Select>
  );

  /**
   * Renders the header component 
   */
  const renderHeader = () => {
    return (
      <AppBar style={{ zIndex: 1201 }}>
        <Toolbar style={{ width: "100%" }}>
          <Link to="/">
            <Box className={ classes.titleContainer }>
              <img
                src={ siteLogo }
                className={ classes.logo }
                alt={ strings.header.logo }
              />
              <Typography variant="h1" className={ classes.title }>
                { strings.header.title }
              </Typography>
            </Box>
          </Link>
          { AuthUtils.isAdmin(accessToken) &&
            <Box className={ classes.managementLinkContainer }>
              <Link to="/management">
                <Box
                  className={
                    classNames(classes.managementLink, managementScreen && classes.activeManagementLink)
                  }
                >
                  <Typography
                    className={
                      classNames(classes.managementLinkText, managementScreen && classes.activeManagementLinkText)
                    }
                  >
                    { strings.header.managementLink }
                  </Typography>
                </Box>
              </Link>
            </Box>
          }
          <Box className={ classes.settings }>
            { renderLogout() }
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
      { drawerContent &&
        <Drawer
          variant="permanent"
          className={ classes.drawer }
          classes={{ paper: classes.drawerPaper }}
        >
          { drawerContent }
        </Drawer>
      }
      <main className={ `${classes.content}` }>
        { children }
      </main>
    </Box>
  );
};

export default AppLayout;