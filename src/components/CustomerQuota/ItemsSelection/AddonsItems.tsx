import React, { FunctionComponent } from "react";
import { ActivityIndicator, View } from "react-native";
import { color } from "../../../common/styles";

export const AddonsItems: FunctionComponent<{ isShowAddons: boolean }> = ({
  isShowAddons,
}) => {
  return isShowAddons ? (
    <ActivityIndicator
      style={{ alignSelf: "flex-start" }}
      size="large"
      color={color("grey", 40)}
    />
  ) : (
    <View></View>
  );
};
