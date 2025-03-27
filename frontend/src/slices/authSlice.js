import axios from 'axios';
import { createSlice } from '@reduxjs/toolkit';
import { BASE_URL } from '../constants';

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
      const userId = state.userInfo?._id;

      if (!userId) return;

      const isFavorite = state.favorites.includes(buildingId);

      if (isFavorite) {
        state.favorites = state.favorites.filter((id) => id !== buildingId);
        axios
          .delete(`${BASE_URL}/users/${userId}/favorites/${buildingId}`, { withCredentials: true })
          .catch((error) => console.error('Error removing favorite:', error));
      } else {
        state.favorites.push(buildingId);
        axios
          .post(`${BASE_URL}/users/${userId}/favorites/${buildingId}`, {}, { withCredentials: true })
          .catch((error) => console.error('Error adding favorite:', error));
      }

      localStorage.setItem('favorites', JSON.stringify(state.favorites));
    },
  },
});

export const { setCredentials, logout, toggleFavorite } = authSlice.actions;
export default authSlice.reducer;
