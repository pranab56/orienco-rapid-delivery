
import { createSlice } from "@reduxjs/toolkit";
import { removeToken, saveToken } from "../../utils/storage";


const initialState = {
  token: null,
  user: null,
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
    },
    setCredentials: (state, action) => {
      const { token, user } = action.payload;
      state.token = token;
      state.user = user;
      saveToken(token);
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      removeToken();
    },
  },
});

export const { setToken, setUser, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;
