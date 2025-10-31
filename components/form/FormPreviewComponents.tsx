"use client";
import { CalendarDays, Heart, LucideIcon, Star, ThumbsUp } from "lucide-react";
import {
  CSSProperties,
  HTMLInputTypeAttribute,
  ReactNode,
  useState,
} from "react";
import { Option, GridBaseObject, UserInputOption } from "./types";

// TSX

export function FormPreviewTitle({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="bg-primary pt-2 rounded-md">
      <div className="bg-base-100 min-h-32 p-5">
        <h2 className="text-5xl pb-5">{title}</h2>
        <p>{description}</p>
      </div>
    </div>
  );
}

export function FormPreviewBase({
  question,
  description,
  required = true,
  children,
}: {
  question?: string;
  description?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="bg-base-100 px-5 py-7">
      <p className="text-lg">
        {question} {required && <span className="text-error">*</span>}
      </p>
      <p className="text-sm mb-6">{description}</p>
      {children}
    </div>
  );
}

export function FormPreviewShortAnswer({
  question,
  description,
}: {
  question?: string;
  description?: string;
  type: HTMLInputTypeAttribute;
}) {
  return (
    <FormPreviewBase question={question} description={description}>
      <label className="fieldset-label input focus:outline-none focus-within:outline-none"></label>
    </FormPreviewBase>
  );
}

export function FormPreviewLongAnswer({
  question,
  description,
  required,
}: {
  question?: string;
  description?: string;
  required?: boolean;
}) {
  return (
    <FormPreviewBase question={question} description={description}>
      <label className="relative fieldset-label textarea min-h-13 pb-5 w-full focus:outline-none focus-within:outline-none">
        <p className="text-xs absolute right-1 bottom-1 text-base-content/30">
          /100
        </p>
      </label>
    </FormPreviewBase>
  );
}

function MultipleChoiceOptions({
  option,
  formQuestionId,
}: {
  option: string;
  formQuestionId: string;
}) {
  return (
    <label className="flex gap-2">
      <div className="radio cursor-auto" />
      {option}
    </label>
  );
}

function MultipleChoiceInput({ formQuestionId }: { formQuestionId: string }) {
  return (
    <label className="flex gap-2 ">
      <div className="radio cursor-auto" />
      <div className="focus-within:outline-none focus:outline-none border-b w-40">
        <span className="text-base-content/50">Other:</span>
      </div>
    </label>
  );
}

export function FormPreviewMultipleChoice({
  question,
  description,
  options,
  formQuestionId,
}: {
  question?: string;
  description?: string;
  options: UserInputOption[];
  formQuestionId: string;
}) {
  return (
    <FormPreviewBase question={question} description={description}>
      <div className="flex flex-col gap-5">
        {options.map((option, index) => (
          <div key={index}>
            {option.other ? (
              <MultipleChoiceInput formQuestionId={formQuestionId} />
            ) : (
              <MultipleChoiceOptions
                option={option.label}
                formQuestionId={formQuestionId}
              />
            )}
          </div>
        ))}
      </div>
    </FormPreviewBase>
  );
}

function CheckboxOptions({ option }: { option: string }) {
  return (
    <label className="label text-base-content ">
      <div className="checkbox cursor-auto" />
      {option}
    </label>
  );
}

function CheckboxInput() {
  const [input, setInput] = useState("");
  return (
    <label className="flex gap-2">
      <div className="checkbox cursor-auto" />
      <div className="focus-within:outline-none focus:outline-none border-b w-40">
        <span className="text-base-content/50">Other:</span>
      </div>
    </label>
  );
}

export function FormPreviewCheckboxes({
  question,
  description,
  options,
}: {
  question?: string;
  description?: string;
  options: UserInputOption[];
}) {
  return (
    <FormPreviewBase question={question} description={description}>
      <div className="flex flex-col gap-5">
        {options.map((option, index) => (
          <div key={index}>
            {option.other ? (
              <CheckboxInput />
            ) : (
              <CheckboxOptions option={option.label} />
            )}
          </div>
        ))}
      </div>
    </FormPreviewBase>
  );
}

export function FormPreviewDropdown({
  question,
  description,
  options,
}: {
  question?: string;
  description?: string;
  options: Option[];
}) {
  const [selectedValue, setSelectedValue] = useState<string>("e76aay8");
  return (
    <FormPreviewBase question={question} description={description}>
      <div className="flex flex-col gap-2">
        <ol className="flex flex-col gap-5">
          {options.map((option, index) => (
            <li key={option.id} value={option.id}>
              {index + 1}. {option.label}
            </li>
          ))}
        </ol>
      </div>
    </FormPreviewBase>
  );
}

export function FromPreviewLinearScale({
  question,
  description,
  formQuestionId,
  high,
  low,
  start = 1,
  count,
}: {
  question?: string;
  description?: string;
  formQuestionId: string;
  high?: string;
  low?: string;
  start?: number;
  count: number;
}) {
  return (
    <FormPreviewBase question={question} description={description}>
      <div className="w-full flex">
        {high && <div className="w-full">{high}</div>}
        <div className="w-[80%] mx-auto flex justify-between gap-3">
          {[...Array(count)].map((_, index) => (
            <div key={index} className="w-full flex flex-col gap-2">
              <p className="mx-auto">{index + 1}</p>
              <div className="radio mx-auto cursor-auto" />
            </div>
          ))}
        </div>
        {low && <div className="w-full">{low}</div>}
      </div>
    </FormPreviewBase>
  );
}

export function FromPreviewRating({
  question,
  description,
  icon,
  stroke,
  fill,
  count,
}: {
  question?: string;
  description?: string;
  icon: "star" | "heart" | "like";
  stroke: CSSProperties["color"];
  fill: CSSProperties["color"];
  count: number;
}) {
  let Icon: LucideIcon;
  if (icon === "star") {
    Icon = Star;
  } else if (icon === "heart") {
    Icon = Heart;
  } else {
    Icon = ThumbsUp;
  }

  return (
    <FormPreviewBase question={question} description={description}>
      <div className="w-full flex ">
        <div className="w-[80%] mx-auto flex justify-between gap-3">
          {[...Array(count)].map((_, index) => (
            <div key={index} className="w-full flex flex-col gap-2">
              <p className="mx-auto">{index + 1}</p>
              <div className="mx-auto">
                <div>
                  {index < 1 ? (
                    <Icon fill={fill} stroke={stroke} />
                  ) : (
                    <Icon stroke={stroke} />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FormPreviewBase>
  );
}

function FormPreviewGridBase({
  question,
  description,
  children,
  columns,
}: {
  question?: string;
  description?: string;
  children: ReactNode;
  columns: Option[];
}) {
  return (
    <FormPreviewBase question={question} description={description}>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            {columns.map((column, index) => (
              <th key={index} className="text-base-content">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </FormPreviewBase>
  );
}

function MultiChoiceColumn() {
  return (
    <td>
      <div className="radio cursor-auto" />
    </td>
  );
}

function MultiChoiceRow({ row, columns }: { row: Option; columns: Option[] }) {
  return (
    <tr>
      <th>{row.label}</th>
      {columns.map((column) => (
        <MultiChoiceColumn key={column.id} />
      ))}
    </tr>
  );
}

export function FormPreviewMultiChoiceGrid({
  question,
  description,
  table,
}: {
  question?: string;
  description?: string;
  table: GridBaseObject;
}) {
  return (
    <FormPreviewGridBase
      columns={table.columns}
      question={question}
      description={description}
    >
      {table.rows.map((row, index) => (
        <MultiChoiceRow key={index} row={row} columns={table.columns} />
      ))}
    </FormPreviewGridBase>
  );
}

function CheckboxColumn() {
  return (
    <td>
      <div className="checkbox cursor-auto" />
    </td>
  );
}

function CheckboxRow({ row, columns }: { row: Option; columns: Option[] }) {
  return (
    <tr>
      <th>{row.label}</th>
      {columns.map((column) => (
        <CheckboxColumn key={column.id} />
      ))}
    </tr>
  );
}

export function FormPreviewCheckboxGrid({
  question,
  description,
  table,
}: {
  question?: string;
  description?: string;
  table: GridBaseObject;
}) {
  return (
    <FormPreviewGridBase
      columns={table.columns}
      question={question}
      description={description}
    >
      {table.rows.map((row, index) => (
        <CheckboxRow key={index} row={row} columns={table.columns} />
      ))}
    </FormPreviewGridBase>
  );
}

export function FormPreviewDate({
  question,
  description,
  includeTime = false,
}: {
  question?: string;
  description?: string;
  includeTime?: boolean;
}) {
  return (
    <FormPreviewBase question={question} description={description}>
      <div className="btn font-normal">
        <CalendarDays strokeWidth={1.5} />
        <span className="mt-0.5">YYYY-MM-DD {includeTime && "HH:mm"}</span>
      </div>
    </FormPreviewBase>
  );
}

export function FormPreviewTime({
  question,
  description,
  kind,
}: {
  question?: string;
  description?: string;
  kind: "time" | "duration";
}) {
  return (
    <FormPreviewBase question={question} description={description}>
      {kind === "time" ? (
        <label className="fieldset-label input w-29 focus:outline-none focus-within:outline-none pr-0">
          Time
        </label>
      ) : (
        <label className="fieldset-label input w-30 focus:outline-none focus-within:outline-none">
          Duration
        </label>
      )}
    </FormPreviewBase>
  );
}

export function FormPreviewFileUpload({
  question,
  description,
}: {
  question?: string;
  description?: string;
}) {
  return (
    <FormPreviewBase question={question} description={description}>
      <div className="btn btn-secondary">Add Files</div>
    </FormPreviewBase>
  );
}
