import { configureStore } from '@reduxjs/toolkit'
import personReducer from '../features/person/personSlice'

export default configureStore({
    reducer: {
        person: personReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});