import React from "react";
import AppLayout from "../layouts/app-layout";
import { useMainScreenStyles } from "styles/screens/main-screen";
import UserInfo from "components/user-info/user-info";
import { Avatar, Box, Typography } from "@material-ui/core";

/** Minimum time that loader is visible */

/**
 * Main screen component
 */
const MainScreen: React.FC = () => {
  const classes = useMainScreenStyles();

  const renderUserInfo = () => {
    return (
      <UserInfo />
    );
  }

  /**
   * Component render
   */
  return (
    <AppLayout
      drawerContent={ renderUserInfo() }
      editorContent={ null }
    />
  );
}

export default MainScreen;