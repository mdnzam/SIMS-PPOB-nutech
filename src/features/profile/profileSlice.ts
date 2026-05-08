import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import api from "@/services/axios";

import type { Profile } from "@/types/profile";

interface ProfileState {
  profile: Profile | null;
  loading: boolean;
}

const initialState: ProfileState = {
  profile: null,
  loading: false,
};

export const getProfile = createAsyncThunk(
  "profile/getProfile",

  async (_, thunkAPI) => {
    try {
      const response = await api.get("/profile");

      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

const profileSlice = createSlice({
  name: "profile",

  initialState,

  reducers: {
    clearProfile: (state) => {
      state.profile = null;
    },
    setProfile: (state, action: PayloadAction<Profile>) => {
      state.profile = action.payload;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getProfile.pending, (state) => {
        state.loading = true;
      })

      .addCase(getProfile.fulfilled, (state, action) => {
        state.loading = false;

        state.profile = action.payload;
      })

      .addCase(getProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearProfile, setProfile } = profileSlice.actions;

export default profileSlice.reducer;
