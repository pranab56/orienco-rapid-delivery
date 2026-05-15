import { baseApi } from "../../utils/apiBaseQuery";


export const faqApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        getFAQ: builder.query({
            query: () => ({
                url: "/public/faq/all",
                method: "GET",
            }),
            providesTags: ["FAQ"],
        }),
    }),
});

// Export hooks
export const {
    useGetFAQQuery,
} = faqApi;
