import { baseApi } from "../../utils/apiBaseQuery";


export const contactApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        createContact: builder.mutation({
            query: (data) => ({
                url: "/contact",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["contact"],
        }),
    }),
});

// Export hooks
export const {
    useCreateContactMutation,
} = contactApi;
