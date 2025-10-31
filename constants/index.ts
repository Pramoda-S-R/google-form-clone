import { FormField, FormObj } from "@/types";
import { generateId } from "@/utils";

const shortAnswer: FormField = {
  id: "0",
  required: true,
  config: {
    type: "short_answer",
  },
  title: "Short Answer",
  description: "Short answer description",
};

const longAnswer: FormField = {
  id: "1",
  required: false,
  config: {
    type: "long_answer",
  },
  title: "Long Answer",
  description: "Long answer description",
};

const multipleChoice: FormField = {
  id: "2",
  required: true,
  config: {
    type: "multiple_choice",
    options: [
      {
        id: "0",
        option: "Option 1",
        other: false,
      },
      {
        id: "1",
        option: "Option 2",
        other: false,
      },
      {
        id: "2",
        option: "Option 3",
        other: false,
      },
      {
        id: "3",
        option: "Other",
        other: true,
      },
    ],
  },
  title: "Multiple Choice",
  description: "Multiple choice description",
};

const checkbox: FormField = {
  id: "3",
  config: {
    type: "checkbox",
    options: [
      {
        id: "0",
        option: "Option 1",
        other: false,
      },
      {
        id: "1",
        option: "Option 2",
        other: false,
      },
      {
        id: "2",
        option: "Option 3",
        other: false,
      },
      {
        id: "3",
        option: "Other",
        other: true,
      },
    ],
  },
  title: "Checkbox",
  description: "Checkbox description",
};

const dropdown: FormField = {
  id: "4",
  config: {
    type: "dropdown",
    options: [
      {
        id: "0",
        option: "Option 1",
      },
      {
        id: "1",
        option: "Option 2",
      },
      {
        id: "2",
        option: "Option 3",
      },
    ],
    shuffle: true,
  },
  title: "Dropdown",
  description: "Dropdown description",
};

const linearScale: FormField = {
  id: "5",
  config: {
    type: "linear_scale",
    start: 1,
    count: 5,
  },
  title: "Linear Scale",
  description: "Linear scale description",
};

const rating: FormField = {
  id: "6",
  config: {
    type: "rating",
    count: 5,
    stroke: "orange",
    fill: "gold",
    icon: "star",
  },
  title: "Rating",
  description: "Rating description",
};

const multiChoiceGrid: FormField = {
  id: "7",
  config: {
    type: "multiple_choice_grid",
    table: {
      rows: [
        {
          id: "0",
          option: "Option 1",
        },
        {
          id: "1",
          option: "Option 2",
        },
        {
          id: "2",
          option: "Option 3",
        },
      ],
      columns: [
        {
          id: "0",
          option: "Option 1",
        },
        {
          id: "1",
          option: "Option 2",
        },
        {
          id: "2",
          option: "Option 3",
        },
      ],
    },
  },
  title: "Multiple Choice Grid",
  description: "Multiple choice grid description",
};

const checkboxGrid: FormField = {
  id: "8",
  config: {
    type: "checkbox_grid",
    table: {
      rows: [
        {
          id: "0",
          option: "Option 1",
        },
        {
          id: "1",
          option: "Option 2",
        },
        {
          id: "2",
          option: "Option 3",
        },
      ],
      columns: [
        {
          id: "0",
          option: "Option 1",
        },
        {
          id: "1",
          option: "Option 2",
        },
        {
          id: "2",
          option: "Option 3",
        },
      ],
    },
    limitToOnePerColumn: true,
    shuffle: true,
  },
  title: "Checkbox Grid",
  description: "Checkbox grid description",
};

const date: FormField = {
  id: "9",
  config: {
    type: "date",
    includeTime: true,
  },
  title: "Date",
  description: "Date description",
};

const time: FormField = {
  id: "10",
  config: {
    type: "time",
    kind: "duration",
  },
  title: "Time",
  description: "Time description",
};

const fileUpload: FormField = {
  id: "11",
  config: {
    type: "file_upload",
    acceptedFileTypes: ["image/jpeg", "image/png", "image/gif"],
    maxFileSize: 5000000,
  },
  title: "File Upload",
  description: "File upload description",
};

export const formData: FormObj = {
  id: "nanogram-feedback-form",
  header: {
    title: "Nanogram Feedback Form",
    description:
      "We constantly want to make nanogram a better club for everyone. We would like to know your opinion.",
  },
  fields: [
    shortAnswer,
    longAnswer,
    multipleChoice,
    checkbox,
    dropdown,
    linearScale,
    rating,
    multiChoiceGrid,
    checkboxGrid,
    date,
    time,
    fileUpload,
  ],
};

export const createDefaultConfig = (
  type: FormField["config"]["type"]
): FormField["config"] => {
  switch (type) {
    case "short_answer":
      return { type, inputType: "text" };
    case "long_answer":
      return { type };
    case "multiple_choice":
      return {
        type,
        options: [{ id: generateId(), option: "Option 1", other: false }],
      };
    case "checkbox":
      return {
        type,
        options: [{ id: generateId(), option: "Option 1", other: false }],
      };
    case "dropdown":
      return {
        type,
        options: [{ id: generateId(), option: "Option 1" }],
      };
    case "file_upload":
      return { type, acceptedFileTypes: [], maxFileSize: 0 };
    case "linear_scale":
      return { type, start: 1, count: 5 };
    case "rating":
      return { type, count: 5, stroke: "orange", fill: "gold", icon: "star" };
    case "multiple_choice_grid":
      return {
        type,
        table: {
          rows: [{ id: generateId(), option: "Row 1" }],
          columns: [{ id: generateId(), option: "Column 1" }],
        },
      };
    case "checkbox_grid":
      return {
        type,
        table: {
          rows: [{ id: generateId(), option: "Row 1" }],
          columns: [{ id: generateId(), option: "Column 1" }],
        },
      };
    case "date":
      return { type };
    case "time":
      return { type, kind: "time" };
  }
};
