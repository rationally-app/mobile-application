import React, { ReactElement, useEffect, useState } from "react";
import * as Font from "expo-font";
import { LoadingView } from "../Loading";

export const FontLoader = ({
  children,
}: {
  children: ReactElement;
}): ReactElement => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    const loadFonts = async (): Promise<void> => {
      await Font.loadAsync({
        "brand-regular": require("../../../assets/fonts/IBMPlexSans-Regular.ttf"),
        "brand-italic": require("../../../assets/fonts/IBMPlexSans-Italic.ttf"),
        "brand-bold": require("../../../assets/fonts/IBMPlexSans-Bold.ttf"),
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);
  return fontsLoaded ? children : <LoadingView />;
};
