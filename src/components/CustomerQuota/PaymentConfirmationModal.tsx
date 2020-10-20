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
  isVisible,
}) => {
  return (
    <AlertModal
      alertType="CONFIRM"
      title="Payment collected?"
      onOk={commitCart}
      onCancel={cancelPayment}
      visible={isVisible}
      buttonTexts={{
        primaryActionText: "Collected",
        secondaryActionText: "No",
      }}
      description={
        "This action cannot be undone. Proceed only when payment has been collected."
      }
    />
  );
};
