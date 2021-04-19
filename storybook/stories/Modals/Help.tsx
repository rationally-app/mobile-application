import React, { useState, ReactElement } from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { size } from "../../../src/common/styles";
import { DarkButton } from "../../../src/components/Layout/Buttons/DarkButton";
import { HelpModal } from "../../../src/components/HelpModal/HelpModal";

const HelpModalItem = (): ReactElement => {
  const [isVisible, setIsVisible] = useState(false);
  return (
    <View style={{ flex: 1, margin: size(3) }}>
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <DarkButton text="Show Help Modal" onPress={() => setIsVisible(true)} />
      </View>
      <HelpModal isVisible={isVisible} onExit={() => setIsVisible(false)} />
    </View>
  );
};

storiesOf("Modals", module).add("Help", () => <HelpModalItem />);
