import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sections: [],
  loading: false,
  error: null
};

const todoSectionSlice = createSlice({
  name: "todoSections",
  initialState,
  reducers: {
    setSections: (state, action) => {
      state.sections = action.payload;
    },

    addSection: (state, action) => {
      state.sections.push(action.payload);
    },

    updateSection: (state, action) => {
      const index = state.sections.findIndex(
        (section) => section._id === action.payload._id
      );

      if (index !== -1) {
        state.sections[index] = action.payload;
      }
    },

    removeSection: (state, action) => {
      state.sections = state.sections.filter(
        (section) => section._id !== action.payload
      );
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    }
  }
});

export const {
  setSections,
  addSection,
  updateSection,
  removeSection,
  setLoading,
  setError
} = todoSectionSlice.actions;

export default todoSectionSlice.reducer;