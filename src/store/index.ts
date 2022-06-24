import { configureStore } from "@reduxjs/toolkit";
import { setupListeners } from "@reduxjs/toolkit/query/react";

import meetupReducer, {
  sliceName as meetupSliceName,
} from "~/store/features/meetup/meetupSlice";
import walletReducer, {
  sliceName as walletSliceName,
} from "~/store/features/wallet/walletSlice";
import { meetupApi } from "~/services/meetup";

export const store = configureStore({
  reducer: {
    [meetupSliceName]: meetupReducer,
    [walletSliceName]: walletReducer,
    [meetupApi.reducerPath]: meetupApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(meetupApi.middleware),
});

setupListeners(store.dispatch);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
