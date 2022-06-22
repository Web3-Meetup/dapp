import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Meetup } from './types'

export const meetupApi = createApi({
  reducerPath: 'meetupApi',
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_MEETUP_API_BASEURL }),
  endpoints: (builder) => ({
    getMeetupById: builder.query<Meetup, string>({
      query: (id) => `meetups/${id}`,
    }),
  }),
})

export const { useGetMeetupByIdQuery } = meetupApi