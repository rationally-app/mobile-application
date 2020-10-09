import React, { FunctionComponent } from "react";
import { AlertModal } from "../AlertModal/AlertModal";

export interface PaymentConfirmationModalProps {
  commitCart: () => void;
  cancelPayment: () => void;
  isVisible: boolean;
}

export const PaymentConfirmationModal: FunctionComponent<PaymentConfirmationModalProps> = ({
  commitCart,
  cancelPayment,
  isVisible
}) => {
  return (
    <AlertModal
      alertType="CONFIRM"
      title="Collected Payment?"
      onOk={commitCart}
      onCancel={cancelPayment}
      visible={isVisible}
      buttonTexts={{
        primaryActionText: "Confirm",
        secondaryActionText: "Cancel"
      }}
    />
  );
};
