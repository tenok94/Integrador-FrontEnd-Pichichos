import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  theme: "light",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === "light" ? "dark" : "light";
    },
  },
});

export const { setUser, toggleTheme } = userSlice.actions;
export default userSlice.reducer;
