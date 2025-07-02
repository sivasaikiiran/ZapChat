import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    userInfo: null,
    isAuthenticated : false
}

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.userInfo = action.payload;
            state.isAuthenticated = true;
        },
        logout: (state, action) => {
            state.userInfo = null;
            state.isAuthenticated = false;
        }
    }

})

const { login, logout } = userSlice.actions;

export { login, logout };
export default userSlice.reducer;