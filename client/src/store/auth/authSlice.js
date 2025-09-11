import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import http from '../../api/http';

export const login = createAsyncThunk('auth/login', async ({ email, password, remember }, { rejectWithValue }) => {
  try {
    const { data } = await http.post('/auth/login', { email, password, remember: !!remember });
    return data.user || null;
  } catch (err) {
    const msg = err.response?.data?.message || 'Login failed';
    return rejectWithValue(msg);
  }
});

export const logout = createAsyncThunk('auth/logout', async () => {
  await http.post('/auth/logout');
  return null;
});

export const fetchMe = createAsyncThunk('auth/me', async () => {
  const { data } = await http.get('/auth/me');
  return data.user || null;
});

export const refresh = createAsyncThunk('auth/refresh', async (_, { rejectWithValue }) => {
  try {
    const { data } = await http.post('/auth/refresh');
    return data.user || null;
  } catch (err) {
    return rejectWithValue('Refresh failed');
  }
});

const initialState = {
  user: null,
  loading: false,
  error: null,
  initialized: false,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
        state.initialized = true;
      })

      .addCase(logout.fulfilled, (state) => {
        state.user = null;
      })

      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(fetchMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.initialized = true;
      })

      .addCase(refresh.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initialized = true;
      })
      .addCase(refresh.rejected, (state) => {
        state.initialized = true;
        state.user = null;
      });
  },
});

export default authSlice.reducer;
