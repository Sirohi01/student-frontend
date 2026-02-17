import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import subjectReducer from '../features/subjects/subjectSlice';
import taskReducer from '../features/tasks/taskSlice';
import sessionReducer from '../features/studySessions/sessionSlice';
import flashcardReducer from '../features/flashcards/flashcardSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        subjects: subjectReducer,
        tasks: taskReducer,
        sessions: sessionReducer,
        flashcards: flashcardReducer,
    },
});
