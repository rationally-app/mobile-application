import React, { FunctionComponent } from "react";
import { color, fontSize } from "../../common/styles";
import { AppText } from "./AppText";
import { AppMode } from "../../context/config";

interface AppName {
  mode?: AppMode;
}

export const AppName: FunctionComponent<AppName> = (
  { mode } = { mode: AppMode.production }
) => (
  <>
    <AppText
      style={{
        color: color("grey", 0),
        fontFamily: "inter-bold",
        fontSize: fontSize(4)
      }}
    >
      Rationally
    </AppText>
    {mode === AppMode.staging ? (
      <AppText
        style={{
          color: color("red", 50),
          fontFamily: "inter-bold",
          fontSize: fontSize(2)
        }}
      >
        TESTING MODE
      </AppText>
    ) : null}
  </>
);
