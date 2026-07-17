import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Order } from "../../components/models";

export interface OrderState{
    selectedOrder: Order | null;
    viewingOrder: Order | null;
    editingOrder: Order | null;
}

const initialState :OrderState ={
    selectedOrder : null,
    viewingOrder :null,
    editingOrder : null
}

export const orderSlice = createSlice({
    name:'order',
    initialState,
    reducers:{
        setSelectedOrder : (state,action:PayloadAction<Order|null>)=>{
            state.selectedOrder = action.payload;
        },
        setViewingOrder :(state,action:PayloadAction<Order|null>)=>{
            state.viewingOrder = action.payload;
        },
        setEditingOrder :(state,action:PayloadAction<Order|null>)=>{
            state.editingOrder = action.payload;
        },
    }
});

export const {setSelectedOrder,setViewingOrder,setEditingOrder} = orderSlice.actions;

export default orderSlice.reducer;