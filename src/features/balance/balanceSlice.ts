import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";

import api from "@/services/axios";

interface BalanceState {
  balance: number;
  loading: boolean;
  showBalance: boolean;
}

const initialState: BalanceState = {
  balance: 0,
  loading: false,
  showBalance: false,
};

export const getBalance = createAsyncThunk(
  "balance/getBalance",

  async (_, thunkAPI) => {
    try {
      const response = await api.get("/balance");

      return response.data.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response?.data);
    }
  },
);

const balanceSlice = createSlice({
  name: "balance",

  initialState,

  reducers: {
    clearBalance: (state) => {
      state.balance = 0;
    },
    addBalance: (state, action) => {
      state.balance += action.payload;
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.balance = action.payload;
    },
    toggleBalance: (state) => {
      state.showBalance = !state.showBalance;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(getBalance.pending, (state) => {
        state.loading = true;
      })

      .addCase(getBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.balance = action.payload.balance;
      })

      .addCase(getBalance.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { clearBalance, addBalance, setBalance, toggleBalance } =
  balanceSlice.actions;

export default balanceSlice.reducer;
