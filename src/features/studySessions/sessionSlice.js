import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sessionService from './sessionService';

const initialState = {
    sessions: [],
    stats: [],
    currentSession: null,
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Log session
export const logSession = createAsyncThunk(
    'sessions/log',
    async (sessionData, thunkAPI) => {
        try {
            return await sessionService.logSession(sessionData);
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getSessions = createAsyncThunk(
    'sessions/getAll',
    async (_, thunkAPI) => {
        try {
            return await sessionService.getSessions();
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const getStats = createAsyncThunk(
    'sessions/getStats',
    async (_, thunkAPI) => {
        try {
            return await sessionService.getStats();
        } catch (error) {
            const message =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const sessionSlice = createSlice({
    name: 'session',
    initialState,
    reducers: {
        startSession: (state, action) => {
            // Logic to track current active session locally if needed
            state.currentSession = {
                startTime: new Date().toISOString(),
                ...action.payload,
            };
        },
        endSession: (state) => {
            state.currentSession = null;
        },
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(logSession.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(logSession.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.sessions.unshift(action.payload);
            })
            .addCase(logSession.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getSessions.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSessions.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.sessions = action.payload;
            })
            .addCase(getStats.fulfilled, (state, action) => {
                state.stats = action.payload;
            });
    },
});

export const { startSession, endSession, reset } = sessionSlice.actions;
export default sessionSlice.reducer;
