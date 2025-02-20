import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Cookie-dən token oxumaq üçün funksiya
const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

const baseURL = "http://localhost:5000/api/users"; // İstifadəçi məlumatlarını idarə etmək üçün backend URL

const initialState = {
  user: null,
  users: [], // Admin panelində istifadəçilərin siyahısını tutacaq
  token: getCookie("token") || null, 
  loading: false,
  error: null,
};

export const getUsers = createAsyncThunk("user/getUsers", async (_, { getState, rejectWithValue }) => {
  try {
    // Axios sorğusunda withCredentials parametrini true edirik
    const { data } = await axios.get(baseURL, {
      withCredentials: true,  // Cookie-ləri backend-ə göndərmək üçün
    });
    return data;
  } catch (error) {
    // Xəta olarsa, konsolda log veririk
    return rejectWithValue(error.response.data);
  
  
  }
});





export const addUser = createAsyncThunk(
  "user/addUser",
  async (user) => {
    const { data } = await axios.post(baseURL, user);
    return data;
  }
);

export const deleteUser = createAsyncThunk(
  "user/deleteUser",
  async (id) => {
    await axios.delete(`${baseURL}/${id}`, {
      withCredentials: true,
    });
    return id;
  }
);

export const searchUser = createAsyncThunk(
  "user/searchUser",
  async (search, { getState }) => {
    if (search === "") {
      return getState().users.users; 
    }
    const { data } = await axios.get(`${baseURL}/search/${search}`);
    return data;
  }
);

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

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("http://localhost:5000/auth/me", {
        withCredentials: true,
        
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message || "Error fetching user");
    }
  }
);
export const setAdmin = createAsyncThunk(
  "user/setAdmin",
  async (userId, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`http://localhost:5000/api/users/${userId}/role`);
      return { userId, updatedUser: data.user };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const banUser = createAsyncThunk(
  "users/banUser",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/users/${id}/ban`, {
        
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);


const userSlice = createSlice({
  name: "user",
  initialState,
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
        state.user = action.payload.existUser || {}; 
        state.token = action.payload.token;
        document.cookie = `token=${action.payload.token}; path=/`; 
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.user = action.payload; 
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.user = null;
      })
      .addCase(getUsers.fulfilled, (state, action) => {
        state.users = action.payload; 
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.users.push(action.payload); 
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((item) => item._id !== action.payload); 
      })
      .addCase(setAdmin.fulfilled, (state, action) => {
        state.loading = false;
        const { userId, updatedUser } = action.payload;

        if (state.users.users) {
          const index = state.users.users.findIndex((user) => user._id === userId);
          if (index !== -1) {
            state.users.users[index] = updatedUser;
          }
        }
      })
      .addCase(banUser.fulfilled, (state, action) => {
        const index = state.users.findIndex((user) => user._id === action.payload._id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
      })
      .addCase(searchUser.fulfilled, (state, action) => {
        state.users = action.payload; 
      });
  },
});

export const { setUser, logoutUser } = userSlice.actions;

export default userSlice.reducer;
