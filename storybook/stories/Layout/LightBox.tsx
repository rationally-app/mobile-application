import React from "react";
import { storiesOf } from "@storybook/react-native";
import { LightBox } from "../../../src/components/Layout/LightBox";
import { AppText } from "../../../src/components/Layout/AppText";
import { Dimensions, View } from "react-native";
import { color } from "../../../src/common/styles";

storiesOf("Layout/LightBox", module)
  .add("QR", () => (
    <View>
      <LightBox
        width={Dimensions.get("window").width * 0.7}
        height={Dimensions.get("window").width * 0.7}
        label={
          <AppText style={{ color: color("red", 50) }}>Scan QR Code</AppText>
        }
      />
    </View>
  ))
  .add("Code_39", () => (
    <View>
      <LightBox
        width={Dimensions.get("window").width * 0.9}
        height={Dimensions.get("window").height * 0.25}
        label={
          <AppText style={{ color: color("red", 50) }}>Scan Code_39</AppText>
        }
      />
    </View>
  ));
