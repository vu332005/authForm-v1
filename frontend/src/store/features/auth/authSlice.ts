import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

import axiosClient from '../../../api/axiosClient';

// --- Types ---
interface User {
  username: string;
  // thêm các field khác nếu cần
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Mặc định true để chờ checkAuth
  error: null,
};

// --- Async Thunks (Thay thế các hàm trong Context) ---

// 1. Check Auth (Gọi khi app mới load)
export const checkAuth = createAsyncThunk('auth/checkAuth', async (_, { rejectWithValue }) => {
  try {
    const response = await axiosClient.get('/user/me');
    return response.data.user; // Trả về user object
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Unauthorized');
  }
});

// 2. Login
export const loginUser = createAsyncThunk('auth/login', async (formData: any, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post('/auth/login', formData);
    // Lưu token ngay tại đây
    localStorage.setItem('accessToken', response.data.accessToken);
    return response.data.user;
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Login failed');
  }
});

// 3. Register
export const registerUser = createAsyncThunk('auth/register', async (formData: any, { rejectWithValue }) => {
  try {
    const response = await axiosClient.post('/auth/register', formData);
    return response.data; // Register xong thường không tự login, tùy logic backend
  } catch (error: any) {
    return rejectWithValue(error.response?.data?.message || 'Register failed');
  }
});

// 4. Logout
export const logoutUser = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await axiosClient.post('/auth/logout');
    localStorage.removeItem('accessToken');
    return true;
  } catch (error: any) {
    return rejectWithValue('Logout failed');
  }
});

// --- Slice ---
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Các action đồng bộ (nếu cần) viết ở đây
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Check Auth
      .addCase(checkAuth.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuth.fulfilled, (state, action: PayloadAction<User>) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
      })

      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.isAuthenticated = true;
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;