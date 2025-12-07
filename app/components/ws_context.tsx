"use client";
import { createContext, useContext, useEffect } from "react";
import WSManager from "../utils/ws";
import { Note } from "../interfaces/note_model";

type WSContextType = {
  subscribe: (callback: (data: { operation: string; note: Note }) => void) => void;
  unsubscribe: (callback: (data: { operation: string; note: Note }) => void) => void;
};

const WSContext = createContext<WSContextType | undefined>(undefined);

export const WSProvider = ({ children }: { children: React.ReactNode }) => {
  const ws = WSManager.getInstance();

  const subscribe = (callback: (data: { operation: string; note: Note }) => void) => {
    console.log("subscribe")
    ws.addListener(callback);
  };

  const unsubscribe = (callback: (data: { operation: string; note: Note }) => void) => {
    console.log("unsubscribe")
    ws.removeListener(callback);
  };

  return (
    <WSContext.Provider value={{ subscribe, unsubscribe }}>
      {children}
    </WSContext.Provider>
  );
};

export const useWS = () => {
  const context = useContext(WSContext);
  if (!context) {
    throw new Error("useWS must be used within a WSProvider");
  }
  return context;
};
