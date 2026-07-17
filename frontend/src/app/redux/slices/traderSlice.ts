import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Trader } from "../../components/models";

export interface TraderState{
    traderId:string;
    selectedTrader : Trader | null;
    traders : Trader[];
}

const initialState : TraderState ={
    traderId :'',
    selectedTrader : null,
    traders : []
}

const traderSlice = createSlice({
    name:'trader',
    initialState,
    reducers:{
        setTraderId : (state,action:PayloadAction<string>)=>{
            state.traderId = action.payload;
        },
        setSelectedTrader : (state,action:PayloadAction<Trader | null>)=>{
            state.selectedTrader = action.payload;
        },
        setTraders: (state, action: PayloadAction<Trader[]>) => {
            state.traders = action.payload;
        },
        addTrader: (state, action: PayloadAction<Trader>) => {
            state.traders.push(action.payload);
        },
        updateTrader: (state, action: PayloadAction<Trader>) => {
            state.traders = state.traders.map(t =>
            t.id === action.payload.id ? action.payload : t);
        },
        removeTrader: (state, action: PayloadAction<string>) => {
            state.traders = state.traders.filter(t => t.id !== action.payload);
        },
    }
});

export const { setTraderId,setSelectedTrader,setTraders,addTrader,updateTrader,removeTrader} = traderSlice.actions;

export default traderSlice.reducer;