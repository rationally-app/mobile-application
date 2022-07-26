/* eslint-disable @typescript-eslint/no-empty-function */
import React, {
  createContext,
  FunctionComponent,
  useState,
  useCallback,
} from "react";
import {
  AlertModal,
  AlertModalProps,
} from "../components/AlertModal/AlertModal";
import i18n from "i18n-js";
import { ErrorWithCodes } from "../services/helpers";

export enum WARNING_MESSAGE {
  CANCEL_ENTRY = "cancelEntry",
  DISCARD_TRANSACTION = "discardTransaction",
}
export enum CONFIRMATION_MESSAGE {
  PAYMENT_COLLECTION = "paymentCollected",
  CONFIRM_LOGOUT = "confirmLogout",
  RESEND_OTP = "resendOTP",
  REMOVE_VOUCHER = "removeVoucher",
}

export enum ERROR_MESSAGE {
  DUPLICATE_IDENTIFIER_INPUT = "Enter or scan a different code.",
  DUPLICATE_POD_INPUT = "Scan another item that is not tagged to any ID number.",
  MISSING_WAIVER_INPUT = "Enter a valid waiver reason",
  INVALID_IDENTIFIER_INPUT = "Enter or scan a valid code.",
  INVALID_IDENTIFIER_INPUT_TEXT_DISABLED = "Scan a valid code.",
  MISSING_IDENTIFIER_INPUT = "Enter or scan a code.",
  MISSING_IDENTIFIER_INPUT_TEXT_DISABLED = "Scan a code.",
  INVALID_VOUCHER_INPUT = "Enter a valid voucher code.",
  MISSING_VOUCHER_INPUT = "Enter a voucher code.",
  INVALID_POD_INPUT = "Scan a valid device code.",
  MISSING_POD_INPUT = "Scan a device code.",
  INVALID_POD_IDENTIFIER = "Scan item again or get a new item from your in-charge.",
  ALREADY_USED_POD_IDENTIFIER = "Enter or scan an unique code.",
  INVALID_PHONE_NUMBER = "Enter a valid contact number.",
  INVALID_COUNTRY_CODE = "Enter a valid country code.",
  INVALID_PHONE_AND_COUNTRY_CODE = "Enter a valid country code and contact number.",
  INVALID_PAYMENT_RECEIPT_NUMBER = "Enter a valid payment receipt number.",
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
  LOCK_ERROR = "We are currently facing connectivity issues. Try again later or contact your in-charge if the problem persists.",
  NETWORK_ERROR = "We are currently facing connectivity issues. Try again later or contact your in-charge if the problem persists.",
  SERVER_ERROR = "We are currently facing server issues. Contact your in-charge if the problem persists.",
  OTP_EMPTY = "OTP cannot be empty, enter OTP again",
  OTP_ERROR = "Enter OTP again.",
  LAST_OTP_ERROR = "Enter OTP again. After 1 more invalid OTP entry, you will have to wait 3 minutes before trying again.",
  AUTH_FAILURE_TAKEN_TOKEN = "Get a new QR code that is not tagged to any contact number from your in-charge.",
  OTP_EXPIRED = "Get a new OTP and try again.",
  LOGIN_ERROR = "We are currently facing login issues. Get a new QR code from your in-charge.",
  LOGIN_REGEX_ERROR = "Get new QR code from your in-charge and try again.",
  PAST_TRANSACTIONS_ERROR = "We are currently facing server issues. Try again later or contact your in-charge if the problem persists.",
  VALIDATE_INPUT_REGEX_ERROR = "Please check that the ID is in the correct format",
  INVALID_MERCHANT_CODE = "Invalid merchant code",
  INVALID_EMAIL_ADDRESS = "Enter valid email address",
  MISSING_DISBURSEMENTS = "Eligible identity does not have quota. Contact your in-charge to resolve this issue.",
  PAYMENT_QR_DEFORMED = "Payment QR is deformed. Enter or scan a valid code.",
  PAYMENT_QR_DEFORMED_TEXT_DISABLED = "Payment QR is deformed. Scan a valid code.",
  PAYMENT_QR_MISSING = "Payment QR is missing. Enter or scan a valid code.",
  PAYMENT_QR_MISSING_TEXT_DISABLED = "Payment QR is missing. Scan a valid code",
  PAYMENT_QR_UNSUPPORTED = "Payment QR is unsupported. Enter or scan a valid code.",
  PAYMENT_QR_UNSUPPORTED_TEXT_DISABLED = "Payment QR is unsupported. Scan a valid code",
  GOVWALLET_BALANCE_ERROR = "We are currently facing connectivity issues. Try again later or contact your in-charge if the problem persists.",
  GOVWALLET_ACCOUNT_DEACTIVATED_ERROR = "Eligible identity's account has been deactivated. Inform your in-charge about this issue.",
}

const errorNameToTranslationKeyMappings: Record<string, string> = {
  CampaignConfigError: "systemErrorConnectivityIssues",
  SessionError: "expiredSession",
  PastTransactionError: "systemErrorServerIssues",
  QuotaError: "systemErrorConnectivityIssues",
  LockError: "systemErrorConnectivityIssues",
  OTPWrongError: "invalidInputOTP",
  OTPWrongErrorLastTry: "invalidInputOTPOneMoreInvalid",
  OTPExpiredError: "expiredOTP",
  OTPEmptyError: "emptyOTP",
  LoginLockedError: "disabledAccess",
  LoginError: "systemErrorLoginIssue",
  LoginRegexError: "wrongFormatRegexQR",
  AuthTakenError: "alreadyUsedQRCode",
  AuthExpiredError: "expiredQR",
  AuthNotFoundError: "wrongFormatQRGetNew",
  AuthInvalidError: "wrongFormatQRScanAgain",
  ScannerError: "errorScanning",
  LimitReachedError: "scanLimitReached",
  NotEligibleError: "notEligible",
  LogoutError: "systemErrorLogoutIssue",
  NetworkError: "systemErrorConnectivityIssues",
};

const getTranslationKeyFromError = (error: Error): string => {
  return (
    errorNameToTranslationKeyMappings[error.name] ??
    getTranslationKeyFromErrorMessage(error.message)
  );
};

const messageToTranslationKeyMappings: Record<string, string> = {
  [ERROR_MESSAGE.DUPLICATE_IDENTIFIER_INPUT]: "alreadyUsedCode",
  [ERROR_MESSAGE.DUPLICATE_POD_INPUT]: "alreadyUsedItem",
  [ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT]: "wrongFormatCode",
  [ERROR_MESSAGE.INVALID_IDENTIFIER_INPUT_TEXT_DISABLED]:
    "wrongFormatCodeTextDisabled",
  [ERROR_MESSAGE.MISSING_WAIVER_INPUT]: "incompleteWaiveReason",
  [ERROR_MESSAGE.MISSING_IDENTIFIER_INPUT]: "incompleteEntryCode",
  [ERROR_MESSAGE.MISSING_IDENTIFIER_INPUT_TEXT_DISABLED]:
    "incompleteEntryCodeTextDisabled",
  [ERROR_MESSAGE.MISSING_VOUCHER_INPUT]: "incompleteEntryVoucherCode",
  [ERROR_MESSAGE.INVALID_POD_INPUT]: "wrongFormatNotValidDeviceCode",
  [ERROR_MESSAGE.MISSING_POD_INPUT]: "incompleteEntryScanDeviceCode",
  [ERROR_MESSAGE.INVALID_POD_IDENTIFIER]: "invalidDeviceCode",
  [ERROR_MESSAGE.ALREADY_USED_POD_IDENTIFIER]: "alreadyUsedCode",
  [ERROR_MESSAGE.INVALID_PHONE_NUMBER]: "wrongFormatContactNumber",
  [ERROR_MESSAGE.INVALID_COUNTRY_CODE]: "wrongFormatCountryCode",
  [ERROR_MESSAGE.INVALID_PHONE_AND_COUNTRY_CODE]:
    "wrongFormatCountryCodePhoneNumber",
  [ERROR_MESSAGE.INVALID_PAYMENT_RECEIPT_NUMBER]: "wrongPaymentReceiptNumber",
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
  [ERROR_MESSAGE.GOVWALLET_BALANCE_ERROR]: "systemErrorConnectivityIssues",
  [ERROR_MESSAGE.LOCK_ERROR]: "systemErrorConnectivityIssues",
  [ERROR_MESSAGE.NETWORK_ERROR]: "systemErrorConnectivityIssues",
  [ERROR_MESSAGE.SERVER_ERROR]: "systemErrorServerIssues",
  [ERROR_MESSAGE.OTP_EMPTY]: "emptyOTP",
  [ERROR_MESSAGE.OTP_ERROR]: "invalidInputOTP",
  [ERROR_MESSAGE.LAST_OTP_ERROR]: "invalidInputOTPOneMoreInvalid",
  [ERROR_MESSAGE.AUTH_FAILURE_TAKEN_TOKEN]: "alreadyUsedQRCode",
  [ERROR_MESSAGE.OTP_EXPIRED]: "expiredOTP",
  [ERROR_MESSAGE.LOGIN_ERROR]: "systemErrorLoginIssue",
  [ERROR_MESSAGE.LOGIN_REGEX_ERROR]: "wrongFormatRegexQR",
  [ERROR_MESSAGE.PAST_TRANSACTIONS_ERROR]: "systemErrorServerIssues",
  [ERROR_MESSAGE.VALIDATE_INPUT_REGEX_ERROR]: "checkIdFormat",
  [ERROR_MESSAGE.INVALID_MERCHANT_CODE]: "invalidMerchantCode",
  [ERROR_MESSAGE.INVALID_EMAIL_ADDRESS]: "wrongFormatEmailAddress",
  [ERROR_MESSAGE.MISSING_DISBURSEMENTS]: "missingDisbursements",
  [ERROR_MESSAGE.PAYMENT_QR_DEFORMED]: "deformedPaymentQR",
  [ERROR_MESSAGE.PAYMENT_QR_DEFORMED_TEXT_DISABLED]:
    "deformedPaymentQRTextDisabled",
  [ERROR_MESSAGE.PAYMENT_QR_MISSING]: "missingInfoInPaymentQR",
  [ERROR_MESSAGE.PAYMENT_QR_MISSING_TEXT_DISABLED]:
    "missingInfoInPaymentQRTextDisabled",
  [ERROR_MESSAGE.PAYMENT_QR_UNSUPPORTED]: "unsupportedPaymentMethodInPaymentQR",
  [ERROR_MESSAGE.PAYMENT_QR_UNSUPPORTED_TEXT_DISABLED]:
    "unsupportedPaymentMethodInPaymentQRTextDisabled",
  [ERROR_MESSAGE.GOVWALLET_ACCOUNT_DEACTIVATED_ERROR]:
    "govwalletAccountDeactivated",
  [CONFIRMATION_MESSAGE.PAYMENT_COLLECTION]:
    CONFIRMATION_MESSAGE.PAYMENT_COLLECTION,
  [CONFIRMATION_MESSAGE.CONFIRM_LOGOUT]: CONFIRMATION_MESSAGE.CONFIRM_LOGOUT,
  [CONFIRMATION_MESSAGE.RESEND_OTP]: CONFIRMATION_MESSAGE.RESEND_OTP,
  [CONFIRMATION_MESSAGE.REMOVE_VOUCHER]: CONFIRMATION_MESSAGE.REMOVE_VOUCHER,
  [WARNING_MESSAGE.CANCEL_ENTRY]: WARNING_MESSAGE.CANCEL_ENTRY,
  [WARNING_MESSAGE.DISCARD_TRANSACTION]: WARNING_MESSAGE.DISCARD_TRANSACTION,
};

const getTranslationKeyFromErrorMessage = (message: string): string => {
  return messageToTranslationKeyMappings[message] ?? message;
};

const defaultAlertProps: AlertModalProps = {
  alertType: "ERROR",
  title: "",
  buttonTexts: {
    primaryActionText: "OK",
  },
  visible: false,
  onOk: () => {},
  onCancel: () => {},
  onExit: () => {},
};

interface AlertModalContext {
  showConfirmationAlert: (
    confirmation: CONFIRMATION_MESSAGE,
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
    warning: WARNING_MESSAGE,
    onOk: () => void,
    content?: Record<string, string>
  ) => void;
  clearAlert: () => void;
}

export const AlertModalContext = createContext<AlertModalContext>({
  showConfirmationAlert: () => null,
  showErrorAlert: () => null,
  showWarnAlert: () => null,
  clearAlert: () => null,
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
      confirmationMessage: CONFIRMATION_MESSAGE,
      onClickPrimaryAction: () => void,
      onClickSecondaryAction?: () => void,
      dynamicContent?: Record<string, string>
    ): void => {
      const translationKey =
        messageToTranslationKeyMappings[confirmationMessage];
      showAlert({
        alertType: "CONFIRM",
        title: i18n.t(`errorMessages.${translationKey}.title`) ?? "Confirm",
        description: i18n.t(
          `errorMessages.${translationKey}.body`,
          dynamicContent
        ),
        buttonTexts: {
          primaryActionText: i18n.t(
            `errorMessages.${translationKey}.primaryActionText`
          ),
          secondaryActionText: i18n.t(
            `errorMessages.${translationKey}.secondaryActionText`
          ),
        },
        visible: true,
        onOk: onClickPrimaryAction,
        onCancel: onClickSecondaryAction ?? (() => {}),
        onExit: () => {},
      });
    },
    [showAlert]
  );

  const showErrorAlert = useCallback(
    (
      error: Error,
      onClickPrimaryAction?: () => void,
      dynamicContent?: Record<string, string>
    ): void => {
      let translationKey = getTranslationKeyFromError(error);

      let title = i18n.t(`errorMessages.${translationKey}.title`);
      let description = i18n.t(
        `errorMessages.${translationKey}.body`,
        dynamicContent
      );
      let primaryButtonText = i18n.t(
        `errorMessages.${translationKey}.primaryActionText`
      );

      /**
       * Defining error dialog properties for ErrorWithCodes.
       *
       * For HTTP 50X errors, the properties are located in their respective
       * translation keys (e.g. errorMessages.http500Error).
       *
       * For all other HTTP errors, the title is the error code, and
       * the description is the error message.
       */
      if (!title && !description && error instanceof ErrorWithCodes) {
        const { message, statusCode, errorCode } = error;

        translationKey = `http${statusCode}Error`;

        if (statusCode >= 500) {
          title = i18n.t(`errorMessages.${translationKey}.title`);
          description = i18n.t(`errorMessages.${translationKey}.body`);
          primaryButtonText = i18n.t(
            `errorMessages.${translationKey}.primaryActionText`
          );
        } else {
          title = errorCode ?? "Error";
          description = message;
        }
      }

      showAlert({
        alertType: "ERROR",
        title: title ?? "Error",
        description,
        buttonTexts: {
          primaryActionText: primaryButtonText ?? "OK",
        },
        visible: true,
        onOk: !!onClickPrimaryAction ? onClickPrimaryAction : () => {},
        onCancel: () => {},
        onExit: () => {},
      });
    },
    [showAlert]
  );

  const showWarnAlert = useCallback(
    (
      warningMessage: WARNING_MESSAGE,
      onClickPrimaryAction: () => void,
      dynamicContent?: Record<string, string>
    ): void => {
      const translationKey = messageToTranslationKeyMappings[warningMessage];
      showAlert({
        alertType: "WARN",
        title: i18n.t(`errorMessages.${translationKey}.title`) ?? "Warning",
        description: i18n.t(
          `errorMessages.${translationKey}.body`,
          dynamicContent
        ),
        buttonTexts: {
          primaryActionText: i18n.t(
            `errorMessages.${translationKey}.primaryActionText`
          ),
          secondaryActionText: i18n.t(
            `errorMessages.${translationKey}.secondaryActionText`
          ),
        },
        visible: true,
        onOk: onClickPrimaryAction,
        onCancel: () => {},
        onExit: () => {},
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
        clearAlert,
      }}
    >
      {children}
      <AlertModal {...alertProps} onExit={clearAlert} />
    </AlertModalContext.Provider>
  );
};
