import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Dostluq sorğusu göndər
export const sendFriendRequest = createAsyncThunk(
  "friends/sendFriendRequest",
  async ({ userId, friendId }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/friends/send-request", { userId, friendId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// Dostluq sorğusunu qəbul et
export const acceptFriendRequest = createAsyncThunk(
  "friends/acceptFriendRequest",
  async ({ userId, friendId }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/friends/accept-request", { userId, friendId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// İstifadəçini izləmək
export const followUser = createAsyncThunk(
  "friends/followUser",
  async ({ userId, followId }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/friends/follow", { userId, followId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

// İstifadəçini izləməkdən çıxmaq
export const unfollowUser = createAsyncThunk(
  "friends/unfollowUser",
  async ({ userId, unfollowId }, { rejectWithValue }) => {
    try {
      const response = await axios.post("/api/friends/unfollow", { userId, unfollowId });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const friendSlice = createSlice({
  name: "friends",
  initialState: {
    friends: [],
    followers: [],
    following: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.friends.push(action.payload);
      })
      .addCase(sendFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(acceptFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(acceptFriendRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.friends.push(action.payload);
      })
      .addCase(acceptFriendRequest.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        state.following.push(action.payload);
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.loading = false;
        state.following = state.following.filter(
          (user) => user._id !== action.payload.unfollowId
        );
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default friendSlice.reducer;