import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "../../components/models";

export interface CartState{
    items : CartItem[];
    customerId : string
}

const initialState :CartState ={
    items :[],
    customerId:''
}

export const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        setCart: (state,action:PayloadAction<CartItem[]>)=>{
            state.items = action.payload;
        },
        addItem : (state,action:PayloadAction<CartItem>)=>{
            state.items.push(action.payload);
        },
        removeItem :(state,action:PayloadAction<string>)=>{
            state.items = state.items.filter(item => item.product.id !== action.payload)
        },
        setCartCustomerId :(state,action:PayloadAction<string>)=>{
            state.customerId = action.payload;
        },
        clearCart : (state)=>{
            state.items=[];
            state.customerId='';
        }
    }
});

export const {setCart,addItem,removeItem,setCartCustomerId,clearCart} = cartSlice.actions;

export default cartSlice.reducer;