import React, { useState } from "react";
import { storiesOf } from "@storybook/react-native";
import { ModalWithClose } from "../../../src/components/Layout/ModalWithClose";
import { AppText } from "../../../src/components/Layout/AppText";
import { DarkButton } from "../../../src/components/Layout/Buttons/DarkButton";
import { View } from "react-native";

const ModalItems = (): JSX.Element => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DarkButton text="Show Modal" onPress={() => setIsVisible(true)} />
      </View>
      <ModalWithClose isVisible={isVisible} onExit={() => setIsVisible(false)}>
        <AppText>Modal with close</AppText>
      </ModalWithClose>
    </View>
  );
};

storiesOf("Layout", module).add("Modal", () => <ModalItems />);
