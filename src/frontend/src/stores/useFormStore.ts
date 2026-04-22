import { create } from "zustand";
import type { ExtractedData } from "../types";

export interface FormFields {
  hcpName: string;
  interactionType: string;
  datetime: string;
  topics: string;
  materialsShared: string;
  samples: string;
  sentiment: string;
  outcomes: string;
  followUp: string;
}

interface FormStore extends FormFields {
  setField: <K extends keyof FormFields>(key: K, value: FormFields[K]) => void;
  resetForm: () => void;
  setFromExtracted: (data: ExtractedData) => void;
}

const defaultFields: FormFields = {
  hcpName: "",
  interactionType: "",
  datetime: "",
  topics: "",
  materialsShared: "",
  samples: "0",
  sentiment: "",
  outcomes: "",
  followUp: "",
};

export const useFormStore = create<FormStore>((set) => ({
  ...defaultFields,

  setField: (key, value) => set((state) => ({ ...state, [key]: value })),

  resetForm: () => set({ ...defaultFields }),

  setFromExtracted: (data: ExtractedData) =>
    set((state) => ({
      hcpName: data.hcpName ?? state.hcpName,
      interactionType: data.interactionType ?? state.interactionType,
      datetime: data.date ?? state.datetime,
      topics: data.topics ?? state.topics,
      materialsShared: data.materials ?? state.materialsShared,
      samples: data.samples ?? state.samples,
      sentiment: data.sentiment ?? state.sentiment,
      outcomes: data.outcomes ?? state.outcomes,
      followUp: data.followUp ?? state.followUp,
    })),
}));
