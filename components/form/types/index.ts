import { CSSProperties, HTMLInputTypeAttribute } from "react";

// ========== VALIDATIONS ==========
export interface Validation {
  object: "length" | "regex" | "text" | "number";
  constraint: string;
  errorText: string;
}

export interface LongAnswerValidation extends Validation {
  object: "text" | "number";
}

// ========== FORMFIELDS ==========
export interface FormShortAnswer {
  type: "short_answer";
  inputType?: HTMLInputTypeAttribute;
  validation?: Validation;
}

export interface FromLongAnswer {
  type: "long_answer";
  validation?: LongAnswerValidation;
}

export interface FormMultipleChoice {
  type: "multiple_choice";
  options?: UserInputOption[];
  other?: boolean;
  shuffle?: boolean;
}

export interface FormCheckbox {
  type: "checkbox";
  options?: UserInputOption[];
  shuffle?: boolean;
}

export interface FormDropdown {
  type: "dropdown";
  options?: Option[];
  shuffle?: boolean;
}

export interface FormLinearScale {
  type: "linear_scale";
  high?: string;
  low?: string;
  start?: 1 | 0;
  count?: number;
}

export interface FormRating {
  type: "rating";
  icon?: "star" | "heart" | "like";
  stroke?: CSSProperties["color"];
  fill?: CSSProperties["color"];
  count?: number;
}

export interface FormMultipleChoiceGrid {
  type: "multiple_choice_grid";
  table?: GridBaseObject;
  shuffle?: boolean;
  limitToOnePerColumn?: boolean;
}

export interface FormCheckboxGrid {
  type: "checkbox_grid";
  table?: GridBaseObject;
  shuffle?: boolean;
  limitToOnePerColumn?: boolean;
}

export interface FormDate {
  type: "date";
  includeTime?: boolean;
}

export interface FormTime {
  type: "time";
  kind: "time" | "duration";
}

export interface FormFileUpload {
  type: "file_upload";
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
}

// ========= FORM TYPES ==========
export type OptionFields = "multiple_choice" | "checkbox" | "dropdown";
export type TableOptionFields = "multiple_choice_grid" | "checkbox_grid";

export type Option = {
  id: string;
  label: string;
};

export type UserInputOption = Option & { other?: boolean };

export interface GridBaseObject {
  rows: Option[];
  columns: Option[];
}

// ========== FORM ==========
export interface FormHeader {
  title: string;
  description?: string;
}

export type FormConfig =
  | FormShortAnswer
  | FromLongAnswer
  | FormMultipleChoice
  | FormCheckbox
  | FormDropdown
  | FormLinearScale
  | FormRating
  | FormMultipleChoiceGrid
  | FormCheckboxGrid
  | FormDate
  | FormTime
  | FormFileUpload;

export type FormFieldTypes = FormConfig["type"];

export type OptionAnswer = Record<string, boolean>;

export type FormAnswer = string | OptionAnswer;

export interface FormField {
  id: string;
  title?: string;
  description?: string;
  required?: boolean;
  imageUrl?: string;
  config: FormConfig;
  answer?: FormAnswer;
}

export type Section = {
  id: string;
  title: string;
  fieldOrder: string[];
};

export interface FormObj {
  id: string;
  header: FormHeader;
  sections: Record<string, Section>;
  fields: Record<string, FormField>;
}
