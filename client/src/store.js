import { configureStore } from '@reduxjs/toolkit';
import setAlert from './service/reducers/AlertSlice'
import AuthSlice from './service/reducers/AuthSlice';

export const store = configureStore({
    reducer: {
      alert: setAlert,
      auth: AuthSlice
    }
  });