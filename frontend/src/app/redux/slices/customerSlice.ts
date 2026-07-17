import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Customer } from "../../components/models";

export interface CustomerState{
    selectedCustomer : Customer | null;
    editingCustomer : Customer | null;
}

const initialState : CustomerState={
    selectedCustomer : null,
    editingCustomer : null
}

export const customerSlice = createSlice({
    name:'customer',
    initialState,
    reducers:{
        setSelectedCustomer : (state,action:PayloadAction<Customer|null>)=>{
            state.selectedCustomer = action.payload;
        },
        setEditingCustomer : (state,action:PayloadAction<Customer | null>)=>{
            state.editingCustomer = action.payload;
        }
    }

});

export const {setSelectedCustomer,setEditingCustomer} = customerSlice.actions;

export default customerSlice.reducer;