// store/form/selectors.ts
import { useFormStore } from "./useFormStore";

export const useField = (id: string) =>
  useFormStore((state) => state.form.fields[id]);

export const useSection = (id: string) =>
  useFormStore((state) => state.form.sections[id]);

export const useFormHeader = () =>
  useFormStore((state) => state.form.header);

export const useFormActions = () =>
  useFormStore((state) => ({
    updateField: state.updateField,
    addField: state.addField,
    removeField: state.removeField,
    updateSection: state.updateSection,
    reorderFields: state.reorderFields,
  }));
