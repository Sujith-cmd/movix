import {combineReducers, configureStore, getDefaultMiddleware} from '@reduxjs/toolkit'
import homeReducer from './homeSlice.js'
import vendorReducer from './vendorSlice.js'
import userReducer from './userSlice.js'

import  {persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const rootReducer= combineReducers({home:homeReducer,vendor:vendorReducer,user:userReducer})
const persistConfig ={
    key: 'root',
    version:1,
    storage
}
const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
    //   thunk: {
    //     extraArgument: myCustomApiService,
    //   },
      serializableCheck: false,
    })
})


export const persistor = persistStore(store)