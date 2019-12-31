import React, { FunctionComponent, useRef, useEffect } from "react";
import { Animated, Easing } from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { getStatusProps } from "./utils";
import { CheckStatus } from "./constants";
import { color, size as sizeScale } from "../../common/styles";

interface ValidityIcon {
  checkStatus: CheckStatus;
  size?: number;
}

export const ValidityIcon: FunctionComponent<ValidityIcon> = ({
  checkStatus,
  size = sizeScale(2.5)
}) => {
  const rotationAnimation = useRef(new Animated.Value(0));
  const animationTiming = useRef<Animated.CompositeAnimation>();

  useEffect(() => {
    animationTiming.current = Animated.timing(rotationAnimation.current, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear
    });
  });

  useEffect(() => {
    if (animationTiming.current) {
      if (checkStatus === CheckStatus.CHECKING) {
        Animated.loop(animationTiming.current).start();
      } else {
        animationTiming.current.stop();
        rotationAnimation.current.setValue(0);
      }
    }
  }, [checkStatus]);

  const {
    iconCategory: IconCategory,
    iconName,
    color: iconColor
  } = getStatusProps(checkStatus, {
    [CheckStatus.VALID]: {
      iconCategory: Feather,
      iconName: "check-circle"
    },
    [CheckStatus.INVALID]: {
      iconCategory: Feather,
      iconName: "x-circle"
    },
    [CheckStatus.CHECKING]: {
      iconCategory: AntDesign,
      iconName: "loading2",
      color: color("grey", 20)
    }
  });

  return (
    <Animated.View
      style={{
        height: size,
        width: size,
        transform: [
          {
            rotate: rotationAnimation.current.interpolate({
              inputRange: [0, 1],
              outputRange: ["0deg", "360deg"]
            })
          }
        ]
      }}
    >
      <IconCategory name={iconName} size={size} color={iconColor} />
    </Animated.View>
  );
};
