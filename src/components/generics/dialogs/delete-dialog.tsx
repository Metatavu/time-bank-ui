import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import strings from "localization/strings";
// import { useState } from "react";

interface DeleteDialogProps {
  open: boolean;
  onClose: (value: string) => void;
  // value: string;
}

/**
* Renders the confirm window for delete
*/
const DeleteDialog = ({ open, onClose }: DeleteDialogProps) => {
  /**
   * Handles confirm window closing
   */
  const handleClose = (value: string) => {
    onClose(value);
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent>
          <DialogTitle id="alert-dialog-title">
            { strings.dialogHandling.deleteConfirmTitle }
          </DialogTitle>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleClose("1")}
            color="secondary"
            variant="outlined"
            value="1"
          >
            { strings.dialogHandling.cancel }
          </Button>
          <Button
            onClick={() => handleClose("2")}
            color="success"
            variant="outlined"
            value="2"
            autoFocus
          >
            { strings.dialogHandling.delete }
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteDialog;