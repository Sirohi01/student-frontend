import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/v1/flashcards';

// Get due flashcards
export const createFlashcard = createAsyncThunk(
    'flashcards/create',
    async (cardData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(API_URL, cardData, config);
            return response.data;
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

export const getDueFlashcards = createAsyncThunk(
    'flashcards/getDue',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.get(`${API_URL}/due`, config);
            return response.data.data;
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

// Review flashcard
export const reviewFlashcard = createAsyncThunk(
    'flashcards/review',
    async ({ id, quality }, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };

            const response = await axios.post(`${API_URL}/${id}/review`, { quality }, config);
            return response.data.data;
        } catch (error) {
            // Error handling
            return thunkAPI.rejectWithValue(error.toString());
        }
    }
);

const flashcardSlice = createSlice({
    name: 'flashcards',
    initialState: {
        flashcards: [], // Due cards
        isLoading: false,
        isError: false,
        isSuccess: false,
        message: '',
    },
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isSuccess = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getDueFlashcards.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getDueFlashcards.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.flashcards = action.payload;
            })
            .addCase(getDueFlashcards.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(createFlashcard.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createFlashcard.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                // Optionally add to flashcards if it's due immediately, or just notify success
                // Usually created cards are due immediately (interval 0) so we can add them
                // But backend returns { data: card } shape.
                // For simplicity, let's just re-fetch or let user fetch due
                state.message = 'Flashcard created!';
            })
            .addCase(createFlashcard.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(reviewFlashcard.fulfilled, (state, action) => {
                // Remove reviewed card from list
                const reviewedId = action.meta.arg.id;
                state.flashcards = state.flashcards.filter(card => card._id !== reviewedId);
            });
    },
});

export const { reset } = flashcardSlice.actions;
export default flashcardSlice.reducer;
