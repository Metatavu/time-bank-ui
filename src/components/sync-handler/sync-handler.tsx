/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import GenericSnackbar from "components/generics/generic-snackbar/generic-snackbar";
import React, { FC, useCallback, useState } from "react";
import { SyncContextType } from "../../types";

/**
 * Sync context initialization
 */
export const SyncContext = React.createContext<SyncContextType>({
  setSynced: (message: string) => {}
});

/**
 * Provider for synch context
 * 
 * @param children children of the component
 * @returns SyncProvider component
 */
const SyncHandler: FC = ({ children }) => {
  const [ synched, setSynced ] = useState<string>();

  /**
   * Handles synch message 
   *
   * @param message message on successful synchronization
   */
  const handleSync = async (message: string): Promise<void> => {
    if (message) {
      setSynced(message);
    }
  };

  const contextValue = {
    setSynced: useCallback(message => handleSync(message), [])
  };

  /**
   * Renders synch dialog
   */
  const renderSyncSnackbar = () => {
    return (
      <GenericSnackbar
        open={ synched !== undefined }
        onClose={ () => setSynced(undefined) }
        autoHideDuration={10000}
        severity="success"
        message={synched}
      />
    );
  };

  /**
   * Component render
   */
  return (
    <SyncContext.Provider value={ contextValue }>
      { renderSyncSnackbar() }
      { children }
    </SyncContext.Provider>
  );
};

export default SyncHandler;