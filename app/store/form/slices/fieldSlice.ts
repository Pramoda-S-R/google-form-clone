import { StateCreator } from "zustand";
import { FormState, FieldSlice } from "../form.types";
import { Section } from "@/components/form/types";

export const createFieldSlice: StateCreator<
  FormState,
  [["zustand/immer", never]],
  [],
  FieldSlice
> = (set) => ({
  updateField: (id, partial) =>
    set((state) => {
      const field = state.form.fields[id];
      if (!field) return;
      Object.assign(field, partial);
    }),

  addField: (sectionId, field) =>
    set((state) => {
      state.form.fields[field.id] = field;
      const section = state.form.sections[sectionId];
      if (section) section.fieldOrder.push(field.id);
    }),

  removeField: (fieldId) =>
    set((state) => {
      delete state.form.fields[fieldId];
      for (const section of Object.values(state.form.sections) as Section[]) {
        section.fieldOrder = section.fieldOrder.filter((id) => id !== fieldId);
      }
    }),
});
