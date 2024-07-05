import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./features/userSlice";


export const Store = configureStore({
    reducer: {
        user: userSlice
        
    }
})