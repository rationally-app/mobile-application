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

export enum WARNING_MESSAGE {
  PAYMENT_COLLECTION = "This action cannot be undone. Proceed only when payment has been collected."
}

export enum ERROR_MESSAGE {
  DUPLICATE_IDENTIFIER_INPUT = "Enter unique code details.",
  DUPLICATE_POD_INPUT = "Scan another item that is not tagged to any ID number.",
  INVALID_IDENTIFIER_INPUT = "Enter or scan valid code details.",
  MISSING_IDENTIFIER_INPUT = "Enter or scan code details.",
  INVALID_VOUCHER_INPUT = "Enter valid voucher code details.",
  MISSING_VOUCHER_INPUT = "Enter voucher code details.",
  INVALID_POD_INPUT = "Scan valid device code.",
  MISSING_POD_INPUT = "Scan device code.",
  INVALID_PHONE_NUMBER = "Enter valid contact number.",
  INVALID_COUNTRY_CODE = "Enter valid country code.",
  INVALID_PHONE_AND_COUNTRY_CODE = "Enter valid country code and contact number.",
  MISSING_SELECTION = "Select at least one item to checkout.",
  AUTH_FAILURE_INVALID_TOKEN = "Get a new QR code from your in-charge.",
  AUTH_FAILURE_INVALID_FORMAT = "Scan QR code again or get a new QR code from your in-charge.",
  CAMPAIGN_CONFIG_ERROR = "We are currently facing connectivity issues. Try again later or contact your in-charge if the problem persists.",
  INSUFFICIENT_QUOTA = "Insufficient quota.",
  INVALID_QUANTITY = "Invalid quantity.",
  INVALID_CATEGORY = "Category does not exist.",
  INVALID_ID = "Enter or scan valid ID number.",
  DUPLICATE_ID = "Enter or scan a different ID number.",
  QUOTA_ERROR = "We are currently facing connectivity issues. Try again later or contact your in-charge if the problem persists.",
  SERVER_ERROR = "We are currently facing server issues. Try again later or contact your in-charge if the problem persists.",
  OTP_ERROR = "Enter OTP again.",
  LAST_OTP_ERROR = "Enter OTP again. After 1 more invalid OTP entry, you will have to wait 3 minutes before trying again.",
  AUTH_FAILURE_TAKEN_TOKEN = "Get a new QR code that is not tagged to any contact number from your in-charge.",
  OTP_EXPIRED = "Get a new OTP and try again.",
  LOGIN_ERROR = "We are currently facing login issues. Get a new QR code from your in-charge.",
  PAST_TRANSACTIONS_ERROR = "We are currently facing server issues. Try again later or contact your in-charge if the problem persists."
}

const defaultAlertProps: AlertModalProps = {
  alertType: "ERROR",
  title: "",
  buttonTexts: {
    primaryActionText: "OK"
  },
  visible: false,
  onOk: () => {},
  onCancel: () => {},
  onExit: () => {}
};

export const defaultWarningProps: AlertModalProps = {
  alertType: "WARN",
  title: "",
  buttonTexts: {
    primaryActionText: "Back",
    secondaryActionText: "Confirm"
  },
  visible: false,
  onOk: () => {},
  onCancel: () => {},
  onExit: () => {}
};

export const defaultConfirmationProps: AlertModalProps = {
  alertType: "CONFIRM",
  title: "",
  buttonTexts: {
    primaryActionText: "Back",
    secondaryActionText: "Confirm"
  },
  visible: false,
  onOk: () => {},
  onCancel: () => {},
  onExit: () => {}
};

export const incompleteEntryAlertProps: AlertModalProps = {
  ...defaultAlertProps,
  title: "Incomplete entry",
  visible: true
};

export const invalidInputAlertProps: AlertModalProps = {
  ...defaultAlertProps,
  title: "Invalid input",
  visible: true
};

export const wrongFormatAlertProps: AlertModalProps = {
  ...defaultAlertProps,
  title: "Wrong format",
  visible: true
};

export const duplicateAlertProps: AlertModalProps = {
  ...defaultAlertProps,
  title: "Already used",
  visible: true
};

export const systemAlertProps: AlertModalProps = {
  ...defaultAlertProps,
  title: "System error",
  visible: true
};

export const disabledAccessAlertProps: AlertModalProps = {
  ...defaultAlertProps,
  title: "Disabled access",
  visible: true
};

export const expiredAlertProps: AlertModalProps = {
  ...defaultAlertProps,
  title: "Expired",
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
    defaultAlertProps
  );

  const showAlert: AlertModalContext["showAlert"] = useCallback(
    (props: AlertModalProps) => {
      setAlertProps(props);
    },
    []
  );
  const clearAlert: AlertModalContext["clearAlert"] = useCallback(() => {
    setAlertProps(defaultAlertProps);
  }, []);

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
