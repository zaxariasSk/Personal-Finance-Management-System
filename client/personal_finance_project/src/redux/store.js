import {configureStore} from "@reduxjs/toolkit";
import {authReducer} from "./slices/authSlice";
import {errorReducer} from "./slices/errorSlice";

const store = configureStore({
    reducer: {
        auth: authReducer,
        error: errorReducer
    },
});

export default store;