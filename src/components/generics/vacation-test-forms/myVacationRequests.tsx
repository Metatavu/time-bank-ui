/* eslint-disable */
import React, { useState } from 'react';
import { Accordion, AccordionSummary, Collapse, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import useEditorContentStyles from "styles/editor-content/editor-content";
import theme from "theme/theme";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import myVacationRequests from './myVacationMockData.json';
import DeleteIcon from '@mui/icons-material/Delete';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { request } from 'http';
import TestRangePicker from './myVacationComponent';
import { CalendarPickerView } from '@mui/x-date-pickers';





