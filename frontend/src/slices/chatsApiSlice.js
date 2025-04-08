import { apiSlice } from './apiSlice';

export const chatsApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getChats: builder.query({
      query: () => '/chats',
      providesTags: ['Chats'],
    }),
    createOrGetChat: builder.mutation({
      query: ({ buildingId, currentUserId, ownerId }) => ({
        url: '/chats/createOrGetChat',
        method: 'POST',
        body: { buildingId, currentUserId, ownerId },
      }),
      invalidatesTags: ['Chats'],
    }),
  }),
});

export const { useGetChatsQuery, useCreateOrGetChatMutation } = chatsApiSlice;
