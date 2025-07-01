import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    accessToken: '',
    refreshToken: ''
};

const tokenSlice = createSlice({
    name: 'token',
    initialState,
    reducers: {
        login: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.refreshToken = action.payload.refreshToken;
        },
        logout: (state) => {
            state.accessToken = "";
            state.refreshToken = "";
        }
    }

});

export const {login, logout} = tokenSlice.actions;

export default tokenSlice.reducer;