import React, { FunctionComponent, useState } from "react";
import { storiesOf } from "@storybook/react-native";
import {
  AlertModal,
  AlertModalProp
} from "../../../src/components/AlertModal/AlertModal";
import { size } from "../../../src/common/styles";
import { View } from "react-native";
import { DarkButton } from "../../../src/components/Layout/Buttons/DarkButton";

const AlertModalItem: FunctionComponent<{
  alertType: AlertModalProp["alertType"];
  title: AlertModalProp["title"];
  description: AlertModalProp["description"];
}> = props => {
  const [visible, setVisible] = useState(false);
  const close = (): void => setVisible(false);
  return (
    <View style={{ margin: size(1) }}>
      <DarkButton
        text={`Show ${props.alertType} alert`}
        onPress={() => {
          setVisible(true);
        }}
      />
      <AlertModal
        alertType={props.alertType}
        title={props.title}
        description={props.description}
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
      alertType={"ERROR"}
      title={"Title"}
      description={"Description and how to recover"}
    />
    <AlertModalItem
      alertType={"WARN"}
      title={"Warn Title"}
      description={"Confirm a destructive choice"}
    />
    <AlertModalItem
      alertType={"CONFIRM"}
      title={"Confirm Title"}
      description={"Confirm a choice"}
    />
    <AlertModalItem
      alertType={"INFO"}
      title={"Info Title"}
      description={"Communicate important info"}
    />
  </View>
));
