import { StateCreator } from "zustand";
import { FormField } from "@/components/form/types";

export interface FormHeaderSlice {
  fields: Record<string, FormField>;
}

export const createFormHeaderSlice: StateCreator<FormHeaderSlice> = (set) => ({
  fields: {},
});
