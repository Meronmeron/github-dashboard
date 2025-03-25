import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingsState } from "@/types";

const initialState: SettingsState = {
  layout: "comfortable",
  githubUsername: "octocat",
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    setLayout: (state, action: PayloadAction<"compact" | "comfortable">) => {
      state.layout = action.payload;
    },
    setGithubUsername: (state, action: PayloadAction<string>) => {
      state.githubUsername = action.payload;
    },
  },
});

export const { setLayout, setGithubUsername } = settingsSlice.actions;
export default settingsSlice.reducer;
