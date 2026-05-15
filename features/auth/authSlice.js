import { createSlice } from "@reduxjs/toolkit";
import { getToken, getRefreshToken, getUser, saveToken, saveRefreshToken, saveUser, removeStorage } from "../../utils/storage";

const initialState = {
  token: getToken(),
  refreshToken: getRefreshToken(),
  user: getUser(),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
      saveToken(action.payload);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      saveUser(action.payload);
    },
    setCredentials: (state, action) => {
      const { token, refreshToken, user } = action.payload;
      state.token = token;
      state.refreshToken = refreshToken;
      state.user = user;
      saveToken(token);
      if (refreshToken) saveRefreshToken(refreshToken);
      saveUser(user);
    },
    logout: (state) => {
      state.token = null;
      state.refreshToken = null;
      state.user = null;
      removeStorage();
    },
  },
});

export const { setToken, setUser, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
