import { baseApi } from "../../utils/apiBaseQuery";


export const policyApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getTermAndCondition: builder.query({
            query: () => ({
                url: "/public/terms-and-condition",
                method: "GET",
            }),
            providesTags: ["policy"],
        }),

        getPrivacyPolicy: builder.query({
            query: () => ({
                url: "/public/privacy-policy",
                method: "GET",
            }),
            providesTags: ["policy"],
        }),
    }),
});

// Export hooks
export const {
    useGetTermAndConditionQuery,
    useGetPrivacyPolicyQuery,
} = policyApi;
