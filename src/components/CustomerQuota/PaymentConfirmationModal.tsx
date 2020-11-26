import React, { FunctionComponent } from "react";
import { AlertModal } from "../AlertModal/AlertModal";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export interface PaymentConfirmationModalProps {
  commitCart: () => void;
  cancelPayment: () => void;
  isVisible: boolean;
}

export const PaymentConfirmationModal: FunctionComponent<PaymentConfirmationModalProps> = ({
  commitCart,
  cancelPayment,
  isVisible,
}) => {
  const { i18nt } = useTranslate();
  return (
    <AlertModal
      alertType="CONFIRM"
      title={i18nt("errorMessages", "paymentCollected", "title")}
      onOk={commitCart}
      onCancel={cancelPayment}
      visible={isVisible}
      buttonTexts={{
        primaryActionText: i18nt(
          "errorMessages",
          "paymentCollected",
          "primaryActionText"
        ),
        secondaryActionText: i18nt(
          "errorMessages",
          "paymentCollected",
          "secondaryActionText"
        ),
      }}
      description={i18nt("errorMessages", "paymentCollected", "body")}
    />
  );
};
