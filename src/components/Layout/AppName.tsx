import React, { FunctionComponent } from "react";
import { color, fontSize } from "../../common/styles";
import { AppText } from "./AppText";
import { AppMode } from "../../common/hooks/useConfig";

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
        style={{ color: "red", fontWeight: "bold", fontSize: fontSize(3) }}
      >
        TESTING MODE
      </AppText>
    ) : null}
  </>
);
