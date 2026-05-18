import { baseApi } from "../../utils/apiBaseQuery";


export const chatApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        createChat: builder.mutation({
            query: (data) => ({
                url: "/chat",
                method: "POST",
                body: data,
            }),
            invalidatesTags: ["Chat"],
        }),

        myChat: builder.query({
            query: () => ({
                url: "/chat",
                method: "GET",
            }),
            providesTags: ["Chat"], 
        }),
    }),
});

// Export hooks
export const {
    useCreateChatMutation,
    useMyChatQuery,
} = chatApi;
