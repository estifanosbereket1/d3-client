import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage"; // localStorage
import { persistStore, persistReducer } from "redux-persist";
import orgReducer from "./slices/organization.slice";

const rootReducer = combineReducers({
    organization: orgReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["organization"],
}

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefault) => getDefault(),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);
