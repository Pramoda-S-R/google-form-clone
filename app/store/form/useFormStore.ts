// store/form/useFormStore.ts
import { create } from "zustand";
import { FormState } from "./form.types";
import { createFormSlice } from "./slices/formSlice";
import { createFieldSlice } from "./slices/fieldSlice";
import { createSectionSlice } from "./slices/sectionSlice";
import { immer } from "zustand/middleware/immer";
import { devtools } from "zustand/middleware";

export const useFormStore = create<FormState>()(
  devtools(
    immer((...a) => ({
      ...createFormSlice(...a),
      ...createFieldSlice(...a),
      ...createSectionSlice(...a),
    }))
  )
);
