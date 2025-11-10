import { StateCreator } from "zustand";
import { FormSlice, FormState } from "../form.types";
import { generateId, generateUUID } from "@/utils";
import { Section } from "@/components/form/types";
import { getDefaultSection } from "@/constants";

export const createFormSlice: StateCreator<FormState, [], [], FormSlice> = (
  set
) => ({
  form: {
    id: generateUUID(),
    header: { title: "Untitled Form" },
    description: "Form Description",
    sections: getDefaultSection(),
    fields: {},
  },
  setForm: (form) => set({ form }),
});
