import {createSlice,PayloadAction} from '@reduxjs/toolkit';
import { AppMode } from '../../components/types';

const modeSlice = createSlice({
    name:"mode",
    initialState: "wholesale" as AppMode,
    reducers:{
        setMode: (state,action:PayloadAction<AppMode>) => action.payload,
    }
});

export const { setMode } = modeSlice.actions;
export default modeSlice.reducer;