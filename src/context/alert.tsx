/* eslint-disable @typescript-eslint/no-empty-function */
import React, {
  createContext,
  FunctionComponent,
  useState,
  useCallback
} from "react";
import {
  AlertModal,
  AlertModalProps
} from "../components/AlertModal/AlertModal";

export const ERROR_MESSAGE = {
  DUPLICATE_IDENTIFIER_INPUT: "Scan item again",
  DUPLICATE_POD_INPUT:
    "Scan another item that is not tagged to any contact number",
  INVALID_IDENTIFIER_INPUT: "Enter your voucher code again",
  MISSING_IDENTIFIER_INPUT: "Enter your voucher code",
  INVALID_POD_INPUT: "Scan your device code again",
  MISSING_POD_INPUT: "Scan your device code",
  INVALID_PHONE_NUMBER: "Enter your contact number again",
  MISSING_SELECTION: "Select at least one item to checkout",
  AUTH_FAILURE_INVALID_TOKEN:
    "Scan QR code again or get a new QR code from your in-charge",
  AUTH_FAILURE_EXPIRED_TOKEN:
    "We could not find a validity period. Get a new QR code from your in-charge",
  ENV_VERSION_ERROR:
    "Encountered an issue obtaining environment information. We've noted this down and are looking into it!",
  INSUFFICIENT_QUOTA: "Insufficient quota",
  INVALID_QUANTITY: "Invalid quantity",
  INVALID_CATEGORY: "Category does not exist",
  SERVER_ERROR:
    "We are currently facing server issues. Try again later or contact your in-charge if the problem persists."
};

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

export const defaultWarningProp: AlertModalProps = {
  alertType: "WARN",
  title: "",
  description: "",
  buttonTexts: {
    primaryActionText: "Back",
    secondaryActionText: "Confirm"
  },
  visible: false,
  onOk: () => {},
  onCancel: () => {},
  onExit: () => {}
};

export const defaultConfirmationProp: AlertModalProps = {
  alertType: "CONFIRM",
  title: "",
  description: "",
  buttonTexts: {
    primaryActionText: "Back",
    secondaryActionText: "Confirm"
  },
  visible: false,
  onOk: () => {},
  onCancel: () => {},
  onExit: () => {}
};

export const incompleteEntryAlertProp: AlertModalProps = {
  ...defaultAlertProp,
  title: "Incomplete Entry",
  visible: true
};

export const wrongFormatAlertProp: AlertModalProps = {
  ...defaultAlertProp,
  title: "Wrong format",
  visible: true
};

export const duplicateAlertProp: AlertModalProps = {
  ...defaultAlertProp,
  title: "Already Used",
  visible: true
};

export const systemAlertProp: AlertModalProps = {
  ...defaultAlertProp,
  title: "System Error",
  visible: true
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

  const showAlert: AlertModalContext["showAlert"] = useCallback(
    (props: AlertModalProps) => {
      setAlertProps(props);
    },
    []
  );

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
