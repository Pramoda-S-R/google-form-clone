import type { CSSProperties, HTMLInputTypeAttribute } from "react";

// ========== VALIDATIONS ==========
export type Validation = {
  object: "length" | "regex" | "text" | "number";
  constraint: string;
  errorText: string;
};

export type LongAnswerValidation = Validation & {
  object: "text" | "number";
};

// ========== FORMFIELDS ==========
export type FormShortAnswer = {
  type: "short_answer";
  inputType?: HTMLInputTypeAttribute;
  validation?: Validation;
};

export type FromLongAnswer = {
  type: "long_answer";
  validation?: LongAnswerValidation;
};

export type FormMultipleChoice = {
  type: "multiple_choice";
  options?: UserInputOption[];
  other?: boolean;
  shuffle?: boolean;
};

export type FormCheckbox = {
  type: "checkbox";
  options?: UserInputOption[];
  shuffle?: boolean;
};

export type FormDropdown = {
  type: "dropdown";
  options?: Option[];
  shuffle?: boolean;
};

export type FormLinearScale = {
  type: "linear_scale";
  high?: string;
  low?: string;
  start?: 1 | 0;
  count?: number;
};

export type FormRating = {
  type: "rating";
  icon?: "star" | "heart" | "like";
  stroke?: CSSProperties["color"];
  fill?: CSSProperties["color"];
  count?: number;
};

export type FormMultipleChoiceGrid = {
  type: "multiple_choice_grid";
  table?: GridBaseObject;
  shuffle?: boolean;
  limitToOnePerColumn?: boolean;
};

export type FormCheckboxGrid = {
  type: "checkbox_grid";
  table?: GridBaseObject;
  shuffle?: boolean;
  limitToOnePerColumn?: boolean;
};

export type FormDate = {
  type: "date";
  includeTime?: boolean;
};

export type FormTime = {
  type: "time";
  kind: "time" | "duration";
};

export type FormFileUpload = {
  type: "file_upload";
  acceptedFileTypes?: string[];
  maxFileSize?: number; // in bytes
};

// ========= FORM TYPES ==========
export type OptionFields = "multiple_choice" | "checkbox" | "dropdown";
export type TableOptionFields = "multiple_choice_grid" | "checkbox_grid";

export type Option = {
  id: string;
  label: string;
};

export type UserInputOption = Option & { other?: boolean };

export type GridBaseObject = {
  rows: Option[];
  columns: Option[];
};

// ========== FORM ==========
export type FormHeader = {
  title: string;
  description?: string;
};

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

export type FormField = {
  id: string;
  title?: string;
  description?: string;
  required?: boolean;
  imageUrl?: string;
  config: FormConfig;
  answer?: FormAnswer;
};

export type Section = {
  id: string;
  title: string;
  fieldOrder: string[];
};

export type FormObj = {
  id: string;
  header: FormHeader;
  sections: Record<string, Section>;
  fields: Record<string, FormField>;
};
