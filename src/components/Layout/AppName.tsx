import React, { FunctionComponent } from "react";
import { color, fontSize } from "../../common/styles";
import { AppText } from "./AppText";
import { AppMode } from "../../context/config";
import { useTheme } from "../../context/theme";

interface AppName {
  mode?: AppMode;
}

export const AppName: FunctionComponent<AppName> = (
  { mode } = { mode: AppMode.production }
) => {
  const { theme } = useTheme();

  return (
    <>
      {theme.logo()}
      {mode === AppMode.staging ? (
        <AppText
          style={{
            color: color("red", 50),
            fontFamily: "brand-bold",
            fontSize: fontSize(2),
          }}
        >
          TESTING MODE
        </AppText>
      ) : null}
    </>
  );
};
