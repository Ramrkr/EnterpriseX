import { configureStore } from "@reduxjs/toolkit";
import modeReducer from './slices/modeSlice';
import traderReducer from './slices/traderSlice';
import customerReducer from './slices/customerSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';

export const store = configureStore({
    reducer:{
        mode:modeReducer,
        trader:traderReducer,
        customer:customerReducer,
        cart:cartReducer,
        order:orderReducer
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

