import { combineReducers, configureStore } from "@reduxjs/toolkit"
import { persistStore, persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web
import userReducer from "./slices/userSlice.js"
import chatReducer from "./slices/chatSlice.js"
import sectionReducer from './slices/sectionSlice.js'

const persistConfig = {
    key: 'root',
    version: 1,
    storage
}

const rootReducer = combineReducers({
    user: userReducer,
    chat: chatReducer,
    section : sectionReducer
})

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
    reducer: persistedReducer,
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

const persistor = persistStore(store)


export { store, persistor };