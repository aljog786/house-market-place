import { USERS_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const usersApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/auth`,
                method: 'POST',
                body: data
            })
        }),
        register: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}`,
                method: 'POST',
                body: data
        })
    }),
        logout: builder.mutation({
            query: () => ({
                url: `${USERS_URL}/logout`,
                method: 'POST'
            })
        }),
        profile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile/`,
                method: 'PUT',
                body: data
            })
        }),
        getAllUsers: builder.query({
            query: () => ({
                url: `${USERS_URL}`
            }),
            providesTags: ['Users'],
            keepUnusedDataFor: 5
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: `${USERS_URL}/profile`,
                method: 'PUT',
                body: data
            })
        }),
        getUserFavorites: builder.query({
            query: (userId) => ({
                url: `${USERS_URL}/${userId}/favorites`,
                method: "GET",
                credentials: "include",
            }),
            providesTags: ["Favorites"],
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
        })
    })
})

export const { useGetAllUsersQuery,useLoginMutation,useRegisterMutation,useLogoutMutation,useProfileMutation,useUpdateProfileMutation,useGetUserFavoritesQuery,useGetUserCartQuery,useAddToCartMutation,useRemoveFromCartMutation } = usersApiSlice;