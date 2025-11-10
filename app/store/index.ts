import { create } from "zustand";
import { createFormHeaderSlice, FormHeaderSlice } from "./formHeaderSlice";
import { createFormFieldsSlice, FormFieldsSlice } from "./formFieldsSlice";

type FormStore = FormHeaderSlice & FormFieldsSlice;

export const useFormStore = create<FormStore>()((...a) => ({
  ...createFormHeaderSlice(...a),
  ...createFormFieldsSlice(...a),
}));

export type { FormStore };
export type FormStoreHook = typeof useFormStore;
