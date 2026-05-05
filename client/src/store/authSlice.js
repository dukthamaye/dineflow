import { createSlice } from '@reduxjs/toolkit';

const safeParseUser = () => {
  try { return JSON.parse(localStorage.getItem('user')); }
  catch { return null; }
};

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user:  safeParseUser(),
    token: localStorage.getItem('token') || null
  },
  reducers: {
    setCredentials: (state, { payload }) => {
      state.user  = payload.user;
      state.token = payload.token;
      localStorage.setItem('token', payload.token);
      localStorage.setItem('user', JSON.stringify(payload.user));
    },
    logout: state => {
      state.user  = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }
});

export const { setCredentials, logout } = authSlice.actions;
export const selectCurrentUser  = state => state.auth.user;
export const selectIsAuth       = state => !!state.auth.token;
export default authSlice.reducer;