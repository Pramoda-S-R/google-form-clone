import { StateCreator } from "zustand";
import { FormHeader } from "@/components/form/types";

export interface FormHeaderSlice {
  header: FormHeader;
  setHeader: (data: FormHeader) => void;
  updateHeader: (data: Partial<FormHeader>) => void;
}

export const createFormHeaderSlice: StateCreator<FormHeaderSlice> = (set) => ({
  header: {
    title: "Untitled Form",
    description: "Form Description",
  },

  // Replace the entire header
  setHeader: (data) => set({ header: data }),

  // Merge updates into the existing header
  updateHeader: (data) =>
    set((state) => ({
      header: { ...state.header, ...data },
    })),
});
