import React, { FunctionComponent } from "react";
import * as Updates from "expo-updates";
import { AlertModal } from "../AlertModal/AlertModal";
import { getTranslatedStringWithI18n } from "../../utils/translations";

export const UpdateByRestartingAlert: FunctionComponent = () => {
  return (
    <AlertModal
      alertType="INFO"
      title={getTranslatedStringWithI18n(
        "errorMessages",
        "outdatedAppRestart",
        "title"
      )}
      description={getTranslatedStringWithI18n(
        "errorMessages",
        "outdatedAppRestart",
        "body"
      )}
      visible={true}
      buttonTexts={{
        primaryActionText: `${getTranslatedStringWithI18n(
          "errorMessages",
          "outdatedAppRestart",
          "primaryActionText"
        )}`
      }}
      onOk={() => Updates.reloadAsync()}
    />
  );
};
