import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      console.log("Access Token:", token);
      const response = await axios.get("http://localhost:5000/api/posts", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const response = await axios.post("http://localhost:5000/api/posts", postData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);

export const createComment = createAsyncThunk(
  "posts/createComment",
  async ({ postId, commentData }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comments`, commentData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);

export const deleteComment = createAsyncThunk(
  "posts/deleteComment",
  async ({ postId, commentId }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      await axios.delete(`http://localhost:5000/api/posts/${postId}/comments/${commentId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return { postId, commentId };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);

export const fetchUserPosts = createAsyncThunk(
  "posts/fetchUserPosts",
  async (userId, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const response = await axios.get(`http://localhost:5000/api/posts/user/${userId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "An error occurred");
    }
  }
);


const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchUserPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload; 
      })
      .addCase(fetchUserPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        const postIndex = state.posts.findIndex(post => post._id === action.meta.arg.postId);
        if (postIndex !== -1) {
          state.posts[postIndex].comments.push(action.payload);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        const postIndex = state.posts.findIndex(post => post._id === action.payload.postId);
        if (postIndex !== -1) {
          state.posts[postIndex].comments = state.posts[postIndex].comments.filter(
            (comment) => comment._id !== action.payload.commentId
          );
        }
      });
  },
});

export default postSlice.reducer;