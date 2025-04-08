import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile/`,
        method: 'PUT',
        body: data,
      }),
    }),
    getAllUsers: builder.query({
      query: () => ({
        url: `${USERS_URL}`,
      }),
      providesTags: ['Users'],
      keepUnusedDataFor: 5,
    }),
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
    }),
    getUserAvatar: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/avatar`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ['UserAvatar'],
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),
    getUserFavorites: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/favorites`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Favorites"],
    }),
    addFavorite: builder.mutation({
      query: ({ userId, buildingId }) => ({
        url: `${USERS_URL}/${userId}/favorites/${buildingId}`,
        method: 'POST',
        credentials: "include",
      }),
      invalidatesTags: ["Favorites"],
    }),
    removeFavorite: builder.mutation({
      query: ({ userId, buildingId }) => ({
        url: `${USERS_URL}/${userId}/favorites/${buildingId}`,
        method: 'DELETE',
        credentials: "include",
      }),
      invalidatesTags: ["Favorites"],
    }),
    getUserCart: builder.query({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}/cart`,
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: ({ userId, buildingId }) => ({
        url: `${USERS_URL}/${userId}/cart/${buildingId}`,
        method: "POST",
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: ({ userId, buildingId }) => ({
        url: `${USERS_URL}/${userId}/cart/${buildingId}`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetUserAvatarQuery,
  useGetUserDetailsQuery,
  useGetAllUsersQuery,
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useProfileMutation,
  useUpdateProfileMutation,
  useGetUserFavoritesQuery,
  useAddFavoriteMutation,
  useRemoveFavoriteMutation,
  useGetUserCartQuery,
  useAddToCartMutation,
  useRemoveFromCartMutation,
} = usersApiSlice;
export default usersApiSlice;
