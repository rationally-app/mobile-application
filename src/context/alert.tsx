/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, FunctionComponent, useState } from "react";
import {
  AlertModal,
  AlertModalProps
} from "../components/AlertModal/AlertModal";

const defaultAlertProp: AlertModalProps = {
  alertType: "ERROR",
  title: "",
  description: "",
  buttonTexts: {
    primaryActionText: "OK"
  },
  visible: false,
  onOk: () => {},
  onCancel: () => {},
  onExit: () => {}
};

interface AlertModalContext {
  showAlert: (props: AlertModalProps) => void;
  clearAlert: () => void;
}

export const AlertModalContext = createContext<AlertModalContext>({
  showAlert: () => null,
  clearAlert: () => null
});

export const AlertModalContextProvider: FunctionComponent = ({ children }) => {
  const [alertProps, setAlertProps] = useState<AlertModalProps>(
    defaultAlertProp
  );

  const showAlert: AlertModalContext["showAlert"] = (
    props: AlertModalProps
  ) => {
    setAlertProps(props);
  };

  const clearAlert: AlertModalContext["clearAlert"] = () => {
    setAlertProps(defaultAlertProp);
  };

  return (
    <AlertModalContext.Provider
      value={{
        showAlert,
        clearAlert
      }}
    >
      {children}
      <AlertModal {...alertProps} onExit={clearAlert} />
    </AlertModalContext.Provider>
  );
};
