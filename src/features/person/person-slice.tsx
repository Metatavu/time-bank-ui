import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store";
import { PersonDto, TimeEntryTotalDto } from "generated/client";

/**
 * Locale state
 */
interface LocaleState {
  person?: PersonDto;
  personTotalTime?: TimeEntryTotalDto;
}

/**
 * Initial person state
 */
const initialState: LocaleState = {
  person: undefined,
  personTotalTime: undefined
};

/**
 * Person slice of Redux store
 */
export const personSlice = createSlice({
  name: "person",
  initialState,
  reducers: {
    setPerson: (state, { payload }: PayloadAction<PersonDto>) => {
      state.person = payload;
    },
    setPersonTotalTime: (state, { payload }: PayloadAction<TimeEntryTotalDto>) => {
      state.personTotalTime = payload;
    }
  }
});

/**
 * Person actions from created person slice
 */
export const { setPerson, setPersonTotalTime } = personSlice.actions;

/**
 * Select person selector
 *
 * @param state Redux store root state
 * @returns person from Redux store
 */
export const selectPerson = (state: RootState) => state.person;

/**
 * Reducer for person slice
 */
export default personSlice.reducer;
