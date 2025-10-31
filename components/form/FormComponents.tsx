"use client";
import {
  CalendarDays,
  Clock,
  Heart,
  LucideIcon,
  Star,
  ThumbsUp,
} from "lucide-react";
import {
  CSSProperties,
  HTMLInputTypeAttribute,
  ReactNode,
  useRef,
  useState,
} from "react";
import Datetime from "react-datetime";
import TextareaAutosize from "react-textarea-autosize";
import "@/styles/calendar.css";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import { formatDate } from "@/utils";
import { Option, GridBaseObject, UserInputOption } from "./types";

// TSX

export function FormTitle({
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

export function FormBase({
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

export function FormShortAnswer({
  question,
  description,
  type,
}: {
  question?: string;
  description?: string;
  type: HTMLInputTypeAttribute;
}) {
  return (
    <FormBase question={question} description={description}>
      <label className="fieldset-label input focus:outline-none focus-within:outline-none">
        <input type={type} className="text-base-content" />
      </label>
    </FormBase>
  );
}

export function FormLongAnswer({
  question,
  description,
  required,
}: {
  question?: string;
  description?: string;
  required?: boolean;
}) {
  return (
    <FormBase question={question} description={description}>
      <label className="relative fieldset-label textarea min-h-13 pb-5 w-full focus:outline-none focus-within:outline-none">
        <TextareaAutosize
          className="w-full resize-none text-base-content"
          minRows={1}
          maxRows={10}
        />
        <p className="text-xs absolute right-1 bottom-1 text-base-content/30">
          /100
        </p>
      </label>
    </FormBase>
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
      <input type="radio" name={formQuestionId} className="radio" />
      {option}
    </label>
  );
}

function MultipleChoiceInput({ formQuestionId }: { formQuestionId: string }) {
  const [input, setInput] = useState("");
  return (
    <label className="flex gap-2 ">
      <input
        type="radio"
        name={formQuestionId}
        className="radio"
        disabled={!input}
      />
      <input
        type="text"
        className="focus-within:outline-none focus:outline-none border-b"
        placeholder="Other: "
        onChange={(e) => setInput(e.target.value)}
      />
    </label>
  );
}

export function FormMultipleChoice({
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
    <FormBase question={question} description={description}>
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
    </FormBase>
  );
}

function CheckboxOptions({ option }: { option: string }) {
  return (
    <label className="label text-base-content ">
      <input type="checkbox" className="checkbox" />
      {option}
    </label>
  );
}

function CheckboxInput() {
  const [input, setInput] = useState("");
  return (
    <label className="flex gap-2">
      <input type="checkbox" className="checkbox" disabled={!input} />
      <input
        type="text"
        className="focus-within:outline-none focus:outline-none border-b"
        placeholder="Other: "
        onChange={(e) => setInput(e.target.value)}
      />
    </label>
  );
}

export function FormCheckboxes({
  question,
  description,
  options,
}: {
  question?: string;
  description?: string;
  options: UserInputOption[];
}) {
  return (
    <FormBase question={question} description={description}>
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
    </FormBase>
  );
}

export function FormDropdown({
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
    <FormBase question={question} description={description}>
      <div className="flex flex-col gap-2">
        <select
          value={selectedValue}
          className="select"
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <option value="e76aay8" disabled>
            Choose
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </FormBase>
  );
}

export function FromLinearScale({
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
    <FormBase question={question} description={description}>
      <div className="w-full flex">
        {high && <div className="w-full">{high}</div>}
        <div className="w-[80%] mx-auto flex justify-between gap-3">
          {[...Array(count)].map((_, index) => (
            <div key={index} className="w-full flex flex-col gap-2">
              <p className="mx-auto">{index + 1}</p>
              <input
                type="radio"
                name={formQuestionId}
                className="radio mx-auto"
              />
            </div>
          ))}
        </div>
        {low && <div className="w-full">{low}</div>}
      </div>
    </FormBase>
  );
}

export function FromRating({
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
  const [rating, setRating] = useState(0);

  let Icon: LucideIcon;
  if (icon === "star") {
    Icon = Star;
  } else if (icon === "heart") {
    Icon = Heart;
  } else {
    Icon = ThumbsUp;
  }

  return (
    <FormBase question={question} description={description}>
      <div className="w-full flex ">
        <div className="w-[80%] mx-auto flex justify-between gap-3">
          {[...Array(count)].map((_, index) => (
            <div key={index} className="w-full flex flex-col gap-2">
              <p className="mx-auto">{index + 1}</p>
              <div className="mx-auto">
                <button onClick={() => setRating(index + 1)}>
                  {index < rating ? (
                    <Icon fill={fill} stroke={stroke} />
                  ) : (
                    <Icon stroke={stroke} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FormBase>
  );
}

function FormGridBase({
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
    <FormBase question={question} description={description}>
      <table className="table">
        <thead>
          <tr>
            <th></th>
            {columns.map((column) => (
              <th key={column.id} className="text-base-content">
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </FormBase>
  );
}

function MultiChoiceColumn({ group }: { group: string }) {
  return (
    <td>
      <input type="radio" name={group} className="radio" />
    </td>
  );
}

function MultiChoiceRow({ row, columns }: { row: Option; columns: Option[] }) {
  return (
    <tr>
      <th>{row.label}</th>
      {columns.map((_, index) => (
        <MultiChoiceColumn key={index} group={row.id} />
      ))}
    </tr>
  );
}

export function FormMultiChoiceGrid({
  question,
  description,
  table,
}: {
  question?: string;
  description?: string;
  table: GridBaseObject;
}) {
  return (
    <FormGridBase
      columns={table.columns}
      question={question}
      description={description}
    >
      {table.rows.map((row, index) => (
        <MultiChoiceRow key={index} row={row} columns={table.columns} />
      ))}
    </FormGridBase>
  );
}

function CheckboxColumn() {
  return (
    <td>
      <input type="checkbox" className="checkbox" />
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

export function FormCheckboxGrid({
  question,
  description,
  table,
}: {
  question?: string;
  description?: string;
  table: GridBaseObject;
}) {
  return (
    <FormGridBase
      columns={table.columns}
      question={question}
      description={description}
    >
      {table.rows.map((row, index) => (
        <CheckboxRow key={index} row={row} columns={table.columns} />
      ))}
    </FormGridBase>
  );
}

export function FormDate({
  question,
  description,
  includeTime = false,
}: {
  question?: string;
  description?: string;
  includeTime?: boolean;
}) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <FormBase question={question} description={description}>
      <Popover>
        <PopoverTrigger className="btn font-normal">
          <CalendarDays strokeWidth={1.5} />
          <span className="mt-0.5">
            {formatDate(
              date?.toISOString() as string,
              includeTime ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD"
            )}
          </span>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="end"
          className="px-0 py-0 rounded-lg bg-none overflow-clip border-none"
        >
          <Datetime
            input={false}
            timeFormat={includeTime}
            value={date}
            onChange={(date) => {
              if (typeof date !== "string") {
                setDate(new Date(date.toISOString()));
              }
            }}
          />
        </PopoverContent>
      </Popover>
    </FormBase>
  );
}

function TimeInput() {
  const [selectedValue, setSelectedValue] = useState<"am" | "pm">("am");
  const minuteRef = useRef<HTMLInputElement>(null);
  const periodRef = useRef<HTMLSelectElement>(null);

  return (
    <label className="fieldset-label input w-fit focus:outline-none focus-within:outline-none pr-0">
      <input
        type="text"
        inputMode="numeric"
        min={1}
        max={12}
        maxLength={2}
        className="text-base-content w-4"
        onInput={(e: React.FormEvent<HTMLInputElement>) => {
          const target = e.currentTarget; // correct type inference
          let value = target.value.replace(/[^0-9]/g, ""); // only digits
          if (value && (parseInt(value) < 0 || parseInt(value) > 12))
            value = target.value.slice(0, -1);
          target.value = value;
          if (value.length === 2 && minuteRef.current) {
            minuteRef.current.focus();
          }
        }}
      />
      :
      <input
        type="text"
        ref={minuteRef}
        inputMode="numeric"
        min={0}
        max={60}
        maxLength={2}
        className="text-base-content w-4"
        onInput={(e: React.FormEvent<HTMLInputElement>) => {
          const target = e.currentTarget; // correct type inference
          let value = target.value.replace(/[^0-9]/g, ""); // only digits
          if (value && (parseInt(value) < 0 || parseInt(value) > 59))
            value = target.value.slice(0, -1);
          target.value = value;
          if (value.length === 2 && periodRef.current) {
            periodRef.current.focus();
          }
        }}
      />
      <select
        value={selectedValue}
        ref={periodRef}
        className="select select-sm select-ghost mt-0.5 border-none focus:outline-none focus-within:outline-none px-0 text-base-content"
        onChange={(e) => setSelectedValue(e.target.value as "am" | "pm")}
      >
        <option value="am">AM</option>
        <option value="pm">PM</option>
      </select>
    </label>
  );
}

function DurationInput() {
  const hourRef = useRef<HTMLInputElement>(null);
  const minuteRef = useRef<HTMLInputElement>(null);
  const secondRef = useRef<HTMLInputElement>(null);

  return (
    <label className="fieldset-label input w-fit focus:outline-none focus-within:outline-none">
      <input
        type="text"
        ref={hourRef}
        placeholder="hh"
        maxLength={2}
        className="text-base-content w-5"
        onInput={(e: React.FormEvent<HTMLInputElement>) => {
          const target = e.currentTarget; // correct type inference
          let value = target.value.replace(/[^0-9]/g, ""); // only digits
          if (value && parseInt(value) < 0) value = target.value.slice(0, -1);
          target.value = value;
          if (value.length === 2 && minuteRef.current) {
            minuteRef.current.focus();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight") {
            e.preventDefault();
            if (e.currentTarget.value.length === 0)
              e.currentTarget.value = "00";
            if (minuteRef.current) minuteRef.current.focus();
          }
        }}
      />
      :
      <input
        type="text"
        ref={minuteRef}
        placeholder="mm"
        maxLength={2}
        className="text-base-content w-6"
        onInput={(e: React.FormEvent<HTMLInputElement>) => {
          const target = e.currentTarget; // correct type inference
          let value = target.value.replace(/[^0-9]/g, ""); // only digits
          if (value && (parseInt(value) < 0 || parseInt(value) > 59))
            value = target.value.slice(0, -1);
          target.value = value;
          if (value.length === 2 && secondRef.current) {
            secondRef.current.focus();
          }
        }}
        onKeyDown={(e) => {
          if (e.key === "Backspace") {
            e.preventDefault();
            let value = e.currentTarget.value.slice(0, -1);
            if (value.length === 0 && hourRef.current) hourRef.current.focus();
            e.currentTarget.value = value;
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            let value = e.currentTarget.value;
            if (value.length === 0) value = "00";
            if (hourRef.current) hourRef.current.focus();
          }
          if (e.key === "ArrowRight") {
            e.preventDefault();
            if (e.currentTarget.value.length === 0)
              e.currentTarget.value = "00";
            if (secondRef.current) secondRef.current.focus();
          }
        }}
      />
      :
      <input
        type="text"
        ref={secondRef}
        placeholder="ss"
        maxLength={2}
        className="text-base-content w-5"
        onInput={(e: React.FormEvent<HTMLInputElement>) => {
          const target = e.currentTarget; // correct type inference
          let value = target.value.replace(/[^0-9]/g, ""); // only digits
          if (value && (parseInt(value) < 0 || parseInt(value) > 59))
            value = target.value.slice(0, -1);
          target.value = value;
        }}
        onKeyDown={(e) => {
          if (e.key === "Backspace") {
            e.preventDefault();
            let value = e.currentTarget.value.slice(0, -1);
            if (value.length === 0 && minuteRef.current)
              minuteRef.current.focus();
            e.currentTarget.value = value;
          }
          if (e.key === "ArrowLeft") {
            e.preventDefault();
            if (minuteRef.current) minuteRef.current.focus();
          }
        }}
      />
    </label>
  );
}

export function FormTime({
  question,
  description,
  kind,
}: {
  question?: string;
  description?: string;
  kind: "time" | "duration";
}) {
  return (
    <FormBase question={question} description={description}>
      {kind === "time" ? <TimeInput /> : <DurationInput />}
    </FormBase>
  );
}

export function FormFileUpload({
  question,
  description,
}: {
  question?: string;
  description?: string;
}) {
  return (
    <FormBase question={question} description={description}>
      <button className="btn btn-secondary">Add Files</button>
    </FormBase>
  );
}
