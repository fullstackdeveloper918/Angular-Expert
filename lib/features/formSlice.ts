"use client";
import { createSlice } from "@reduxjs/toolkit";

const loadInitialState = () => {
  if (typeof window !== "undefined") {
    const savedData = localStorage.getItem("formData");
    return savedData ? JSON.parse(savedData) : {};
  }
  return {};
};
const initialState = loadInitialState();

// Create the form slice
const formSlice = createSlice({
  name: "form",
  initialState,
  reducers: {
    autoSaveForm: (state, action) => {
      const updatedState = { ...state, ...action.payload };
      // Save to localStorage
      // localStorage.setItem("formData", JSON.stringify(updatedState));
      return updatedState;
    },
    clearFormData: () => {
      // Clear localStorage (client-side only)
      if (typeof window !== "undefined") {
        localStorage.removeItem("formData");
      }
      return {};
    },
    clearSpecificFormData: (state, action) => {
      const fieldsToClear = action.payload; // Array of keys to clear
      const updatedState = { ...state };

      fieldsToClear.forEach((field: any) => {
        delete updatedState[field];
      });

      // Update localStorage with the cleaned data
      // localStorage.setItem("formData", JSON.stringify(updatedState));
      return updatedState;
    },
  },
});

export const { autoSaveForm, clearFormData, clearSpecificFormData } =
  formSlice.actions;
export default formSlice.reducer;
