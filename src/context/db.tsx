import React, {
  createContext,
  useContext,
  useState,
  FunctionComponent
} from "react";
import { Database } from "../types";

interface DbContext {
  db?: Database;
  setDb?: (db: Database) => void;
}

export const DbContext = createContext<DbContext>({
  db: undefined,
  setDb: undefined
});

export const useDbContext = (): DbContext => useContext<DbContext>(DbContext);

export interface DbContextProviderProps {
  children: object;
}

export const DbContextProvider: FunctionComponent<DbContextProviderProps> = ({
  children
}: DbContextProviderProps) => {
  const [db, setDb] = useState();
  return (
    <DbContext.Provider value={{ db, setDb }}>{children}</DbContext.Provider>
  );
};
