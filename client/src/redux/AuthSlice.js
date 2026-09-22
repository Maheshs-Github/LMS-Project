import { createSlice } from "@reduxjs/toolkit";

const AuthSlice=createSlice({
  name:"auth",
  initialState:{
    user:null,
  },
  reducers:{
    setUser:(state,action)=>{
      state.user=action.payload;
    },
    logout:(state)=>{
      state.user=null;
    }
  }
})

export const {setUser,logout}=AuthSlice.actions;
export default AuthSlice.reducer;