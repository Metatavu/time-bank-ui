import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "app/store";
import { Person, PersonTotalTime } from "generated/client";

/**
 * Locale state
 */
interface LocaleState {
  person?: Person;
  personTotalTime?: PersonTotalTime;
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
  initialState: initialState,
  reducers: {
    setPerson: (state, { payload }: PayloadAction<Person | undefined>) => {
      state.person = payload;
    },
    setPersonTotalTime: (state, { payload }: PayloadAction<PersonTotalTime | undefined>) => {
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