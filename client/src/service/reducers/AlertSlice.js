import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  message: '',
  type: '', //error, //success
  url: ''
};

const setAlert = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.message = '';
      state.type = '';
    },
    setMessage: (state, action) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
      state.url = action.payload.url
    },
  },
});

export const { clearMessage, setMessage } = setAlert.actions;
export const getMessage = (state) => state.alert.message;
export const getType = (state) => state.alert.type;
export const getUrl = (state) => state.alert.url;

export default setAlert.reducer;
