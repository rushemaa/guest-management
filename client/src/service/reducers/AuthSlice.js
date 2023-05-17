import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../../utils/constants';
import { setAuthToken } from "../../utils/setAuthToken"

const initialState = {
    user: {},
    isAuthenticated: false,
    status: 'idle',
    error: null
}


export const login = createAsyncThunk(
    'api/login',
    async (account, { rejectWithValue, fulfillWithValue }) => {
        let response;
        try {
            response = await axios.post(BASE_URL + '/account/login', account);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data);
        }
    }
);

export const AuthSlice = createSlice({
    name: 'authentication',
    initialState,
    reducers: {
        logout: (state, action) => {
            state.status = 'idle';
            state.user = {};
            state.isAuthenticated = false;
            sessionStorage.removeItem(import.meta.env.REACT_APP_AUTH);
        },
    },
    extraReducers(builder) {
        builder
            .addCase(login.pending, (state, action) => {
                state.status = 'loggingIn...';
            })
            .addCase(login.fulfilled, (state, action) => {
                sessionStorage.setItem(
                    import.meta.env.REACT_APP_AUTH,
                    JSON.stringify({ user: {...action.payload}, isLoggedIn: true, token: action.payload.token  })
                );
                setAuthToken(action.payload.token)
                state.isAuthenticated = true;
                state.user = { ...action.payload };
                state.status = 'success';
            })
            .addCase(login.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload.message;
            });
    },
});

export const getUser = (state) => state.auth.user;
export const getAuthStatus = (state) => state.auth.isAuthenticated;
export const getAuthState = (state) => state.auth.status;
export const getAuthError = (state) => state.auth.error;
export const { logout } = AuthSlice.actions;

export default AuthSlice.reducer;