import { baseApi } from "../../utils/apiBaseQuery";


export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),

     signUp : builder.mutation({
      query: (data) => ({
        url: "/auth/signup",
        method: "POST",
        body: data,
      }),
    }),

    forgotEmail: builder.mutation({
      query: (forgotEmail) => ({
        url: "/auth/forget-password",
        method: "POST",
        body: forgotEmail,
      }),
    }),

    verifyOtp: builder.mutation({
      query: (data) => ({
        url: "/auth/verify-account",
        method: "POST",
        body: data,
      }),
    }),

    resendPassword: builder.mutation({
      query: ({ token, data }) => ({
        url: `/auth/reset-password?token=${token}`,
        method: "POST",
        body: data,
      }),
    }),
    
  }),
});

// Export hooks
export const {
  useLoginMutation,
  useSignUpMutation,
  useForgotEmailMutation,
  useVerifyOtpMutation,
  useResendPasswordMutation,
} = authApi;
