import { StateCreator } from "zustand";
import { SectionSlice, FormState } from "../form.types";

export const createSectionSlice: StateCreator<
  FormState,
  [["zustand/immer", never]],
  [],
  SectionSlice
> = (set) => ({
  addSection: (section) =>
    set((state) => {
      state.form.sections[section.id] = section;
    }),
  updateSection: (id, partial) =>
    set((state) => {
      const section = state.form.sections[id];
      if (!section) return state;
      state.form.sections[id] = { ...section, ...partial };
    }),

  reorderFields: (sectionId, newOrder) =>
    set((state) => {
      const section = state.form.sections[sectionId];
      if (section) section.fieldOrder = newOrder;
    }),
});
