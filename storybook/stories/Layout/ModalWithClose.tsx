import React, { useState, ReactElement } from "react";
import { storiesOf } from "@storybook/react-native";
import { ModalWithClose } from "../../../src/components/Layout/ModalWithClose";
import { AppText } from "../../../src/components/Layout/AppText";

import { View } from "react-native";

function ModalItems(): ReactElement {
  const [isVisible, setIsVisible] = useState(true);
  return (
    <View>
      <ModalWithClose isVisible={isVisible} onExit={() => setIsVisible(false)}>
        <AppText>Modal with close</AppText>
      </ModalWithClose>
    </View>
  );
}

storiesOf("Layout", module).add("Modal", () => <ModalItems />);
