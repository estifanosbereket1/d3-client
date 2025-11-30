import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type OrgState = {
    id: string | null;
};

const initialState: OrgState = { id: null };

const orgSlice = createSlice({
    name: "organization",
    initialState,
    reducers: {
        setOrganizationId(state, action: PayloadAction<string>) {
            state.id = action.payload;
        },
        clearOrganizationId(state) {
            state.id = null;
        },
    },
});

export const { setOrganizationId, clearOrganizationId } = orgSlice.actions;
export default orgSlice.reducer;
