import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import subjectService from './subjectService';

const initialState = {
    subjects: [],
    isError: false,
    isSuccess: false,
    isLoading: false,
    message: '',
};

// Create new subject
export const createSubject = createAsyncThunk(
    'subjects/create',
    async (subjectData, thunkAPI) => {
        try {
            return await subjectService.createSubject(subjectData);
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

// Get user subjects
export const getSubjects = createAsyncThunk(
    'subjects/getAll',
    async (_, thunkAPI) => {
        try {
            return await subjectService.getSubjects();
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

// Delete subject
export const deleteSubject = createAsyncThunk(
    'subjects/delete',
    async (id, thunkAPI) => {
        try {
            await subjectService.deleteSubject(id);
            return id;
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

export const subjectSlice = createSlice({
    name: 'subject',
    initialState,
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
            .addCase(createSubject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.subjects.push(action.payload);
            })
            .addCase(createSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(getSubjects.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(getSubjects.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.subjects = action.payload;
            })
            .addCase(getSubjects.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            })
            .addCase(deleteSubject.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteSubject.fulfilled, (state, action) => {
                state.isLoading = false;
                state.isSuccess = true;
                state.subjects = state.subjects.filter(
                    (subject) => subject._id !== action.payload
                );
            })
            .addCase(deleteSubject.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload;
            });
    },
});

export const { reset } = subjectSlice.actions;
export default subjectSlice.reducer;
