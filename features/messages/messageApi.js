import { baseApi } from "../../utils/apiBaseQuery";


export const messageApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        sendMessage: builder.mutation({
            query: (formData) => ({
                url: "/message",
                method: "POST",
                body: formData,
            }),
            invalidatesTags: ["message", "Chat"],
        }),

        getSpecificMessages: builder.query({
            query: (chatId) => ({
                url: `/message/${chatId}`,
                method: "GET",
            }),
            providesTags: ["message"],
        }),

        editMessage: builder.mutation({
            query: ({ messageId, data }) => ({
                url: `/message/${messageId}`,
                method: "PATCH",
                body: data,
            }),
            invalidatesTags: ["message"],
        }),

        deleteMessage: builder.mutation({
            query: ({ messageId }) => ({
                url: `/message/${messageId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["message"],
        }),
    }),
});

// Export hooks
export const {
    useSendMessageMutation,
    useGetSpecificMessagesQuery,
    useEditMessageMutation,
    useDeleteMessageMutation,
} = messageApi;
