import type { FC, PropsWithChildren } from 'react';
import { createContext, useContext, useState } from 'react';

export interface LogFileItemType {
  msg: string;
  rawMsg: unknown | unknown[];
  level: { severity: number; text: string };
  extension?: string | null;
  options?: unknown;
  timestamp: string;
  uuid: string;
}

export type LogFile = LogFileItemType[];

export interface LogFileContextState {
  logFile: LogFile | null;
  setLogFile: (logFile: LogFile | null) => void;
}

export const LogFileContext = createContext<LogFileContextState>({
  logFile: null,
  setLogFile: () => {},
});

export const useLogFile = (): LogFileContextState => {
  return useContext(LogFileContext);
};

const LogFileProvider: FC<PropsWithChildren> = ({ children }) => {
  const [logFile, setLogFile] = useState<LogFile | null>(null);

  return (
    <LogFileContext.Provider value={{ logFile, setLogFile }}>
      {children}
    </LogFileContext.Provider>
  );
};

export default LogFileProvider;
