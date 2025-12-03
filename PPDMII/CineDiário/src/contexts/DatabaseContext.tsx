import React, { createContext, useContext, useState, ReactNode } from 'react';

interface DatabaseContextType {
  selectedDatabase: 'sqlite' | 'mongodb' | null;
  setSelectedDatabase: (db: 'sqlite' | 'mongodb') => void;
}

export const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

export const useDatabaseContext = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabaseContext must be used within DatabaseProvider');
  }
  return context;
};

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider = ({ children }: DatabaseProviderProps) => {
  const [selectedDatabase, setSelectedDatabase] = useState<'sqlite' | 'mongodb' | null>(null);

  return (
    <DatabaseContext.Provider value={{ selectedDatabase, setSelectedDatabase }}>
      {children}
    </DatabaseContext.Provider>
  );
};
