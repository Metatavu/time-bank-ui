import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { AppBar, Box, Drawer, Toolbar, Typography, Select, MenuItem, Button, Dialog, CircularProgress } from "@material-ui/core";
import useAppLayoutStyles from "styles/layouts/app-layout";
import siteLogo from "../../gfx/Metatavu-icon.svg";
import strings from "localization/strings";
import { Link } from "react-router-dom";
import { selectLocale, setLocale } from "features/locale/locale-slice";
import classNames from "classnames";
import { logout, selectAuth } from "features/auth/auth-slice";
import theme from "theme/theme";
import AuthUtils from "utils/auth";
import Api from "api/api";
import { selectPerson, setPerson } from "features/person/person-slice";
import { PersonDto } from "generated/client";
import { ErrorContext } from "components/error-handler/error-handler";

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
  const { person } = useAppSelector(selectPerson);
  const { accessToken } = useAppSelector(selectAuth);
  const { locale } = useAppSelector(selectLocale);
  const [ syncingData, setSyncingData ] = React.useState(false);
  const context = React.useContext(ErrorContext);

  /**
   * Event handler for sync button click
   */
  const handleSyncButtonClick = async () => {
    setSyncingData(true);

    try {
      await Api.getTimeBankApi().timebankControllerSyncWorkTime();
    } catch (error) {
      context.setError("Sync data failed", error);
    }

    if (person) {
      const personCloned = { ...person } as PersonDto;
      dispatch(setPerson(undefined));
      dispatch(setPerson(personCloned));
    }

    setSyncingData(false);
  };

  /**
   * Renders the loading dialog
   */
  const renderLoadingDialog = () => {
    return (
      <Dialog
        className={ classes.loadingDialog }
        open={ syncingData }
        PaperProps={{
          style: {
            backgroundColor: "transparent",
            boxShadow: "none"
          }
        }}
      >
        <Box className={ classes.loadingContainer }>
          <CircularProgress
            color="secondary"
            size={ 60 }
          />
          <Typography className={ classes.loadingText }>
            { strings.header.syncDataLoading }
          </Typography>
        </Box>
      </Dialog>
    );
  };

  /**
   * Renders language selection options
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
  const renderSyncButton = () => (
    <Button
      disabled={ syncingData }
      color="secondary"
      variant="contained"
      onClick={ handleSyncButtonClick }
    >
      <Typography
        style={{
          color: "white",
          textDecoration: "none",
          fontWeight: 600
        }}
      >
        { strings.header.syncData }
      </Typography>
    </Button>
  );

  /**
   * Renders logout
   */
  const renderLogout = () => (
    <Button
      color="primary"
      variant="text"
      onClick={ () => dispatch(logout()) }
      className={ classes.syncButton }
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
            { renderSyncButton() }
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
      { renderLoadingDialog() }
    </Box>
  );
};

export default AppLayout;