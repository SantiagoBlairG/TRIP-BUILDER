"use client";
import { useEffect, useState } from "react";
import { useBuilderStore, hasStorageError } from "@/stores/builder-store";

export function useBuilderHydration() {
  const [ready, setReady] = useState(false);
  const [storageError, setStorageError] = useState(false);
  useEffect(() => {
    const failed = () => setStorageError(true);
    window.addEventListener("roam-storage-error", failed);
    Promise.resolve(
      useBuilderStore.persist.hasHydrated()
        ? undefined
        : useBuilderStore.persist.rehydrate(),
    )
      .catch(failed)
      .finally(() => {
        setStorageError(hasStorageError());
        setReady(true);
      });
    return () => window.removeEventListener("roam-storage-error", failed);
  }, []);
  return { ready, storageError };
}
