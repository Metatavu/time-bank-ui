import { configureStore } from "@reduxjs/toolkit";
import localeReducer from "features/locale/locale-slice";
import personReducer from "features/person/person-slice";
import authReducer from "features/auth/auth-slice";
import vacationReducer from "features/vacation/vacation-slice";

/**
 * Initialized Redux store
 */
export const store = configureStore({
  middleware: getDefaultMiddleware => getDefaultMiddleware({ serializableCheck: false }),
  reducer: {
    locale: localeReducer,
    person: personReducer,
    auth: authReducer,
    vacation: vacationReducer
  }
});

/**
 * Type of root state of Redux store
 */
export type RootState = ReturnType<typeof store.getState>;

/**
 * Type of dispatch method for dispatching actions to Redux store
 */
export type AppDispatch = typeof store.dispatch;