import React from "react";

import { Snackbar } from "@material-ui/core";
import { Alert, Color } from "@material-ui/lab";

/**
 * Interface representing component properties
 */
interface Props {
  open: boolean;
  autoHideDuration: number;
  onClose: () => void;
  severity: Color;
  message?: string;
}

/**
 * React component displaying snackbar
 */
const GenericSnackbar: React.FC<Props> = ({
  open,
  autoHideDuration,
  onClose,
  severity,
  message
}) => {
  /**
  * Event handler for on close click
  *
  * @param reason reason why snackbar was closed
  */
  const onCloseClick = (reason: string) => {
    if (reason === "backdropClick") {
      return;
    }

    onClose();
  };
  /**
   * Component render
   */
  return (
    <Snackbar
      open={ open }
      onClose={ (event, reason) => onCloseClick(reason) }
      autoHideDuration={autoHideDuration}
    >
      <Alert
        severity={severity}
      >
        { message }
      </Alert>
    </Snackbar>
  );
};

export default GenericSnackbar;