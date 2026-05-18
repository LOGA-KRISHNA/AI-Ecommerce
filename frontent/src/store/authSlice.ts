import type { TAuthState } from "../types";
import {createSlice, type PayloadAction} from '@reduxjs/toolkit'
const initialState:TAuthState={
    token:localStorage.getItem('token'),
    isAuthenticated: !!localStorage.getItem('token'),
}

const authSlice=createSlice({
    name:'auth',
    initialState,
    reducers:{
        setToken:(state,action:PayloadAction<string>)=>{
            state.token=action.payload;
            state.isAuthenticated=true;
            localStorage.setItem('token',action.payload);
        },
        logout:(state)=>{
            state.token=null;
            state.isAuthenticated=false;
            localStorage.removeItem('token');
        }
    }
});

export const {setToken,logout} =authSlice.actions;
export default authSlice.reducer;