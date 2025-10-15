import { createContext, useContext, useState } from 'react';

type OutputFormat = 'emoji' | 'binary' | 'alphanumeric' | 'hex';

interface OutputFormatContextType {
  outputFormat: OutputFormat;
  setOutputFormat: (format: OutputFormat) => void;
}

const OutputFormatContext = createContext<OutputFormatContextType | undefined>(undefined);

export function OutputFormatProvider({ children }: { children: React.ReactNode }) {
  const [outputFormat, setOutputFormat] = useState<OutputFormat>('emoji');

  return (
    <OutputFormatContext.Provider value={{ outputFormat, setOutputFormat }}>
      {children}
    </OutputFormatContext.Provider>
  );
}

export function useOutputFormat() {
  const context = useContext(OutputFormatContext);
  if (!context) {
    throw new Error('useOutputFormat must be used within OutputFormatProvider');
  }
  return context;
}
