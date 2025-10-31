"use client";

import { ReactNode, useState } from "react";
import TextareaAutoResize from "react-textarea-autosize";
import "@/styles/calendar.css";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/Popover";
import {
  FormHeader,
  FormField,
  FormObj,
  FormRating,
  FormConfig,
} from "./types";
import {
  CalendarDays,
  ChevronDown,
  CircleCheck,
  Clock,
  Copy,
  EllipsisVertical,
  Grid2x2,
  Grid2x2Check,
  GripHorizontal,
  Heart,
  Image,
  Minus,
  SquareCheck,
  Star,
  Text,
  ThumbsUp,
  Trash2,
  Type,
} from "lucide-react";
import ColorPicker from "../ui/ColorPicker";
import { DraggableAttributes } from "@dnd-kit/core";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { FormStoreHook } from "./store";
import { createDefaultConfig } from "@/constants";

// Prop Types
interface FormBuilderProps {
  id: string;
  index: number;
  store: FormStoreHook;
}

interface FormChoiceProps extends FormBuilderProps {
  optionId: string;
}

interface FormBuilderConfigProps extends FormBuilderProps {
  showDesc: boolean;
  setShowDesc: React.Dispatch<React.SetStateAction<boolean>>;
}

interface FormBuilderFieldProps extends FormBuilderProps {
  attributes?: DraggableAttributes;
  listeners?: SyntheticListenerMap | undefined;
}

interface FormBuilderBaseProps extends FormBuilderFieldProps {
  children: ReactNode;
}

interface FormTitleProps {
  header: FormHeader;
  updateHeader: (
    data: Partial<Pick<FormObj["header"], "title" | "description">>
  ) => void;
}

// Options
const createOption = (Icon: React.ElementType, label: string) => (
  <div className="flex gap-2 items-center">
    <Icon />
    {label}
  </div>
);

const fieldOptionsMap = {
  short_answer: createOption(Type, "Short Answer"),
  long_answer: createOption(Text, "Paragraph"),
  multiple_choice: createOption(CircleCheck, "Multiple Choice"),
  checkbox: createOption(SquareCheck, "Checkboxes"),
  dropdown: createOption(ChevronDown, "Dropdown"),
  file_upload: createOption(Image, "File Upload"),
  linear_scale: createOption(Minus, "Linear Scale"),
  rating: createOption(Star, "Rating"),
  multiple_choice_grid: createOption(Grid2x2, "Multiple Choice Grid"),
  checkbox_grid: createOption(Grid2x2Check, "Checkbox Grid"),
  date: createOption(CalendarDays, "Date"),
  time: createOption(Clock, "Time"),
};

// Form Base Bits
function FormBuilderBaseQuestion({ id, store }: FormBuilderProps) {
  const field = store((state) => state.getField(id));
  const updateField = store((state) => state.updateField);

  if (!field) return null;

  return (
    <TextareaAutoResize
      placeholder="Question"
      value={field?.title ?? ""}
      className="w-full mr-4 text-lg border-b resize-none focus:outline-none"
      onChange={(e) => updateField(field.id, { title: e.target.value })}
    />
  );
}

function FormBuilderBaseImage({}: FormBuilderProps) {
  return (
    <div className="tooltip" data-tip="Insert Image">
      <button className="btn btn-circle">
        <Image strokeWidth={1.5} />
      </button>
    </div>
  );
}

function FormBuilderBaseTypeDropdown({ id, store }: FormBuilderProps) {
  const field = store((state) => state.getField(id));

  const updateField = store((state) => state.updateField);

  if (!field) return null;

  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn m-1 w-56">
        <span className="flex items-center gap-1">
          {fieldOptionsMap[field.config.type]}
        </span>
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-300 rounded-box z-1 w-52 p-2 shadow-sm"
      >
        {Object.entries(fieldOptionsMap).map(([key, value]) => (
          <li key={key}>
            <button
              onClick={() =>
                updateField(field.id, {
                  config: createDefaultConfig(
                    key as FormField["config"]["type"]
                  ),
                })
              }
            >
              {value}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FormBuilderBaseActions({ index, id, store }: FormBuilderProps) {
  const field = store((state) => state.getField(id));

  const removeField = store((state) => state.removeField);
  const insertField = store((state) => state.insertField);

  if (!field) return null;

  return (
    <div className="flex gap-3">
      <button onClick={() => removeField(field.id)}>
        <Trash2 strokeWidth={1.5} />
      </button>
      <button
        onClick={() => {
          insertField(index + 1, field);
        }}
      >
        <Copy strokeWidth={1.5} />
      </button>
    </div>
  );
}

function FormBuilderConfiger({
  id,
  store,
  showDesc,
  setShowDesc,
}: FormBuilderConfigProps) {
  const field = store((state) => state.getField(id));

  const updateField = store((state) => state.updateField);

  if (!field) return null;

  return (
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle m-1">
        <EllipsisVertical strokeWidth={1.5} />
      </div>
      <ul
        tabIndex={0}
        className="dropdown-content menu bg-base-200 rounded-box z-1 w-52 p-2 shadow-sm"
      >
        <li>
          <label className="w-full label">
            <input
              type="checkbox"
              checked={showDesc}
              className="checkbox"
              onChange={(e) => {
                if (!e.target.checked) {
                  updateField(field.id, { description: "" });
                }
                setShowDesc(e.target.checked);
              }}
            />
            Decription
          </label>
        </li>
        <li>
          <label>
            <input type="checkbox" className="checkbox" />
            Response Validation
          </label>
        </li>
      </ul>
    </div>
  );
}

function hasOptions(
  config: FormConfig
): config is Extract<
  FormConfig,
  { type: "multiple_choice" | "checkbox" | "dropdown" }
> {
  return ["multiple_choice", "checkbox", "dropdown"].includes(config.type);
}

// Form Modular Bits
function ChoiceOption({ id, store, optionId }: FormChoiceProps) {
  const field = store((state) => state.getField(id));

  const getOption = store((state) => state.getOption);
  const updateOption = store((state) => state.updateOption);

  if (!field) return null;

  const { type } = field.config;

  // Only render for choice-type fields
  if (!hasOptions(field.config)) return null;

  const optionValue = getOption(field.id, optionId)?.label ?? "";

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    if (type === "dropdown") {
      updateOption(field.id, optionId, { label: value });
    } else {
      updateOption(field.id, optionId, { label: value, other: false });
    }
  };

  return (
    <input
      type="text"
      placeholder="Option"
      className="input"
      value={optionValue}
      onChange={handleChange}
    />
  );
}

function ChoiceDeleteButton({ id, store, optionId }: FormChoiceProps) {
  const field = store((state) => state.getField(id));

  const removeOption = store((state) => state.removeOption);

  if (!field) return null;

  return (
    <button
      className="btn btn-circle btn-soft btn-error"
      onClick={(e) => {
        e.preventDefault();
        removeOption(field.id, optionId);
      }}
    >
      <Trash2 strokeWidth={1.5} />
    </button>
  );
}

function ChoiceAddButton({ id, store }: FormBuilderProps) {
  const field = store((state) => state.getField(id));

  const addOption = store((state) => state.addOption);

  if (!field) return null;

  const { type } = field.config;

  if (!hasOptions(field.config)) return null;
  const nextIndex = (field.config.options ?? []).length + 1;

  return (
    <div className="flex items-center gap-2 mt-2">
      {type !== "dropdown" && (
        <div className={type === "checkbox" ? "checkbox" : "radio"} />
      )}
      <button
        className="btn btn-soft"
        onClick={() =>
          addOption(field.id, {
            label: `Option ${nextIndex}`,
            other: false,
          })
        }
      >
        Add Option
      </button>
      {type !== "dropdown" &&
        (field.config.options ?? []).filter((a) => a.other).length === 0 && (
          <>
            <span>or</span>
            <button
              className="btn btn-soft"
              onClick={() =>
                addOption(field.id, {
                  label: "Other",
                  other: true,
                })
              }
            >
              Add Other Option
            </button>
          </>
        )}
    </div>
  );
}

const MultiChoiceOption = (props: FormChoiceProps) => (
  <ChoiceOption {...props} />
);

const MultiChoiceAddButton = (props: FormBuilderProps) => (
  <ChoiceAddButton {...props} />
);

const CheckboxOption = (props: FormChoiceProps) => <ChoiceOption {...props} />;

const CheckboxAddButton = (props: FormBuilderProps) => (
  <ChoiceAddButton {...props} />
);

const DropdownOption = (props: FormChoiceProps) => <ChoiceOption {...props} />;

const DropdownAddButton = (props: FormBuilderProps) => (
  <ChoiceAddButton {...props} />
);

function RatingColorPicker({ id, store }: FormBuilderProps) {
  const field = store((state) => state.getField(id));

  const updateField = store((state) => state.updateField);

  if (!field) return null;

  if (field.config.type !== "rating") return null;

  const config = field.config as FormRating;

  const handleColorChange = (key: "stroke" | "fill") => (color: string) => {
    updateField(field.id, {
      ...field,
      config: {
        ...config,
        [key]: color,
      },
    });
  };

  const colorConfigs = [
    { key: "stroke" as const, defaultColor: "orange" },
    { key: "fill" as const, defaultColor: "gold" },
  ];

  return (
    <>
      {colorConfigs.map(({ key, defaultColor }) => (
        <Popover key={key}>
          <PopoverTrigger className="btn btn-soft">
            <div
              className="w-5 h-5 rounded-full"
              style={{ backgroundColor: config[key] ?? defaultColor }}
            />
          </PopoverTrigger>
          <PopoverContent className="w-fit p-0">
            <ColorPicker
              defaultColor={config[key] ?? defaultColor}
              onColorChange={handleColorChange(key)}
            />
          </PopoverContent>
        </Popover>
      ))}
    </>
  );
}

type IconOption = {
  key: FormRating["icon"];
  Icon: typeof Star;
  fill: FormRating["fill"];
  stroke: FormRating["stroke"];
};

const ICON_OPTIONS: IconOption[] = [
  { key: "star", Icon: Star, fill: "gold", stroke: "orange" },
  { key: "heart", Icon: Heart, fill: "red", stroke: "darkred" },
  { key: "like", Icon: ThumbsUp, fill: "blue", stroke: "white" },
];

function RatingSelect(props: FormBuilderProps) {
  const { id, store } = props;

  const field = store((state) => state.getField(id));
  const updateField = store((state) => state.updateField);

  if (!field) return null;

  if (field.config.type !== "rating") return null;
  const { type, count, icon } = field.config;

  const handleCountChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (type !== "rating") return;

    updateField(field.id, {
      config: { ...field.config, count: parseInt(e.target.value, 10) },
    });
  };

  const handleIconChange = (iconConfig: IconOption) => {
    if (type !== "rating") return;

    updateField(field.id, {
      config: {
        ...field.config,
        icon: iconConfig.key,
        fill: iconConfig.fill,
        stroke: iconConfig.stroke,
      },
    });
  };

  const CurrentIcon =
    ICON_OPTIONS.find((opt) => opt.key === icon)?.Icon || Star;
  const currentFill =
    ICON_OPTIONS.find((opt) => opt.key === icon)?.fill || "gold";
  const currentStroke =
    ICON_OPTIONS.find((opt) => opt.key === icon)?.stroke || "orange";

  return (
    <div className="flex items-center gap-3">
      {/* Rating count select */}
      <select
        defaultValue={count}
        className="select w-16"
        onChange={handleCountChange}
      >
        {Array.from({ length: 8 }, (_, i) => {
          const value = i + 3;
          return (
            <option key={value} value={value}>
              {value}
            </option>
          );
        })}
      </select>

      {/* Icon selector */}
      <div className="dropdown">
        <div tabIndex={0} role="button" className="btn m-1">
          <CurrentIcon fill={currentFill} stroke={currentStroke} />
        </div>
        <ul
          tabIndex={0}
          className="dropdown-content menu bg-base-100 rounded-box z-1 p-2 shadow-sm"
        >
          {ICON_OPTIONS.map((opt) => (
            <li key={opt.key}>
              <button
                className="flex justify-center gap-2"
                onClick={() => handleIconChange(opt)}
              >
                <opt.Icon fill={opt.fill} stroke={opt.stroke} />
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Color picker */}
      <RatingColorPicker {...props} />
    </div>
  );
}

export default RatingSelect;

function RatingPreview({ field }: { field: FormField }) {
  if (field.config.type !== "rating") return null;

  return (
    <div className="w-full flex ">
      <div className="w-[80%] mx-auto flex justify-between gap-3">
        {[...Array(field.config.count ?? 3)].map((_, index) => (
          <div key={index} className="w-full flex flex-col gap-2">
            <p className="mx-auto">{index + 1}</p>
            <div className="mx-auto">
              <button>
                {"icon" in field.config ? (
                  <>
                    {field.config.icon === "star" && (
                      <Star
                        stroke={field.config.stroke}
                        fill={index === 0 ? field.config.fill : "transparent"}
                      />
                    )}
                    {field.config.icon === "heart" && (
                      <Heart
                        stroke={field.config.stroke}
                        fill={index === 0 ? field.config.fill : "transparent"}
                      />
                    )}
                    {field.config.icon === "like" && (
                      <ThumbsUp
                        stroke={field.config.stroke}
                        fill={index === 0 ? field.config.fill : "transparent"}
                      />
                    )}
                  </>
                ) : (
                  <Star />
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function hasTableOptions(
  config: FormConfig
): config is Extract<
  FormConfig,
  { type: "multiple_choice_grid" | "checkbox_grid" }
> {
  return ["multiple_choice_grid", "checkbox_grid"].includes(config.type);
}

function GridChoiceAddButton({
  id,
  store,
  actOn,
}: FormBuilderProps & { actOn: "row" | "column" }) {
  const field = store((state) => state.getField(id));
  const addRow = store((state) => state.addRow);
  const addColumn = store((state) => state.addColumn);

  if (!field) return null;

  return (
    <button
      className="btn btn-soft"
      onClick={() => {
        if (!hasTableOptions(field.config)) return;
        if (field.config.table === undefined) return;
        if (actOn === "row") {
          addRow(field.id, {
            label: `Row ${(field.config.table.rows ?? []).length + 1}`,
          });
        } else {
          addColumn(field.id, {
            label: `Column ${(field.config.table.columns ?? []).length + 1}`,
          });
        }
      }}
    >
      Add {actOn.charAt(0).toUpperCase() + actOn.slice(1)}
    </button>
  );
}

function GridChoiceDeleteButton({
  id,
  store,
  actOn,
  optionId,
}: FormBuilderProps & { optionId: string; actOn: "row" | "column" }) {
  const field = store((state) => state.getField(id));
  const deleteRow = store((state) => state.removeRow);
  const deleteColumn = store((state) => state.removeColumn);

  if (!field) return null;

  return (
    <button
      className="btn btn-circle btn-soft btn-error"
      onClick={(e) => {
        e.preventDefault();
        if (!hasTableOptions(field.config)) return;
        if (field.config.table === undefined) return;
        if (actOn === "row") {
          deleteRow(field.id, optionId);
        } else {
          deleteColumn(field.id, optionId);
        }
      }}
    >
      <Trash2 strokeWidth={1.5} />
    </button>
  );
}

type GridOrientation = "row" | "column";

interface GridInputProps extends FormBuilderProps {
  orientation: GridOrientation;
}

function GridTableInput(props: GridInputProps) {
  const { id, store, orientation } = props;

  const field = store((state) => state.getField(id));

  if (!field) return null;

  if (!hasTableOptions(field.config)) return null;

  const updateFn =
    orientation === "row"
      ? store((state) => state.updateRow)
      : store((state) => state.updateColumn);

  const isMultipleChoice = field.config.type === "multiple_choice_grid";
  const isCheckbox = field.config.type === "checkbox_grid";

  if (!isMultipleChoice && !isCheckbox) return null;

  const items =
    orientation === "row"
      ? field.config.table?.rows || []
      : field.config.table?.columns || [];

  return (
    <div className="w-full flex flex-col gap-2">
      {items.map((item) => (
        <div key={item.id} className="flex items-center gap-2">
          {/* Input prefix (radio/checkbox/none) */}
          {isMultipleChoice && orientation === "column" && (
            <div className="radio cursor-auto" />
          )}
          {isCheckbox && orientation === "column" && (
            <input type="checkbox" className="checkbox" disabled />
          )}

          {/* Editable option input */}
          <input
            type="text"
            placeholder="Option"
            className="input"
            value={item.label}
            onChange={(e) => {
              if (hasTableOptions(field.config)) {
                updateFn(field.id, item.id, {
                  label: e.target.value,
                });
              }
            }}
          />

          {/* Delete button */}
          <GridChoiceDeleteButton
            {...props}
            actOn={orientation}
            optionId={item.id}
          />
        </div>
      ))}

      {/* Add button */}
      <GridChoiceAddButton {...props} actOn={orientation} />
    </div>
  );
}

const GridMultiChoiceRowInput = (props: FormBuilderProps) => (
  <GridTableInput {...props} orientation="row" />
);
const GridMultiChoiceColumnInput = (props: FormBuilderProps) => (
  <GridTableInput {...props} orientation="column" />
);

const GridCheckboxRowInput = (props: FormBuilderProps) => (
  <GridTableInput {...props} orientation="row" />
);
const GridCheckboxColumnInput = (props: FormBuilderProps) => (
  <GridTableInput {...props} orientation="column" />
);

// TSX
export function FormBuilderTitle({ header, updateHeader }: FormTitleProps) {
  return (
    <div className="bg-primary pt-2 rounded-md">
      <div className="bg-base-100 min-h-32 p-5 flex flex-col gap-2">
        <input
          value={header.title}
          type="text"
          className="w-full text-5xl"
          onChange={(e) =>
            updateHeader({
              title: e.target.value,
            })
          }
        />
        <TextareaAutoResize
          value={header.description}
          name="description"
          className="w-full text-sm rounded-xs resize-none"
          minRows={1}
          onChange={(e) =>
            updateHeader({
              description: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
}

export function FormBuilderBase(props: FormBuilderBaseProps) {
  const { attributes, listeners, id, children, store } = props;

  const field = store((s) => s.getField(id));
  const updateField = store((s) => s.updateField);

  if (!field) return null;

  const [showDesc, setShowDesc] = useState(field.description ? true : false);

  return (
    <div className="bg-base-100 px-5 pb-5">
      <div
        {...attributes}
        {...listeners}
        className="w-full h-5 flex items-center justify-center cursor-grab "
      >
        <span className="px-2 py-1 rounded">
          <GripHorizontal size={20} opacity={"35%"} />
        </span>
      </div>
      <div className="mb-2">
        <div className="w-full flex items-center">
          <FormBuilderBaseQuestion {...props} />
          <div className="flex items-center gap-2 ml-auto">
            <FormBuilderBaseImage {...props} />
            <FormBuilderBaseTypeDropdown {...props} />
          </div>
        </div>
        {showDesc && (
          <TextareaAutoResize
            placeholder="Description"
            value={field?.description ?? ""}
            className="w-full mt-2 text-sm border-b resize-none focus:outline-none"
            onChange={(e) =>
              updateField(field.id, { description: e.target.value })
            }
          />
        )}
      </div>
      {children}
      <div className="divider"></div>
      <div className="w-full flex justify-end">
        <FormBuilderBaseActions {...props} />
        <div className="divider divider-horizontal"></div>
        <label className="label">
          Required
          <input
            type="checkbox"
            className="toggle"
            checked={!!field?.required}
            onChange={(e) =>
              updateField(field.id, { required: e.target.checked })
            }
          />
        </label>
        <FormBuilderConfiger
          showDesc={showDesc}
          setShowDesc={setShowDesc}
          {...props}
        />
      </div>
    </div>
  );
}

export function FormBuilderShortAnswer(props: FormBuilderFieldProps) {
  return (
    <FormBuilderBase {...props}>
      <label className="fieldset-label input">
        <p>Short answer text</p>
      </label>
    </FormBuilderBase>
  );
}

export function FormBuilderLongAnswer(props: FormBuilderFieldProps) {
  return (
    <FormBuilderBase {...props}>
      <label className="relative fieldset-label textarea min-h-13 pb-5 w-full focus:outline-none focus-within:outline-none">
        <p className="text-xs absolute right-1 bottom-1 text-base-content/30">
          /100
        </p>
      </label>
    </FormBuilderBase>
  );
}

export function FormBuilderMultipleChoice(props: FormBuilderFieldProps) {
  const { id, store } = props;

  const field = store((s) => s.getField(id));

  if (!field) return null;

  const { type } = field.config;

  if (type !== "multiple_choice") return null;
  return (
    <FormBuilderBase {...props}>
      <div className="flex flex-col gap-5 mb-5">
        {field.config.options?.map((option) => {
          if (option.other)
            return (
              <div className="flex items-center gap-2" key={option.id}>
                <div className="radio cursor-auto" />
                <div className="input cursor-auto text-base-content/30">
                  Other
                </div>
                <ChoiceDeleteButton {...props} optionId={option.id} />
              </div>
            );
          return (
            <div className="flex items-center gap-2" key={option.id}>
              <div className="radio cursor-auto" />
              <MultiChoiceOption
                {...props}
                key={option.id}
                optionId={option.id}
              />
              <ChoiceDeleteButton {...props} optionId={option.id} />
            </div>
          );
        })}
      </div>
      <MultiChoiceAddButton {...props} />
    </FormBuilderBase>
  );
}

export function FormBuilderCheckbox(props: FormBuilderFieldProps) {
  const { id, store } = props;

  const field = store((s) => s.getField(id));

  if (!field) return null;

  const { type } = field.config;

  if (type !== "checkbox") return null;
  return (
    <FormBuilderBase {...props}>
      <div className="flex flex-col gap-2">
        {field.config.options?.map((option) => {
          if (option.other)
            return (
              <div className="flex items-center gap-2" key={option.id}>
                <div className="checkbox cursor-auto" />
                <div className="input cursor-auto text-base-content/30">
                  Other
                </div>
                <ChoiceDeleteButton {...props} optionId={option.id} />
              </div>
            );
          return (
            <div className="flex items-center gap-2" key={option.id}>
              <div className="checkbox cursor-auto" />
              <CheckboxOption {...props} key={option.id} optionId={option.id} />
              <ChoiceDeleteButton {...props} optionId={option.id} />
            </div>
          );
        })}
      </div>
      <CheckboxAddButton {...props} />
    </FormBuilderBase>
  );
}

export function FormBuilderDropdown(props: FormBuilderFieldProps) {
  const { id, store } = props;

  const field = store((s) => s.getField(id));

  if (!field) return null;

  const { type } = field.config;

  if (type !== "dropdown") return null;
  return (
    <FormBuilderBase {...props}>
      <div className="flex flex-col gap-2">
        {field.config.options?.map((option) => (
          <div className="flex items-center gap-2" key={option.id}>
            <DropdownOption {...props} optionId={option.id} />
            <ChoiceDeleteButton {...props} optionId={option.id} />
          </div>
        ))}
      </div>
      <DropdownAddButton {...props} />
    </FormBuilderBase>
  );
}

export function FormBuilderLinearScale(props: FormBuilderFieldProps) {
  const { id, store } = props;

  const field = store((s) => s.getField(id));
  const updateField = store((s) => s.updateField);

  if (!field) return null;

  if (field.config.type !== "linear_scale") return null;

  const { start = 1, count = 5, low, high } = field.config;

  // ---------- Helpers ----------
  const setConfig = (partial: Partial<typeof field.config>) => {
    updateField(field.id, { config: { ...field.config, ...partial } });
  };

  const handleStartChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setConfig({ start: e.target.value === "1" ? 1 : 0 });

  const handleCountChange = (e: React.ChangeEvent<HTMLSelectElement>) =>
    setConfig({ count: parseInt(e.target.value, 10) });

  const handleTextChange =
    (key: "low" | "high") => (e: React.ChangeEvent<HTMLInputElement>) =>
      setConfig({ [key]: e.target.value });

  // ---------- Render ----------
  return (
    <FormBuilderBase {...props}>
      <div className="flex flex-col justify-center gap-2">
        {/* Range Selector */}
        <div className="flex items-center gap-3">
          <select
            value={start}
            className="select w-16"
            onChange={handleStartChange}
          >
            {[0, 1].map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>

          <p>to</p>

          <select
            value={count}
            className="select w-16"
            onChange={handleCountChange}
          >
            {Array.from({ length: 9 }, (_, i) => i + 2).map((v) => (
              <option key={v} value={v}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {/* Labels */}
        <div className="flex flex-col gap-2">
          {[
            { label: start, key: "low", placeholder: "Low", value: low },
            { label: count, key: "high", placeholder: "High", value: high },
          ].map(({ label, key, placeholder, value }) => (
            <div key={key} className="flex items-center gap-3">
              <p>{label}:</p>
              <input
                type="text"
                placeholder={placeholder}
                className="input w-24"
                value={value ?? ""}
                onChange={handleTextChange(key as "low" | "high")}
              />
            </div>
          ))}
        </div>
      </div>
    </FormBuilderBase>
  );
}

export function FormBuilderRating(props: FormBuilderFieldProps) {
  const { id, store } = props;

  const field = store((s) => s.getField(id));

  if (!field) return null;

  if (field.config.type !== "rating") return null;

  return (
    <FormBuilderBase {...props}>
      <div className="flex flex-col gap-2">
        <RatingSelect {...props} />
        <RatingPreview field={field} />
      </div>
    </FormBuilderBase>
  );
}

export function FormBuilderMultipleChoiceGrid(props: FormBuilderFieldProps) {
  return (
    <FormBuilderBase {...props}>
      <div className="flex w-full gap-2">
        <GridMultiChoiceRowInput {...props} />
        <GridMultiChoiceColumnInput {...props} />
      </div>
    </FormBuilderBase>
  );
}

export function FormBuilderCheckboxGrid(props: FormBuilderFieldProps) {
  return (
    <FormBuilderBase {...props}>
      <div className="flex w-full gap-2">
        <GridCheckboxRowInput {...props} />
        <GridCheckboxColumnInput {...props} />
      </div>
    </FormBuilderBase>
  );
}

export function FormBuilderDate(props: FormBuilderFieldProps) {
  const { id, store } = props;

  const field = store((s) => s.getField(id));

  if (!field) return null;

  if (field.config.type !== "date") return null;
  return (
    <FormBuilderBase {...props}>
      <div className="btn font-normal">
        <CalendarDays strokeWidth={1.5} />
        <span className="mt-0.5">
          YYYY-MM-DD {field.config.includeTime && "HH:mm"}
        </span>
      </div>
    </FormBuilderBase>
  );
}

export function FormBuilderTime(props: FormBuilderFieldProps) {
  const { id, store } = props;

  const field = store((s) => s.getField(id));

  if (!field) return null;

  if (field.config.type !== "time") return null;
  return (
    <FormBuilderBase {...props}>
      {field.config.kind === "time" ? (
        <label className="fieldset-label input w-29 focus:outline-none focus-within:outline-none pr-0">
          Time
        </label>
      ) : (
        <label className="fieldset-label input w-30 focus:outline-none focus-within:outline-none">
          Duration
        </label>
      )}
    </FormBuilderBase>
  );
}

export function FormBuilderFileUpload(props: FormBuilderFieldProps) {
  return (
    <FormBuilderBase {...props}>
      <label className="fieldset-label input">
        <p>File Upload</p>
      </label>
    </FormBuilderBase>
  );
}
