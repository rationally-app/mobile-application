import React, { FunctionComponent, useRef, useEffect, useState } from "react";
import { View, Animated, LayoutChangeEvent, Easing } from "react-native";
import { getStatusProps } from "../utils";
import { CheckStatus } from "../constants";
import { size } from "../../../common/styles";

interface ValidityBannerContent {
  checkStatus?: CheckStatus;
  isExpanded?: boolean;
}

export const ValidityBannerContent: FunctionComponent<ValidityBannerContent> = ({
  checkStatus = CheckStatus.CHECKING,
  isExpanded = false,
  children
}) => {
  const { backgroundColor } = getStatusProps(checkStatus);

  const heightAnimation = useRef(new Animated.Value(0));
  const [maxHeight, setMaxHeight] = useState(0);

  const handleLayout = (event: LayoutChangeEvent): void => {
    const { height } = event.nativeEvent.layout;
    setMaxHeight(height);
  };

  useEffect(() => {
    Animated.timing(heightAnimation.current, {
      toValue: isExpanded ? maxHeight : 0,
      duration: 300,
      easing: Easing.out(Easing.quad)
    }).start();
  }, [isExpanded, maxHeight]);

  return (
    <Animated.View
      style={{
        height: heightAnimation.current,
        paddingHorizontal: size(3),
        backgroundColor,
        overflow: "hidden"
      }}
      testID="validity-banner-content"
    >
      <View
        onLayout={maxHeight > 0 ? undefined : handleLayout}
        style={{
          paddingTop: size(1),
          paddingBottom: size(1.5),
          position: "absolute",
          opacity: 0,
          zIndex: -99
        }}
      >
        {children}
      </View>
      <View style={{ paddingTop: size(1), paddingBottom: size(1.5) }}>
        {children}
      </View>
    </Animated.View>
  );
};
