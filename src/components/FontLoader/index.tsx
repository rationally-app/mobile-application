import React, { ReactElement, useEffect, useState } from "react";
import * as Font from "expo-font";
import { LoadingView } from "../Loading";

export const FontLoader = ({
  children
}: {
  children: ReactElement;
}): ReactElement => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  useEffect(() => {
    const loadFonts = async (): Promise<void> => {
      await Font.loadAsync({
        inter: require("../../../assets/fonts/Inter-Regular.otf"),
        "inter-bold": require("../../../assets/fonts/Inter-Bold.otf")
      });
      setFontsLoaded(true);
    };

    loadFonts();
  }, []);
  return fontsLoaded ? children : <LoadingView />;
};
