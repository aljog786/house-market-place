import { apiSlice } from './apiSlice';

export const chatsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => '/chats', // your backend route
      providesTags: ['Chats'],
    }),
  })
});

export const { useGetChatsQuery } = chatsApiSlice;