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

// TODO: Where should we put this?
export enum WARNING_MESSAGE {
  PAYMENT_COLLECTION = "This action cannot be undone. Proceed only when payment has been collected."
}

// TODO: Where should we put this?
export enum ERROR_MESSAGE {
  DUPLICATE_IDENTIFIER_INPUT = "Enter or scan a different code.",
  DUPLICATE_POD_INPUT = "Scan another item that is not tagged to any ID number.",
  INVALID_IDENTIFIER_INPUT = "Enter or scan a valid code.",
  MISSING_IDENTIFIER_INPUT = "Enter or scan a code.",
  INVALID_VOUCHER_INPUT = "Enter a valid voucher code.",
  MISSING_VOUCHER_INPUT = "Enter a voucher code.",
  INVALID_POD_INPUT = "Scan a valid device code.",
  MISSING_POD_INPUT = "Scan a device code.",
  INVALID_PHONE_NUMBER = "Enter a valid contact number.",
  INVALID_COUNTRY_CODE = "Enter a valid country code.",
  INVALID_PHONE_AND_COUNTRY_CODE = "Enter a valid country code and contact number.",
  MISSING_SELECTION = "Select at least one item to checkout.",
  AUTH_FAILURE_INVALID_TOKEN = "Get a new QR code from your in-charge.",
  AUTH_FAILURE_INVALID_FORMAT = "Scan QR code again or get a new QR code from your in-charge.",
  CAMPAIGN_CONFIG_ERROR = "We are currently facing connectivity issues. Try again later or contact your in-charge if the problem persists.",
  INSUFFICIENT_QUOTA = "Insufficient quota.",
  INVALID_QUANTITY = "Invalid quantity.",
  INVALID_CATEGORY = "Category does not exist.",
  INVALID_ID = "Enter or scan a valid ID number.",
  DUPLICATE_ID = "Enter or scan a different ID number.",
  QUOTA_ERROR = "We are currently facing connectivity issues. Try again later or contact your in-charge if the problem persists.",
  SERVER_ERROR = "We are currently facing server issues. Contact your in-charge if the problem persists.",
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

interface AlertModalContext {
  showConfirmationAlert: (props: {
    title: string;
    description?: string;
    buttonTexts: { primaryActionText: string; secondaryActionText: string };
    onOk: () => void;
    onCancel?: () => void;
  }) => void;
  showErrorAlert: (props: {
    title: string;
    description?: string;
    onOk?: () => void;
  }) => void;
  showWarnAlert: (props: {
    title: string;
    buttonTexts: { primaryActionText: string; secondaryActionText: string };
    onOk: () => void;
  }) => void;
  clearAlert: () => void;
}

export const AlertModalContext = createContext<AlertModalContext>({
  showConfirmationAlert: () => null,
  showErrorAlert: () => null,
  showWarnAlert: () => null,
  clearAlert: () => null
});

export const AlertModalContextProvider: FunctionComponent = ({ children }) => {
  const [alertProps, setAlertProps] = useState<AlertModalProps>(
    defaultAlertProps
  );

  const showAlert: (props: AlertModalProps) => void = useCallback(
    (props: AlertModalProps) => {
      setAlertProps(props);
    },
    []
  );

  // TODO: To check that all calls use translated copies
  const showConfirmationAlert = (props: {
    title: string;
    description?: string;
    buttonTexts: { primaryActionText: string; secondaryActionText: string };
    onOk: () => void;
    onCancel?: () => void;
  }): void => {
    showAlert({
      alertType: "CONFIRM",
      title: props.title,
      ...(!!props.description ? { description: props.description } : {}),
      buttonTexts: props.buttonTexts,
      visible: true,
      onOk: props.onOk,
      ...(!!props.onCancel ? { onCancel: props.onCancel } : {}),
      onExit: () => {}
    });
  };

  // TODO: To check that all calls use translated copies
  const showErrorAlert = (props: {
    title: string;
    description?: string;
    onOk?: () => void;
  }): void => {
    showAlert({
      alertType: "ERROR",
      title: props.title,
      ...(!!props.description ? { description: props.description } : {}),
      buttonTexts: {
        primaryActionText: "OK"
      },
      visible: true,
      onOk: !!props.onOk ? props.onOk : () => {},
      onCancel: () => {},
      onExit: () => {}
    });
  };

  // TODO: To check that all calls use translated copies
  const showWarnAlert = (props: {
    title: string;
    buttonTexts: { primaryActionText: string; secondaryActionText: string };
    onOk: () => void;
  }): void => {
    showAlert({
      alertType: "WARN",
      title: props.title,
      buttonTexts: props.buttonTexts,
      visible: false,
      onOk: props.onOk,
      onCancel: () => {},
      onExit: () => {}
    });
  };

  // TODO: maybe can toggle visible to false?
  const clearAlert: AlertModalContext["clearAlert"] = useCallback(() => {
    setAlertProps(defaultAlertProps);
  }, []);

  return (
    <AlertModalContext.Provider
      value={{
        showConfirmationAlert,
        showErrorAlert,
        showWarnAlert,
        clearAlert
      }}
    >
      {children}
      <AlertModal {...alertProps} onExit={clearAlert} />
    </AlertModalContext.Provider>
  );
};
