import React, { FunctionComponent } from "react";
import * as Updates from "expo-updates";
import { AlertModal } from "../AlertModal/AlertModal";

export const UpdateByRestartingAlert: FunctionComponent = () => {
  return (
    <AlertModal
      alertType="INFO"
      title="Outdated app"
      description={`Restart your app to get the latest app version.`}
      visible={true}
      buttonTexts={{ primaryActionText: "Restart app" }}
      onOk={() => Updates.reloadAsync()}
    />
  );
};
