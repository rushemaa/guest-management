import { configureStore } from '@reduxjs/toolkit';
import setAlert from './service/reducers/AlertSlice'

export const store = configureStore({
    reducer: {
      alert: setAlert,
    }
  });