import { createContext, useContext, useMemo, useState } from "react";

const CreateModalContext = createContext(null);

export function CreateModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(
    () => ({
      isOpen,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }),
    [isOpen]
  );

  return <CreateModalContext.Provider value={value}>{children}</CreateModalContext.Provider>;
}

export function useCreateModal() {
  const context = useContext(CreateModalContext);
  if (!context) throw new Error("useCreateModal must be used within CreateModalProvider");
  return context;
}
