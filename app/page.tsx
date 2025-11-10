"use client";
import React from "react";
import { useFormStore } from "./store/form/useFormStore";
import { generateId } from "@/utils";

const Page = () => {
  const { form, addField, addSection } = useFormStore((s) => s);
  return (
    <div className="max-w-3xl mx-auto flex flex-col gap-2 py-2">
      <h1 className="text-2xl font-bold">{form.header.title}</h1>
      <button
        onClick={() =>
          addSection({
            id: generateId(),
            title: "Section1",
            fieldOrder: [],
          })
        }
      >
        Add
      </button>
      <button
        onClick={() =>
          addField("e4608755", {
            id: generateId(),
            config: {
              type: "short_answer",
              inputType: "text",
            },
          })
        }
      >
        Add
      </button>
    </div>
  );
};

export default Page;
