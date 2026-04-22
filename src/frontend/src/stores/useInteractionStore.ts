import { create } from "zustand";
import type { InteractionRecord } from "../types";

interface InteractionStore {
  interactions: InteractionRecord[];
  selectedId: bigint | null;
  isLoading: boolean;
  setInteractions: (interactions: InteractionRecord[]) => void;
  setSelectedId: (id: bigint | null) => void;
  addInteraction: (interaction: InteractionRecord) => void;
  updateInteraction: (id: bigint, updated: Partial<InteractionRecord>) => void;
  setLoading: (loading: boolean) => void;
}

export const useInteractionStore = create<InteractionStore>((set) => ({
  interactions: [],
  selectedId: null,
  isLoading: false,

  setInteractions: (interactions) => set({ interactions }),

  setSelectedId: (id) => set({ selectedId: id }),

  addInteraction: (interaction) =>
    set((state) => ({ interactions: [interaction, ...state.interactions] })),

  updateInteraction: (id, updated) =>
    set((state) => ({
      interactions: state.interactions.map((item) =>
        item.id === id ? { ...item, ...updated } : item,
      ),
    })),

  setLoading: (loading) => set({ isLoading: loading }),
}));
