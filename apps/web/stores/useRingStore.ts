import { create, StateCreator } from "zustand";
import { persist, createJSONStorage, PersistOptions } from "zustand/middleware";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { type Ring } from "./types";

interface RingState {
  rings: Ring[];
  addRing: (name: string, memberPublicKeys: string[]) => Ring;
  updateRing: (id: string, updates: Partial<Omit<Ring, "id">>) => void;
  removeRing: (id: string) => void;
  getRingById: (id: string) => Ring | undefined;
}

type RingPersist = (
  config: StateCreator<RingState>,
  options: PersistOptions<RingState>,
) => StateCreator<RingState>;

export const useRingStore = create<RingState>(
  (persist as RingPersist)(
    (set, get) => ({
      rings: [],

      addRing: (name: string, memberPublicKeys: string[]) => {
        const newRing: Ring = {
          id: uuidv4(),
          name,
          memberPublicKeys,
        };
        set((state: RingState) => ({ rings: [...state.rings, newRing] }));
        return newRing;
      },

      updateRing: (id: string, updates: Partial<Omit<Ring, "id">>) => {
        set((state: RingState) => ({
          rings: state.rings.map((ring) =>
            ring.id === id ? { ...ring, ...updates } : ring,
          ),
        }));
      },

      removeRing: (id: string) => {
        set((state: RingState) => ({
          rings: state.rings.filter((ring) => ring.id !== id),
        }));
      },

      getRingById: (id: string) => {
        return get().rings.find((ring) => ring.id === id);
      },
    }),
    {
      name: "ringable-rings-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
