import React, { FunctionComponent } from "react";
import { ActivityIndicator } from "react-native";
import { color } from "../../../common/styles";

export const AddonsItems: FunctionComponent = () => {
  return (
    <ActivityIndicator
      style={{ alignSelf: "flex-start" }}
      size="large"
      color={color("grey", 40)}
    />
  );
};
