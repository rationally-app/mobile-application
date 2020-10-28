import React, { FunctionComponent } from "react";
import * as Updates from "expo-updates";
import { AlertModal } from "../AlertModal/AlertModal";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

export const UpdateByRestartingAlert: FunctionComponent = () => {
  const { i18nt } = useTranslate();
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
        )}`,
      }}
      onOk={() => Updates.reloadAsync()}
    />
  );
};
