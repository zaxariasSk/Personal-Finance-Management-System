import {createAsyncThunk, createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: undefined,
        loading: false,
        error: undefined,
    },
    reducers: {
        logout(state) {
            state.user = undefined;
            state.loading = false;
            state.error = undefined;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUserData.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserData.fulfilled, (state, action) => {
                state.user = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserData.rejected, (state, action) => {
                state.loading = false;
                state.user = null;
                state.error = action.payload || 'Failed to fetch user data';
            });
    },
});

export const fetchUserData = createAsyncThunk('fetchUserData', async (_, thunkAPI) => {
    try {
        const response = await fetch('http://localhost:3000/auth/verifyToken', {
            credentials: 'include', // Ensure cookies are sent with the request
        });

        if (!response.ok) {
            return thunkAPI.rejectWithValue('Failed to fetch user data');
        }

        return await response.json();
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message);
    }
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;