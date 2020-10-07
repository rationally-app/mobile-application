import React, { FunctionComponent } from "react";
import * as Updates from "expo-updates";
import { AlertModal } from "../AlertModal/AlertModal";
import { i18nErrorString } from "../../utils/i18nString";

export const UpdateByRestartingAlert: FunctionComponent = () => {
  return (
    <AlertModal
      alertType="INFO"
      title={i18nErrorString("outdatedAppRestart", "title")}
      description={i18nErrorString("outdatedAppRestart", "body")}
      visible={true}
      buttonTexts={{
        primaryActionText: `${i18nErrorString(
          "outdatedAppRestart",
          "primaryActionText"
        )}`
      }}
      onOk={() => Updates.reloadAsync()}
    />
  );
};
