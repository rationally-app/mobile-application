import React, { FunctionComponent } from "react";
import * as Updates from "expo-updates";
import { AlertModal } from "../AlertModal/AlertModal";
import { i18nt } from "../../utils/translations";

export const UpdateByRestartingAlert: FunctionComponent = () => {
  return (
    <AlertModal
      alertType="INFO"
      title={i18nt("errorMessages", "outdatedAppRestart", "title")}
      description={i18nt("errorMessages", "outdatedAppRestart", "body")}
      visible={true}
      buttonTexts={{
        primaryActionText: `${i18nt(
          "errorMessages",
          "outdatedAppRestart",
          "primaryActionText"
        )}`
      }}
      onOk={() => Updates.reloadAsync()}
    />
  );
};
