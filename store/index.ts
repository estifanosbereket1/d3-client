import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from "redux-persist";
import orgReducer from "./slices/organization.slice";
const rootReducer = combineReducers({
    organization: orgReducer,
});

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["organization"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],

            },
        }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const persistor = persistStore(store);


// import { NextResponse } from 'next/server'
// import type { NextRequest } from 'next/server'

// export default function authMiddleware(request: NextRequest) {
//     const sessionCookie = request.cookies.get('better-auth.session_token')
//     const { pathname } = request.nextUrl

//     // If no session, redirect to sign-in
//     if (!sessionCookie && pathname !== '/sign-in') {
//         return NextResponse.redirect(new URL('/sign-in', request.url))
//     }

//     // If session exists and user is trying to access sign-in, redirect to dashboard
//     if (sessionCookie && pathname === '/sign-in') {
//         return NextResponse.redirect(new URL('/dashboard', request.url))
//     }



//     // Otherwise, let the request pass
//     return NextResponse.next()
// }

// export const config = {
//     matcher: ['/dashboard/:path*', '/sign-in'], // apply to dashboard routes and sign-in
// }
