import React, { FunctionComponent } from "react";
import { color, fontSize } from "../../common/styles";
import { AppText } from "./AppText";

export const AppName: FunctionComponent = () => (
  <AppText
    style={{
      color: color("grey", 0),
      fontFamily: "inter-bold",
      fontSize: fontSize(4)
    }}
  >
    MaskEnough
  </AppText>
);
