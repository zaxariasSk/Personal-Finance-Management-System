import {createSlice} from "@reduxjs/toolkit";

const errorSlice = createSlice({
    name: 'error',
    initialState: {
        message: undefined,
        hasError: false
    },
    reducers: {
        setError(state, action) {
            state.message = action.payload;
            state.hasError = true
        },
        clearError (state) {
            state.message = undefined;
            state.hasError = false;
        }
    }
});


export const errorActions = errorSlice.actions;
export const errorReducer = errorSlice.reducer;