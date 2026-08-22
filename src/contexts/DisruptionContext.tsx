"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export type DisruptionLevel = "NONE" | "HORMUZ" | "RED_SEA";

interface DisruptionContextValue {
  disruption: DisruptionLevel;
  setDisruption: (level: DisruptionLevel) => void;
}

const DisruptionContext = createContext<DisruptionContextValue>({
  disruption: "NONE",
  setDisruption: () => {},
});

export function DisruptionProvider({ children }: { children: ReactNode }) {
  const [disruption, setDisruption] = useState<DisruptionLevel>("NONE");
  return (
    <DisruptionContext.Provider value={{ disruption, setDisruption }}>
      {children}
    </DisruptionContext.Provider>
  );
}

export function useDisruption() {
  return useContext(DisruptionContext);
}
