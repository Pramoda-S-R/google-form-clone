import {
  FormPreviewCheckboxes,
  FormPreviewCheckboxGrid,
  FormPreviewDate,
  FormPreviewDropdown,
  FormPreviewFileUpload,
  FormPreviewLongAnswer,
  FormPreviewMultiChoiceGrid,
  FormPreviewMultipleChoice,
  FormPreviewShortAnswer,
  FormPreviewTime,
  FormPreviewTitle,
  FromPreviewLinearScale,
  FromPreviewRating,
} from "@/components/form/FormPreviewComponents";
import { formData } from "@/constants";
import { FormObj } from "@/types";
import React from "react";

const FormLoader = () => {
  return (
    <div className="w-full h-dvh overflow-y-auto bg-base-300">
      <div className="max-w-3xl mx-auto flex flex-col gap-2 py-2">
        <FormPreviewTitle
          title={formData.header.title}
          description={formData.header.description}
        />
        {formData.fields.map((field, index) => {
          switch (field.config.type) {
            case "short_answer":
              return (
                <FormPreviewShortAnswer
                  type={field.config.inputType ?? "text"}
                  key={index}
                  question={field.title}
                  description={field.description}
                />
              );
            case "long_answer":
              return (
                <FormPreviewLongAnswer
                  key={index}
                  question={field.title}
                  description={field.description}
                />
              );
            case "multiple_choice":
              return (
                <FormPreviewMultipleChoice
                  key={index}
                  formQuestionId={index.toString()}
                  question={field.title}
                  description={field.description}
                  options={field.config.options ?? []}
                />
              );
            case "checkbox":
              return (
                <FormPreviewCheckboxes
                  key={index}
                  question={field.title}
                  description={field.description}
                  options={field.config.options ?? []}
                />
              );
            case "dropdown":
              return (
                <FormPreviewDropdown
                  key={index}
                  question={field.title}
                  description={field.description}
                  options={field.config.options ?? []}
                />
              );
            case "linear_scale":
              return (
                <FromPreviewLinearScale
                  key={index}
                  question={field.title}
                  description={field.description}
                  formQuestionId={index.toString()}
                  high={field.config.high}
                  low={field.config.low}
                  start={field.config.start}
                  count={field.config.count ?? 5}
                />
              );
            case "rating":
              return (
                <FromPreviewRating
                  key={index}
                  question={field.title}
                  description={field.description}
                  icon={field.config.icon ?? "star"}
                  stroke={field.config.stroke}
                  fill={field.config.fill}
                  count={field.config.count ?? 5}
                />
              );
            case "multiple_choice_grid":
              return (
                <FormPreviewMultiChoiceGrid
                  key={index}
                  question={field.title}
                  description={field.description}
                  table={field.config.table ?? { rows: [], columns: [] }}
                />
              );
            case "checkbox_grid":
              return (
                <FormPreviewCheckboxGrid
                  key={index}
                  question={field.title}
                  description={field.description}
                  table={field.config.table ?? { rows: [], columns: [] }}
                />
              );
            case "date":
              return (
                <FormPreviewDate
                  key={index}
                  question={field.title}
                  description={field.description}
                  includeTime={field.config.includeTime}
                />
              );
            case "time":
              return (
                <FormPreviewTime
                  key={index}
                  question={field.title}
                  description={field.description}
                  kind={field.config.kind}
                />
              );
            case "file_upload":
              return (
                <FormPreviewFileUpload
                  key={index}
                  question={field.title}
                  description={field.description}
                />
              );
          }
        })}
      </div>
    </div>
  );
};

export default FormLoader;
