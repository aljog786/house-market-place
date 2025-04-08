import { apiSlice } from './apiSlice';
import { BUILDINGS_URL, UPLOAD_URL } from '../constants';

export const buildingsApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getBuildings: builder.query({
            query: () => ({
                url: `${BUILDINGS_URL}`
            }),
            providesTags: ['Building'],
        }),

        getBuildingDetails: builder.query({
            query: (id) => ({
                url: `${BUILDINGS_URL}/${id}`
            })
        }),
createBuilding: builder.mutation({
    query: (buildingData) => ({
        url: `${BUILDINGS_URL}`,
        method: 'POST',
        body: buildingData,
        headers: {
      'Content-Type': 'application/json',
    }
    }),
    invalidatesTags: ['Building']
  }),
  uploadBuildingImage: builder.mutation({
    query: (formData) => ({
        url: `${UPLOAD_URL}`,
        method: 'POST',
        body: formData,
        credentials: 'include'   
     })
}),
        updateBuilding: builder.mutation({
            query: ({ id, ...buildingData }) => ({
                url: `${BUILDINGS_URL}/${id}`,
                method: 'PUT',
                body: buildingData,
            }),
            invalidatesTags: (result, error, { id }) => [{ type: 'Building', id }],
        }),
        deleteBuilding: builder.mutation({
            query: (id) => ({
                url: `${BUILDINGS_URL}/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Building'],
        })
    })
})

export const {
    useGetBuildingsQuery,
    useGetBuildingDetailsQuery,
    useCreateBuildingMutation,
    useUpdateBuildingMutation,
    useDeleteBuildingMutation,
    useUploadBuildingImageMutation,
} = buildingsApiSlice;

export default buildingsApiSlice;