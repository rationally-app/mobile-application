/* eslint-disable @typescript-eslint/no-empty-function */
import React, { createContext, FunctionComponent, useState } from "react";
import {
  AlertModal,
  AlertModalProp
} from "../components/AlertModal/AlertModal";

const defaultAlertProp: AlertModalProp = {
  alertType: "unknownType",
  title: "unknownTitle",
  description: "unknownDes",
  visible: false,
  onOk: () => {},
  onCancel: () => {},
  onExit: () => {}
};

// TODO: fix up the constant and enum later
export const AlertModalContext = createContext(
  (incomingState: AlertModalProp) => {}
);

export const AlertModalContextProvider: FunctionComponent = ({ children }) => {
  const [alertState, setAlertState] = useState<AlertModalProp>(
    defaultAlertProp
  );

  const showAlertModal = (incomingState: AlertModalProp): void =>
    setAlertState(incomingState);

  return (
    <AlertModalContext.Provider value={showAlertModal}>
      {children}
      <AlertModal
        alertType={alertState.alertType}
        title={alertState.title}
        description={alertState.description}
        visible={alertState.visible}
        onOk={alertState.onOk}
        onCancel={alertState.onCancel}
        onExit={() =>
          setAlertState(prev => {
            return { ...prev, visible: false };
          })
        }
      />
    </AlertModalContext.Provider>
  );
};
