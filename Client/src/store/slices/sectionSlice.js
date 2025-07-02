import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    section: 'contact'
}

const sectionSlice = createSlice({
    name: 'section',
    initialState,
    reducers: {
        setSection: (state, action) => {
            console.log("Prev slice : ", state.section)
            state.section = action.payload
            console.log('New Slice : ', state.section);
        }
    }
})

export default sectionSlice.reducer

export const { setSection } = sectionSlice.actions