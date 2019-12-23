import React, { FunctionComponent, useRef, useEffect, useState } from "react";
import { View, Animated, LayoutChangeEvent, Easing } from "react-native";
import { getStatusProps } from "../utils";
import { CheckStatus } from "../constants";

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
        paddingHorizontal: 24,
        backgroundColor,
        overflow: "hidden"
      }}
      testID="validity-banner-content"
    >
      <View
        onLayout={maxHeight > 0 ? undefined : handleLayout}
        style={{
          paddingTop: 8,
          paddingBottom: 12,
          position: "absolute",
          opacity: 0,
          zIndex: -99
        }}
      >
        {children}
      </View>
      <View style={{ paddingTop: 8, paddingBottom: 12 }}>{children}</View>
    </Animated.View>
  );
};
