/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import GenericSnackbar from "components/generics/generic-snackbar/generic-snackbar";
import * as React from "react";
import { useCallback, useState } from "react";
import { SyncContextType } from "../../types";

/**
 * Synch context initialization
 */
export const SyncContext = React.createContext<SyncContextType>({
  setSynched: (message: string) => {}
});

/**
 * Provider for synch context
 * 
 * @param children children of the component
 * @returns SynchProvider component
 */
const SyncHandler: React.FC = ({ children }) => {
  const [ synched, setSynched ] = useState<string>();

  /**
   * Handles synch message 
   *
   * @param message message on successful synchronization
   */
  const handleSync = async (message: string): Promise<void> => {
    if (message) {
      setSynched(message);
    }
  };

  const contextValue = {
    setSynched: useCallback(message => handleSync(message), [])
  };

  /**
   * Renders synch dialog
   */
  const renderSyncSnackbar = () => {
    return (
      <GenericSnackbar
        open={ synched !== undefined }
        onClose={ () => setSynched(undefined) }
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