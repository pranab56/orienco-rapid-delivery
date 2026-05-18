import { baseApi } from "../../utils/apiBaseQuery";


export const feedbackApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        createFeedBack : builder.mutation({
            query: (data) => ({
                url: "/review",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Feedback"],
        }),
    }),
});

// Export hooks
export const {
    useCreateFeedBackMutation,
} = feedbackApi;
