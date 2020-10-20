import React, {
  createContext,
  FunctionComponent,
  useState,
  Dispatch,
  SetStateAction,
} from "react";

type MessageContent = {
  title: string;
  description?: string;
  featherIconName?: string;
  action?: {
    callback: () => void;
    label: string;
  };
};

export const ImportantMessageContentContext = createContext<MessageContent | null>(
  null
);
export const ImportantMessageSetterContext = createContext<
  Dispatch<SetStateAction<MessageContent | null>>
  // eslint-disable-next-line @typescript-eslint/no-empty-function
>(() => {});

export const ImportantMessageContextProvider: FunctionComponent = ({
  children,
}) => {
  const [message, setMessage] = useState<MessageContent | null>(null);

  return (
    <ImportantMessageContentContext.Provider value={message}>
      <ImportantMessageSetterContext.Provider value={setMessage}>
        {children}
      </ImportantMessageSetterContext.Provider>
    </ImportantMessageContentContext.Provider>
  );
};
