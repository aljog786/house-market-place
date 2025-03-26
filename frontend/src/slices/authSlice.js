import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  userInfo: localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null,
  favorites: localStorage.getItem('favorites') ? JSON.parse(localStorage.getItem('favorites')) : [], 
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.userInfo = action.payload;
      localStorage.setItem('userInfo', JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.userInfo = null;
      state.favorites = [];
      localStorage.clear();
    },
    toggleFavorite: (state, action) => {
      const buildingId = action.payload;
      if (state.favorites.includes(buildingId)) {
        state.favorites = state.favorites.filter((id) => id !== buildingId);
      } else {
        state.favorites.push(buildingId);
      }
      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
  },
});

export const { setCredentials, logout, toggleFavorite } = authSlice.actions;
export default authSlice.reducer;
