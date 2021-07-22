import React from "react";
import AppLayout from "../layouts/app-layout";
import { useMainScreenStyles } from "styles/screens/main-screen";

/** Minimum time that loader is visible */

/**
 * Main screen component
 */
const MainScreen: React.FC = () => {
  const classes = useMainScreenStyles();

  /**
   * Component render
   */
  return (
    <AppLayout
      drawerContent={ null }
      editorContent={ null }
    />
  );
}

export default MainScreen;