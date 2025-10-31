import { StateCreator } from "zustand";
import {
  Option,
  FormField,
  UserInputOption,
  FormConfig,
  OptionFields,
  TableOptionFields,
} from "../types";
import { generateId } from "@/utils";
import { shallow } from "zustand/shallow";

export interface FormFieldsSlice {
  fields: FormField[];
  getField: (id: string) => FormField | undefined;
  setFields: (fields: FormField[]) => void;
  addField: () => void;
  insertField: (index: number, field: Omit<FormField, "id">) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;
  removeField: (id: string) => void;
  resetFields: () => void;
  getOption: (
    fieldId: string,
    optionId: string
  ) => Option | UserInputOption | undefined;
  setOptions: (fieldId: string, options: Option[] | UserInputOption[]) => void;
  addOption: (
    fieldId: string,
    option: Omit<UserInputOption, "id"> | Omit<Option, "id">
  ) => void;
  updateOption: (
    fieldId: string,
    optionId: string,
    updates: Partial<Option> | Partial<UserInputOption>
  ) => void;
  removeOption: (fieldId: string, optionId: string) => void;
  addRow: (fieldId: string, option: Omit<Option, "id">) => void;
  addColumn: (fieldId: string, option: Omit<Option, "id">) => void;
  updateRow: (fieldId: string, rowId: string, updates: Partial<Option>) => void;
  updateColumn: (
    fieldId: string,
    columnId: string,
    updates: Partial<Option>
  ) => void;
  removeRow: (fieldId: string, rowId: string) => void;
  removeColumn: (fieldId: string, columnId: string) => void;
}

function isOptionFieldConfig(
  config: FormConfig
): config is Extract<FormConfig, { type: OptionFields }> {
  return ["multiple_choice", "checkbox", "dropdown"].includes(config.type);
}

function isTableOptionFieldConfig(
  config: FormConfig
): config is Extract<FormConfig, { type: TableOptionFields }> {
  return ["multiple_choice_grid", "checkbox_grid"].includes(config.type);
}

function updateOptionField(
  state: FormFieldsSlice,
  fieldId: string,
  updater: (
    options: Option[] | UserInputOption[]
  ) => Option[] | UserInputOption[]
) {
  return state.fields.map((f) => {
    if (f.id !== fieldId || !isOptionFieldConfig(f.config)) return f;

    return {
      ...f,
      config: {
        ...f.config,
        options: updater(f.config.options ?? []),
      },
    };
  });
}

function updateTableOptionField(
  state: FormFieldsSlice,
  fieldId: string,
  update: "rows" | "columns",
  updater: (options: Option[]) => Option[]
) {
  const isUpdatingRows = update === "rows";

  return state.fields.map((f) => {
    if (f.id !== fieldId || !isTableOptionFieldConfig(f.config)) return f;

    const table = f.config.table ?? { rows: [], columns: [] };

    return {
      ...f,
      config: {
        ...f.config,
        table: {
          ...table,
          rows: isUpdatingRows ? updater(table.rows) : table.rows,
          columns: isUpdatingRows ? table.columns : updater(table.columns),
        },
      },
    };
  });
}

export const createFormFieldsSlice: StateCreator<FormFieldsSlice> = (
  set,
  get
) => ({
  fields: [], // initial data
  getField: (id) => get().fields.find((f) => f.id === id, shallow),
  setFields: (fields) => set({ fields }),
  addField: () =>
    set((state) => ({
      fields: [
        ...state.fields,
        {
          config: {
            type: "short_answer",
          },
          id: generateId(),
        },
      ],
    })),
  insertField: (index, field) =>
    set((state) => {
      const newFieldId = generateId();

      // If the field has options, assign new IDs to those as well
      const newConfig = isOptionFieldConfig(field.config)
        ? {
            ...field.config,
            options: (field.config.options ?? []).map((opt) => ({
              ...opt,
              id: generateId(),
            })),
          }
        : field.config;

      const newField = {
        ...field,
        id: newFieldId,
        config: newConfig,
      };

      const newFields = [...state.fields];
      newFields.splice(index, 0, newField);

      return { fields: newFields };
    }),
  updateField: (id, updates) =>
    set((state) => ({
      fields: state.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),
  removeField: (id) =>
    set((state) => ({
      fields: state.fields.filter((f) => f.id !== id),
    })),
  getOption: (fieldId, optionId) => {
    const field = get().fields.find((f) => f.id === fieldId);
    if (!field) return undefined;
    if (!isOptionFieldConfig(field.config)) return undefined;

    return field.config.options?.find((o) => o.id === optionId);
  },
  addOption: (fieldId, option) =>
    set((state) => ({
      fields: updateOptionField(state, fieldId, (opts) => [
        ...opts,
        { id: generateId(), ...option },
      ]),
    })),

  updateOption: (fieldId, optionId, updates) =>
    set((state) => ({
      fields: updateOptionField(state, fieldId, (opts) =>
        opts.map((o) => (o.id === optionId ? { ...o, ...updates } : o))
      ),
    })),

  removeOption: (fieldId, optionId) =>
    set((state) => ({
      fields: updateOptionField(state, fieldId, (opts) =>
        opts.filter((o) => o.id !== optionId)
      ),
    })),

  setOptions: (fieldId, options) =>
    set((state) => ({
      fields: updateOptionField(state, fieldId, () => options),
    })),
  resetFields: () => set({ fields: [] }),
  addRow: (fieldId, option) =>
    set((state) => ({
      fields: updateTableOptionField(state, fieldId, "rows", (rows) => [
        ...rows,
        { id: generateId(), ...option },
      ]),
    })),
  addColumn: (fieldId, option) =>
    set((state) => ({
      fields: updateTableOptionField(state, fieldId, "columns", (columns) => [
        ...columns,
        { id: generateId(), ...option },
      ]),
    })),
  updateRow: (fieldId, rowId, option) =>
    set((state) => ({
      fields: updateTableOptionField(state, fieldId, "rows", (rows) =>
        rows.map((r) => (r.id === rowId ? { ...r, ...option } : r))
      ),
    })),
  updateColumn: (fieldId, columnId, option) =>
    set((state) => ({
      fields: updateTableOptionField(state, fieldId, "columns", (columns) =>
        columns.map((c) => (c.id === columnId ? { ...c, ...option } : c))
      ),
    })),
  removeRow: (fieldId, rowId) =>
    set((state) => ({
      fields: updateTableOptionField(state, fieldId, "rows", (rows) =>
        rows.filter((r) => r.id !== rowId)
      ),
    })),
  removeColumn: (fieldId, columnIndex) =>
    set((state) => ({
      fields: updateTableOptionField(state, fieldId, "columns", (columns) =>
        columns.filter((c) => c.id !== columnIndex)
      ),
    })),
});
