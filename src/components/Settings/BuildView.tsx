import React, { FunctionComponent, useState } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import { color } from "../../common/styles";
import { BUILD_NO } from "../../config/index";

const contributors = [
  "Chow Ruijie",
  "Laurent Maillet",
  "Raymond Yeh",
  "Sebastian Quek",
  "Sumit Chaudhari"
];

export const BuildView: FunctionComponent = () => {
  const [clicks, setClicks] = useState(0);
  const onPress = (): void => {
    setClicks(clicks + 1);
  };
  const displayedText =
    clicks < 5 ? BUILD_NO : contributors[clicks % contributors.length];
  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={{ flexDirection: "row-reverse" }} testID="build-no">
        <Text style={{ color: color("grey", 20) }}>{displayedText}</Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
