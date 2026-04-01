import { createSlice } from '@reduxjs/toolkit';

const userInfoFromStorage = localStorage.getItem('userInfo')
  ? JSON.parse(localStorage.getItem('userInfo'))
  : null;

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    userInfo: userInfoFromStorage,
    loading: false,
    error: null,
  },
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      state.error = null;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      localStorage.removeItem('userInfo');
    },
    setError: (state, action) => {
      state.error = action.payload;
    }
  },
});

export const { setCredentials, logout, setError } = authSlice.actions;
export default authSlice.reducer;