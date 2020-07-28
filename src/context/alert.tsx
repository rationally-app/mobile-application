/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, FunctionComponent, useState } from "react";
import {
  AlertModal,
  AlertModalProp
} from "../components/AlertModal/AlertModal";

const defaultAlertProp: AlertModalProp = {
  alertType: "ERROR",
  title: "unknownTitle",
  description: "unknownDes",
  visible: false,
  onOk: () => {},
  onCancel: () => {},
  onExit: () => {}
};

interface AlertModalContext {
  alertProps: AlertModalProp;
  setAlert: (props: AlertModalProp) => void;
  clearAlert: () => void;
}

export const AlertModalContext = createContext<AlertModalContext>({
  alertProps: defaultAlertProp,
  setAlert: () => null,
  clearAlert: () => null
});

export const AlertModalContextProvider: FunctionComponent = ({ children }) => {
  const [alertProps, setAlertProps] = useState<AlertModalContext["alertProps"]>(
    defaultAlertProp
  );

  const setAlert: AlertModalContext["setAlert"] = (props: AlertModalProp) => {
    setAlertProps(props);
  };

  const clearAlert: AlertModalContext["clearAlert"] = () => {
    setAlertProps(defaultAlertProp);
  };

  return (
    <AlertModalContext.Provider
      value={{
        alertProps,
        setAlert,
        clearAlert
      }}
    >
      {children}
      <AlertModal
        alertType={alertProps.alertType}
        title={alertProps.title}
        description={alertProps.description}
        visible={alertProps.visible}
        onOk={alertProps.onOk}
        onCancel={alertProps.onCancel}
        onExit={clearAlert}
      />
    </AlertModalContext.Provider>
  );
};
