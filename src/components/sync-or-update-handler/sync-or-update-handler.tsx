/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import GenericSnackbar from "components/generics/generic-snackbar/generic-snackbar";
import React, { useCallback, useState } from "react";
import { SyncOrUpdateContextType } from "../../types";

/**
 * Synch and update context initialization
 */
export const SyncOrUpdateContext = React.createContext<SyncOrUpdateContextType>({
  setSyncOrUpdate: (message: string) => {}
});

/**
 * Provider for sync and update context
 * 
 * @param children children of the component
 * @returns SyncOrUpdateProvider component
 */
const SyncOrUpdateHandler: React.FC = ({ children }) => {
  const [ syncOrUpdate, setSyncOrUpdate ] = useState<string>();

  /**
   * Handles sync message 
   *
   * @param message message on successful synchronization
   */
  const handleSyncOrUpdate = (message: string) => {
    if (message) {
      setSyncOrUpdate(message);
    }
  };

  const contextValue = {
    setSyncOrUpdate: useCallback(message => handleSyncOrUpdate(message), [])
  };

  /**
   * Renders sync snackbar
   */
  const renderSyncSnackbar = () => {
    return (
      <GenericSnackbar
        open={ syncOrUpdate !== undefined }
        onClose={ () => setSyncOrUpdate(undefined) }
        autoHideDuration={10000}
        severity="success"
        message={syncOrUpdate}
      />
    );
  };

  /**
   * Component render
   */
  return (
    <SyncOrUpdateContext.Provider value={ contextValue }>
      { renderSyncSnackbar() }
      { children }
    </SyncOrUpdateContext.Provider>
  );
};

export default SyncOrUpdateHandler;