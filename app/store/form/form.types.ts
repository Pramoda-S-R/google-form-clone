// store/form/form.types.ts
import { FormField, FormObj, Section } from "@/components/form/types";

export type FormSlice = {
  form: FormObj;
  setForm: (form: FormObj) => void;
};

export type FieldSlice = {
  updateField: (id: string, partial: Partial<FormField>) => void;
  addField: (sectionId: string, field: FormField) => void;
  removeField: (fieldId: string) => void;
};

export type SectionSlice = {
  addSection: (section: Section) => void;
  updateSection: (id: string, partial: Partial<Section>) => void;
  reorderFields: (sectionId: string, newOrder: string[]) => void;
};

export type FormState = FormSlice & FieldSlice & SectionSlice;
