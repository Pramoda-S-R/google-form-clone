"use client";
import { useRef, useState } from "react";
import {
  FormBuilderCheckbox,
  FormBuilderCheckboxGrid,
  FormBuilderDate,
  FormBuilderDropdown,
  FormBuilderFileUpload,
  FormBuilderLinearScale,
  FormBuilderLongAnswer,
  FormBuilderMultipleChoice,
  FormBuilderMultipleChoiceGrid,
  FormBuilderRating,
  FormBuilderShortAnswer,
  FormBuilderTime,
  FormBuilderTitle,
} from "@/components/form/FormBuilderComponents";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  DraggableAttributes,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { SyntheticListenerMap } from "@dnd-kit/core/dist/hooks/utilities";
import { FormStoreHook, useFormStore } from "@/app/store";
import { formData } from "@/constants";

interface SortableItemProps {
  id: string;
  store: FormStoreHook;
  index: number;
}

interface FieldsProps extends SortableItemProps {
  type: string;
  attributes: DraggableAttributes;
  listeners: SyntheticListenerMap | undefined;
}

function Fields(props: FieldsProps) {
  const { type } = props;

  switch (type) {
    case "short_answer":
      return <FormBuilderShortAnswer {...props} />;
    case "long_answer":
      return <FormBuilderLongAnswer {...props} />;
    case "multiple_choice":
      return <FormBuilderMultipleChoice {...props} />;
    case "checkbox":
      return <FormBuilderCheckbox {...props} />;
    case "dropdown":
      return <FormBuilderDropdown {...props} />;
    case "linear_scale":
      return <FormBuilderLinearScale {...props} />;
    case "rating":
      return <FormBuilderRating {...props} />;
    case "multiple_choice_grid":
      return <FormBuilderMultipleChoiceGrid {...props} />;
    case "checkbox_grid":
      return <FormBuilderCheckboxGrid {...props} />;
    case "date":
      return <FormBuilderDate {...props} />;
    case "time":
      return <FormBuilderTime {...props} />;
    case "file_upload":
      return <FormBuilderFileUpload {...props} />;
    default:
      return (
        <div className="bg-base-100 p-4 rounded-md">
          <p>Field type is not implemented yet.</p>
        </div>
      );
  }
}

function SortableItem(props: SortableItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? transition : "none",
  };

  const { store } = props;
  const field = store((s) => s.getField(props.id));

  if (!field) return null;

  const { type } = field.config;

  return (
    <div ref={setNodeRef} style={style}>
      <Fields
        {...props}
        type={type}
        attributes={attributes}
        listeners={listeners}
      />
    </div>
  );
}

const AdminForm = () => {
  const header = useFormStore((s) => s.header);
  const updateHeader = useFormStore((s) => s.updateHeader);
  const setHeader = useFormStore((s) => s.setHeader);
  // const [header, setHeader] = useState<FormHeader>(formData.header);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const formFields = useFormStore((s) => s.fields);
  const fieldIds = useFormStore(
    (s) => s.fields.map((f) => f.id).join("|") // stable string instead of new array
  );
  const idsArray = fieldIds.split("|");
  const setFormFields = useFormStore((s) => s.setFields);
  const addFormField = useFormStore((s) => s.addField);
  // const [formFields, setFormFields] = useState<FormField[]>(formData.fields);
  const index = useRef<number>(0);
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = formFields.findIndex((item) => item.id === active.id);
      const newIndex = formFields.findIndex((item) => item.id === over.id);

      const reordered = arrayMove(formFields, oldIndex, newIndex);
      setFormFields(reordered);
    }
  }

  return (
    <div className="w-full min-h-dvh overflow-y-auto bg-base-300">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={(event) => setActiveId(event.active.id)}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToParentElement]}
      >
        <div className="max-w-3xl mx-auto flex flex-col gap-2 py-2">
          <FormBuilderTitle header={header} updateHeader={updateHeader} />
          <SortableContext
            items={idsArray}
            strategy={verticalListSortingStrategy}
          >
            {idsArray.map((id, index) => (
              <SortableItem
                key={index}
                store={useFormStore}
                id={id}
                index={index}
              />
            ))}
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <div className="w-full h-1 bg-primary rounded-t-sm" />
            ) : null}
          </DragOverlay>
          <div className="flex">
            <button className="btn" onClick={() => addFormField()}>
              Add
            </button>
            <button
              className="btn"
              onClick={() =>
                console.log({ header: header, fields: formFields })
              }
            >
              preview
            </button>
            <button
              className="btn"
              onClick={() => {
                setHeader(formData.header);
                setFormFields(formData.fields);
              }}
            >
              Load Data
            </button>
          </div>
        </div>
      </DndContext>
    </div>
  );
};

export default AdminForm;
