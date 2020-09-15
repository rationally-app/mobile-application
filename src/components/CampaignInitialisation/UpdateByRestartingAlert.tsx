import React, { FunctionComponent } from "react";
import * as Updates from "expo-updates";
import { AlertModal } from "../AlertModal/AlertModal";
import i18n from "i18n-js";

export const UpdateByRestartingAlert: FunctionComponent = () => {
  return (
    <AlertModal
      alertType="INFO"
      title={i18n.t("errorMessages.outdatedAppRestart.title")}
      description={i18n.t("errorMessages.outdatedAppRestart.body")}
      visible={true}
      buttonTexts={{
        primaryActionText: i18n.t(
          "errorMessages.outdatedAppRestart.primaryActionText"
        )
      }}
      onOk={() => Updates.reloadAsync()}
    />
  );
};
