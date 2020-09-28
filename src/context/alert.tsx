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
import i18n from "i18n-js";

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
  PAST_TRANSACTIONS_ERROR = "We are currently facing server issues. Try again later or contact your in-charge if the problem persists.",
  VALIDATE_INPUT_REGEX_ERROR = "Please check that the ID is in the correct format"
}

const errorNameToTranslationKeyMappings: Record<string, string> = {
  CampaignConfigError: "systemErrorConnectivityIssues",
  SessionError: "expiredQR",
  PastTransactionError: "systemErrorServerIssues",
  QuotaError: "systemErrorConnectivityIssues",
  OTPWrongError: "invalidInputOTP",
  OTPWrongErrorLastTry: "invalidInputOTPOneMoreInvalid",
  OTPExpiredError: "expiredOTP",
  LoginLockedError: "disabledAccess",
  LoginError: "systemErrorLoginIssue",
  AuthTakenError: "alreadyUsedQRCode",
  AuthExpiredError: "expiredQR",
  AuthNotFoundError: "expiredQR",
  AuthInvalidError: "wrongFormatQRScanAgain"
};

const getTranslationKeyFromError = (error: Error): string => {
  return (
    errorNameToTranslationKeyMappings[error.name] ??
    getTranslationKeyFromErrorMessage(error.message)
  );
};

const errorMessageToTranslationKeyMappings: Record<string, string> = {
  [ERROR_MESSAGE.DUPLICATE_IDENTIFIER_INPUT]: "alreadyUsedCode",
  [ERROR_MESSAGE.DUPLICATE_POD_INPUT]: "alreadyUsedItem",
  [ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT]: "wrongFormatCode",
  [ERROR_MESSAGE.MISSING_IDENTIFIER_INPUT]: "incompleteEntryCode",
  [ERROR_MESSAGE.MISSING_VOUCHER_INPUT]: "incompleteEntryVoucherCode",
  [ERROR_MESSAGE.INVALID_POD_INPUT]: "wrongFormatNotValidDeviceCode",
  [ERROR_MESSAGE.MISSING_POD_INPUT]: "incompleteEntryScanDeviceCode",
  [ERROR_MESSAGE.INVALID_PHONE_NUMBER]: "wrongFormatContactNumber",
  [ERROR_MESSAGE.INVALID_COUNTRY_CODE]: "wrongFormatCountryCode",
  [ERROR_MESSAGE.INVALID_PHONE_AND_COUNTRY_CODE]:
    "wrongFormatCountryCodePhoneNumber",
  [ERROR_MESSAGE.MISSING_SELECTION]: "incompleteEntry",
  [ERROR_MESSAGE.AUTH_FAILURE_INVALID_TOKEN]: "expiredQR",
  [ERROR_MESSAGE.AUTH_FAILURE_INVALID_FORMAT]: "invalidInputQR",
  [ERROR_MESSAGE.CAMPAIGN_CONFIG_ERROR]: "systemErrorConnectivityIssues",
  [ERROR_MESSAGE.INSUFFICIENT_QUOTA]: "insufficientQuota",
  [ERROR_MESSAGE.INVALID_QUANTITY]: "invalidQuantity",
  [ERROR_MESSAGE.INVALID_CATEGORY]: "categoryDoesNotExist",
  [ERROR_MESSAGE.INVALID_ID]: "invalidInputIDNumber",
  [ERROR_MESSAGE.DUPLICATE_ID]: "alreadyUsedDifferentIDNumber",
  [ERROR_MESSAGE.QUOTA_ERROR]: "systemErrorConnectivityIssues",
  [ERROR_MESSAGE.SERVER_ERROR]: "systemErrorServerIssues",
  [ERROR_MESSAGE.OTP_ERROR]: "invalidInputOTP",
  [ERROR_MESSAGE.LAST_OTP_ERROR]: "invalidInputOTPOneMoreInvalid",
  [ERROR_MESSAGE.AUTH_FAILURE_TAKEN_TOKEN]: "alreadyUsedQRCode",
  [ERROR_MESSAGE.OTP_EXPIRED]: "expiredOTP",
  [ERROR_MESSAGE.LOGIN_ERROR]: "systemErrorLoginIssue",
  [ERROR_MESSAGE.PAST_TRANSACTIONS_ERROR]: "systemErrorServerIssues",
  [WARNING_MESSAGE.PAYMENT_COLLECTION]: "paymentCollected",
  [ERROR_MESSAGE.VALIDATE_INPUT_REGEX_ERROR]: "checkIdFormat"
};

const getTranslationKeyFromErrorMessage = (message: string): string => {
  return errorMessageToTranslationKeyMappings[message] ?? message;
};

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
  showConfirmationAlert: (
    error: Error,
    onOk: () => void,
    onCancel?: () => void,
    content?: Record<string, string>
  ) => void;
  showErrorAlert: (
    error: Error,
    onOk?: () => void,
    content?: Record<string, string>
  ) => void;
  showWarnAlert: (
    error: Error,
    onOk: () => void,
    content?: Record<string, string>
  ) => void;
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

  const showConfirmationAlert = useCallback(
    (
      error: Error,
      onOk: () => void,
      onCancel?: () => void,
      content?: Record<string, string>
    ): void => {
      const translationKey = getTranslationKeyFromError(error);
      showAlert({
        alertType: "CONFIRM",
        title: i18n.t(`errorMessages.${translationKey}.title`) ?? "Confirm",
        description: i18n.t(`errorMessages.${translationKey}.body`, content),
        buttonTexts: {
          primaryActionText: i18n.t(
            `errorMessages.${translationKey}.primaryActionText`
          ),
          secondaryActionText: i18n.t(
            `errorMessages.${translationKey}.secondaryActionText`
          )
        },
        visible: true,
        onOk: onOk,
        onCancel: onCancel ?? undefined,
        onExit: () => {}
      });
    },
    [showAlert]
  );

  const showErrorAlert = useCallback(
    (
      error: Error,
      onOk?: () => void,
      content?: Record<string, string>
    ): void => {
      const translationKey = getTranslationKeyFromError(error);
      showAlert({
        alertType: "ERROR",
        title: i18n.t(`errorMessages.${translationKey}.title`) ?? "Error",
        description:
          i18n.t(`errorMessages.${translationKey}.body`, content) ??
          translationKey,
        buttonTexts: {
          primaryActionText:
            i18n.t(`errorMessages.${translationKey}.primaryActionText`) ?? "OK",
          secondaryActionText: i18n.t(
            `errorMessages.${translationKey}.secondaryActionText`
          )
        },
        visible: true,
        onOk: !!onOk ? onOk : () => {},
        onCancel: () => {},
        onExit: () => {}
      });
    },
    [showAlert]
  );

  const showWarnAlert = useCallback(
    (
      error: Error,
      onOk: () => void,
      content?: Record<string, string>
    ): void => {
      const translationKey = getTranslationKeyFromError(error);
      showAlert({
        alertType: "WARN",
        title: i18n.t(`errorMessages.${translationKey}.title`) ?? "Warning",
        description:
          i18n.t(`errorMessages.${translationKey}.body`, content) ??
          translationKey,
        buttonTexts: {
          primaryActionText: i18n.t(
            `errorMessages.${translationKey}.primaryActionText`
          ),
          secondaryActionText: i18n.t(
            `errorMessages.${translationKey}.secondaryActionText`
          )
        },
        visible: true,
        onOk: onOk,
        onCancel: () => {},
        onExit: () => {}
      });
    },
    [showAlert]
  );

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
