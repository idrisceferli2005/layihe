import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const followUser = createAsyncThunk(
  "follow/followUser",
  async ({ userId, followId }, { rejectWithValue }) => {
    try {
      await axios.post(
        "http://localhost:5000/api/friends/follow",
        { userId, followId },
        { withCredentials: true }
      );
      return followId;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async ({ userId, unfollowId }, { rejectWithValue }) => {
    try {
      await axios.post(
        "http://localhost:5000/api/friends/unfollow",
        { userId, unfollowId },
        { withCredentials: true }
      );
      return unfollowId;
    } catch (error) {
      return rejectWithValue(error.response.data.message || error.message);
    }
  }
);

const initialState = {
  following: [],
  followers: [],
  loading: false,
  error: null,
};

const friendSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    setFollowing: (state, action) => {
      state.following = action.payload;
    },
    setFollowers: (state, action) => {
      state.followers = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
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
          (id) => id !== action.payload
        );
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFollowing, setFollowers } = friendSlice.actions;
export default friendSlice.reducer;
