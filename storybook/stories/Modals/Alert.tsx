import React, { FunctionComponent, useState } from "react";
import { storiesOf } from "@storybook/react-native";
import {
  AlertModal,
  AlertModalProps
} from "../../../src/components/AlertModal/AlertModal";
import { size } from "../../../src/common/styles";
import { View } from "react-native";
import { DarkButton } from "../../../src/components/Layout/Buttons/DarkButton";

const AlertModalItem: FunctionComponent<{
  alertType: AlertModalProps["alertType"];
  title: AlertModalProps["title"];
  description: AlertModalProps["description"];
  buttonTexts: AlertModalProps["buttonTexts"];
}> = ({ alertType, title, description, buttonTexts }) => {
  const [visible, setVisible] = useState(false);
  const close = (): void => setVisible(false);
  return (
    <View style={{ margin: size(1) }}>
      <DarkButton
        text={`Show ${alertType} alert`}
        onPress={() => {
          setVisible(true);
        }}
      />
      <AlertModal
        alertType={alertType}
        title={title}
        description={description}
        buttonTexts={buttonTexts}
        visible={visible}
        onOk={close}
        onExit={close}
        onCancel={close}
      />
    </View>
  );
};
storiesOf("Modals", module).add("Alerts", () => (
  <View style={{ flex: 1, alignItems: "center", marginTop: size(6) }}>
    <AlertModalItem
      alertType="ERROR"
      title="Title"
      description="Description and how to recover"
      buttonTexts={{
        primaryActionText: "OK"
      }}
    />
    <AlertModalItem
      alertType="WARN"
      title="Warn Title"
      description="Confirm a destructive choice"
      buttonTexts={{
        primaryActionText: "Delete",
        secondaryActionText: "Cancel"
      }}
    />
    <AlertModalItem
      alertType="CONFIRM"
      title="Confirm Title"
      description="Confirm a choice"
      buttonTexts={{
        primaryActionText: "Confirm",
        secondaryActionText: "Cancel"
      }}
    />
    <AlertModalItem
      alertType="INFO"
      title="Info Title"
      description="Communicate important info"
      buttonTexts={{
        primaryActionText: "Go to Play Store"
      }}
    />
  </View>
));
