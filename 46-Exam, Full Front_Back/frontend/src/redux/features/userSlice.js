import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Cookie-dən token oxumaq üçün funksiya
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("http://localhost:5000/auth/login", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "An error occurred");
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: getCookie("token") || null, 
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
      state.token = null;
      document.cookie = "token=; Max-Age=-99999999;"; 
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
        state.user = action.payload.existUser || {}; // Safeguard in case of undefined
        state.token = action.payload.token;
        document.cookie = `token=${action.payload.token}; path=/`; // Token-i cookie-yə yazırıq
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
