import { baseApi } from "../../utils/apiBaseQuery";


export const profileApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        // Login
        getMyProfile: builder.query({
            query: () => ({
                url: "/user/me",
                method: "GET",
            }),
        }),
        updateProfile: builder.mutation({
            query: (data) => ({
                url: "/user/profile",
                method: "PATCH",
                body: data,
            }),
        }),

        changePassword: builder.mutation({
            query: (data) => ({
                url: "/auth/change-password",
                method: "POST",
                body: data,
            }),
        }),

    }),
});

// Export hooks
export const {
    useGetMyProfileQuery,
    useUpdateProfileMutation,
    useChangePasswordMutation,
} = profileApi;
