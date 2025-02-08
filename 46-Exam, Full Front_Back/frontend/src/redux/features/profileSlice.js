import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Profil məlumatlarını yükləyin
export const fetchProfile = createAsyncThunk(
  "profile/fetchProfile",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/profile/${id}`, {
        withCredentials: true,  // Cookie-lərin göndərilməsi üçün
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Xəta baş verdi");
    }
  }
);

// Profil məlumatlarını yeniləyin
export const updateProfile = createAsyncThunk(
  "profile/updateProfile",
  async ({ id, user }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:5000/api/profile/${id}`, user, {
        withCredentials: true,  // Cookie-lərin göndərilməsi üçün
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Xəta baş verdi");
    }
  }
);

const profileSlice = createSlice({
  name: "profile",
  initialState: {
    user: null, // və ya {}, amma tətbiqdə ardıcıl olmasına diqqət edin
    loading: false,
    error: null,
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logoutUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Profil yükləmək
      .addCase(fetchProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Tam profil geri döndüyünü varsayırıq
      })
      .addCase(fetchProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Profil yeniləmək
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = { ...state.user, ...action.payload }; // Yenilənmiş məlumatları birləşdiririk
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setUser, logoutUser } = profileSlice.actions;
export default profileSlice.reducer;