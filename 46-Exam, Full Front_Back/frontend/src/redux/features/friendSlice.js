import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Dostluq sorğusu göndərmək
export const sendFriendRequest = createAsyncThunk(
  "friends/sendFriendRequest",
  async ({ friendId }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/friends/send-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
        credentials: "include", // Cookie-dən token göndərmək üçün
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Dostluq sorğusunu qəbul etmək
export const acceptFriendRequest = createAsyncThunk(
  "friends/acceptFriendRequest",
  async ({ friendId }, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:5000/api/friends/accept-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ friendId }),
        credentials: "include", // Cookie-dən token göndərmək üçün
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const friendSlice = createSlice({
  name: "friends",
  initialState: {
    friends: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendFriendRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(acceptFriendRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export default friendSlice.reducer;
