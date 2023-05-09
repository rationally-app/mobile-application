import React, {
  createContext,
  FunctionComponent,
  useState,
  Dispatch,
  SetStateAction,
  ReactNode,
} from "react";
import { Feather } from "@expo/vector-icons";

type MessageContent = {
  title: string;
  description?: string;
  featherIconName?: keyof typeof Feather.glyphMap;
  action?: {
    callback: () => void;
    label: string;
  };
};

export const ImportantMessageContentContext =
  createContext<MessageContent | null>(null);
export const ImportantMessageSetterContext = createContext<
  Dispatch<SetStateAction<MessageContent | null>>
  // eslint-disable-next-line @typescript-eslint/no-empty-function
>(() => {});

export const ImportantMessageContextProvider: FunctionComponent<{
  children?: ReactNode | undefined;
}> = ({ children }) => {
  const [message, setMessage] = useState<MessageContent | null>(null);

  return (
    <ImportantMessageContentContext.Provider value={message}>
      <ImportantMessageSetterContext.Provider value={setMessage}>
        {children}
      </ImportantMessageSetterContext.Provider>
    </ImportantMessageContentContext.Provider>
  );
};
