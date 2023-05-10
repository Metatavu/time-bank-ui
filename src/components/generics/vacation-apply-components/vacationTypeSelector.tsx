import React, { useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from "@mui/material";
import strings from "localization/strings";

interface Props {
  // Add any props that the component needs
}

/**
 * @param props 
 * @returns 
 */
const RenderVacationTypeSelector: React.FC<Props> = () => {
  const [newVacationType, setNewVacationType] = useState("");

  /**
   * Handle vacation type 
   */
  const handleVacationTypeChange = (event: SelectChangeEvent) => {
    const contentValue = event.target.value;
    setNewVacationType(contentValue as string);
  };

  /**
   * Renders the vacation type selection
   */
  const renderVacationType = () => (
    <FormControl
      variant="standard"
      sx={{
        m: 1, minWidth: 165, marginBottom: 4
      }}
    >
      <InputLabel>{ strings.editorContent.vacationType }</InputLabel>
      <Select
        value={newVacationType}
        onChange={handleVacationTypeChange}
        label={ strings.editorContent.vacationType }
      >
        <MenuItem value="Paid leave">{ strings.editorContent.paidLeave }</MenuItem>
        <MenuItem value="Maternity leave">{ strings.editorContent.maternityLeave }</MenuItem>
        <MenuItem value="Parental leave">{ strings.editorContent.parentalLeave }</MenuItem>
        <MenuItem value="Unpaid leave">{ strings.editorContent.unpaidLeave }</MenuItem>
        <MenuItem value="Surplus balance">{ strings.editorContent.surplusBalance }</MenuItem>
      </Select>
    </FormControl>
  );

  return (
    <>
      {/* Add any other JSX code here */}
      {renderVacationType()}
    </>
  );
};

export default RenderVacationTypeSelector;