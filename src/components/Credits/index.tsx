import React, { FunctionComponent, useState } from "react";
import HiveLogo from "../../../assets/icons/hive-logo.svg";
import {
  View,
  StyleSheet,
  ViewProps,
  TouchableWithoutFeedback
} from "react-native";
import { AppText } from "../Layout/AppText";
import { size, fontSize } from "../../common/styles";

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    position: "absolute",
    bottom: 0,
    marginBottom: size(2)
  },
  content: {
    marginLeft: size(1)
  },
  text: {
    fontSize: fontSize(-4),
    fontFamily: "inter-bold",
    color: "#CCCCCC"
  },
  subText: {
    fontSize: fontSize(-4),
    color: "#CCCCCC"
  }
});

const contributors = [
  "Chow Ruijie",
  "Raymond Yeh",
  "Sebastian Quek",
  "Lim Zui Young",
  "Immanuella Lim"
];

export const Credits: FunctionComponent<ViewProps> = ({ style }) => {
  const [clicks, setClicks] = useState(0);
  const onPress = (): void => {
    setClicks(c => c + 1);
  };
  const displayedText =
    clicks < 3 ? "" : contributors[clicks % contributors.length];

  return (
    <TouchableWithoutFeedback onPress={onPress}>
      <View style={[styles.wrapper, style]}>
        <HiveLogo />
        <View style={styles.content}>
          <AppText style={styles.text}>Built by GDS, GovTech Singapore</AppText>
          {displayedText.length > 0 && (
            <AppText style={styles.subText}>{displayedText}</AppText>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
