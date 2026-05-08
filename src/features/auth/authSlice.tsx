import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api from "@/services/axios";
import type { AuthState, LoginPayload } from "@/features/auth/authTypes";

const initialState: AuthState = {
  token: null,
  loading: false,
  error: null,
};

export const loginUser = createAsyncThunk(
  "auth/loginUser",

  async (payload: LoginPayload, thunkAPI) => {
    try {
      const response = await api.post("/login", payload);

      const token = response.data.data.token;

      // localStorage.setItem("token", token);

      return token;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data.message);
    }
  },
);

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    logout: (state) => {
      state.token = null;
      // localStorage.removeItem("token");
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.loading = true;

        state.error = null;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload;
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
