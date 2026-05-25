import { baseApi } from "@/utils/apiBaseQuery";

export const parcelApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createParcel: builder.mutation({
      query: (data) => ({
        url: `/parcel/create-parcel`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Parcel"],
    }),

    getMyPercel: builder.query({
      query: (page) => ({
        url: `/parcel/my-parcels?page=${page}&status=ACCEPTED,PENDING,IN_TRANSIT`,
        method: "GET",
      }),
      invalidatesTags: ["Parcel"],
    }),

    singleParcelDetails: builder.query({
      query: (id) => ({
        url: `/parcel/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Parcel"],
    }),


    getMyPercelHistory: builder.query({
      query: (page) => ({
        url: `/parcel/my-parcels?page=${page}&status=DELIVERED`,
        method: "GET",
      }),
      invalidatesTags: ["Parcel"],
    }),

    singleParcelHistoryDetails: builder.query({
      query: (id) => ({
        url: `/parcel/${id}`,
        method: "GET",
      }),
      invalidatesTags: ["Parcel"],
    }),

    cancelParcel: builder.mutation({
      query: (id) => ({
        url: `/parcel/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: ["Parcel"],
    }),



    calculateDistacePrice: builder.query({
      query: ({ pickupLat, pickupLng, dropLat, dropLng }) => ({
        url: `/parcel/calculate-distance?pickupLat=${pickupLat}&pickupLng=${pickupLng}&dropLat=${dropLat}&dropLng=${dropLng}`,
        method: "GET",
      }),
      invalidatesTags: ["Parcel"],
    }),


  }),
});

export const {
  useCreateParcelMutation,
  useGetMyPercelQuery,
  useSingleParcelDetailsQuery,
  useGetMyPercelHistoryQuery,
  useSingleParcelHistoryDetailsQuery,
  useCalculateDistacePriceQuery,
  useCancelParcelMutation
} = parcelApi;
