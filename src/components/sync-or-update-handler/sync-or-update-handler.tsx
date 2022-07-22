/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-vars */
import GenericSnackbar from "components/generics/generic-snackbar/generic-snackbar";
import * as React from "react";
import { useCallback, useState } from "react";
import { SyncOrUpdateContextType } from "../../types";

/**
 * Synch and update context initialization
 */
export const SyncOrUpdateContext = React.createContext<SyncOrUpdateContextType>({
  setSyncOrUpdate: (message: string) => {}
});

/**
 * Provider for synch and update context
 * 
 * @param children children of the component
 * @returns SynchOrUpdateProvider component
 */
const SyncOrUpdateHandler: React.FC = ({ children }) => {
  const [ syncOrUpdate, setSyncOrUpdate ] = useState<string>();

  /**
   * Handles synch message 
   *
   * @param message message on successful synchronization
   */
  const handleSyncOrUpdate = async (message: string): Promise<void> => {
    if (message) {
      setSyncOrUpdate(message);
    }
  };

  const contextValue = {
    setSyncOrUpdate: useCallback(message => handleSyncOrUpdate(message), [])
  };

  /**
   * Renders synch snackbar
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