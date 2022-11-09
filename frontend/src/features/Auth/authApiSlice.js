import { apiSlice } from "../../app/api/apiSlice";
import { logOut, setCredentials } from "./authSlice";

export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    register: builder.mutation({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    verifyEmail: builder.mutation({
      query: (credentials) => ({
        url: "/auth/verify-email",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    forgotPassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    resetPassword: builder.mutation({
      query: (credentials) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    passwordResetConfirm: builder.mutation({
      query: (credentials) => ({
        url: "/auth/password-reset-confirm",
        method: "POST",
        body: { ...credentials },
      }),
    }),

    me: builder.query({
      query: () => "/auth/me",
      method: "GET",
      providesTags: ["User"],
    }),

    setlogout: builder.mutation({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          dispatch(logOut());
          setTimeout(() => {
            dispatch(apiSlice.util.resetApiState());
          }, 1000);
        } catch (err) {
          console.log(err);
        }
      },
    }),

    refresh: builder.mutation({
      query: () => ({
        url: "/auth/refresh-token",
        method: "GET",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data);
          const { accessToken } = data;
          dispatch(setCredentials({ accessToken }));
        } catch (err) {
          console.log(err);
        }
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  usePasswordResetConfirmMutation,
  useMeQuery,
  useSetlogoutMutation,
  useRefreshMutation,
} = authApiSlice;
