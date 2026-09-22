"use client";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import {
  cleanDraft,
  draftSchema,
  emptyDraft,
  type BuilderDraft,
} from "@/lib/builder";

type BuilderState = {
  draft: BuilderDraft;
  update: (draft: BuilderDraft) => void;
  reset: () => void;
};
// Storage failures leave the in-memory draft usable and show a persistent warning.
let storageFailed = false;
export const hasStorageError = () => storageFailed;
const reportStorageError = () => {
  storageFailed = true;
  window.dispatchEvent(new Event("roam-storage-error"));
};
export const useBuilderStore = create<BuilderState>()(
  persist(
    (set) => ({
      draft: emptyDraft(),
      update: (draft) =>
        set({
          draft: cleanDraft({ ...draft, updatedAt: new Date().toISOString() }),
        }),
      reset: () => set({ draft: emptyDraft() }),
    }),
    {
      name: "roam-builder-v1",
      version: 1,
      skipHydration: true,
      onRehydrateStorage: () => (_state, error) => {
        if (error) reportStorageError();
      },
      partialize: (s) => ({ draft: s.draft }),
      storage: createJSONStorage(() => ({
        getItem: (key) => {
          try {
            return localStorage.getItem(key);
          } catch {
            reportStorageError();
            return null;
          }
        },
        setItem: (key, value) => {
          try {
            localStorage.setItem(key, value);
          } catch {
            reportStorageError();
          }
        },
        removeItem: (key) => {
          try {
            localStorage.removeItem(key);
          } catch {
            reportStorageError();
          }
        },
      })),
      merge: (persisted, current) => {
        const result = draftSchema.safeParse(
          (persisted as { draft?: unknown })?.draft,
        );
        return {
          ...current,
          draft: result.success ? cleanDraft(result.data) : emptyDraft(),
        };
      },
    },
  ),
);
