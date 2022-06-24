import type { Topic } from '~/services/meetup/types';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '~/store'

interface MeetupState {
  topics: Topic[],
  isLoading: boolean,
  organizers: string[];
  balance: number;
}

const initialState: MeetupState = {
  topics: [],
  isLoading: false,
  organizers: [],
  balance: 0
}

export const sliceName = "meetup";

export const meetupSlice = createSlice({
  name: sliceName,
  initialState,
  reducers: {
    init: (state, action: PayloadAction<{topics: Topic[], organizers:string[], balance: number}>) => {
      const { topics, organizers, balance } = action.payload;
      state.topics = topics;
      state.organizers = organizers;
      state.balance = balance;
    },
    addTopic: (state, action: PayloadAction<Topic>) => { 
      state.topics.push(action.payload);
    },
    likeTopic: (state, action: PayloadAction<number>) => {
      state.topics[action.payload].likes++;
    },
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    updateBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    }
  },
})

export const { addTopic, likeTopic, setIsLoading, updateBalance, init } = meetupSlice.actions

const selectMeetup = (state: RootState) => state[sliceName];

export const selectTopics = createSelector(selectMeetup, (meetup) => meetup.topics);
export const selectIsLoading = createSelector(selectMeetup, (meetup) => meetup.isLoading);
export const selectOrganizers = createSelector(selectMeetup, (meetup) => meetup.organizers);
export const selectBalance = createSelector(selectMeetup, (meetup) => meetup.balance);

export default meetupSlice.reducer