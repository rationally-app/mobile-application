import React, { FunctionComponent, useState, useEffect } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ValidityIcon } from "../ValidityIcon";
import { DARK } from "../../../common/colors";
import { getStatusProps } from "../utils";
import { CheckStatus } from "../constants";

interface ValidityBannerHeader {
  checkStatus: CheckStatus;
  onPress: () => void;
  isExpanded?: boolean;
  progress?: number;
}

export const ValidityBannerHeader: FunctionComponent<ValidityBannerHeader> = ({
  checkStatus,
  onPress,
  isExpanded = false,
  progress = 0
}) => {
  const { label, color, backgroundColor } = getStatusProps(checkStatus, {
    [CheckStatus.VALID]: {
      label: "Valid"
    },
    [CheckStatus.INVALID]: {
      label: "Invalid"
    },
    [CheckStatus.CHECKING]: {
      label: "Verifying..."
    }
  });

  const [showProgressBar, setShowProgressBar] = useState(true);
  useEffect(() => {
    let cancelled = false;
    if (progress === 1) {
      // Hides the progress bar after some time
      setTimeout(() => {
        if (!cancelled) {
          setShowProgressBar(false);
        }
      }, 300);
    } else {
      setShowProgressBar(true);
    }
    return () => {
      cancelled = true;
    };
  }, [progress]);

  return (
    <View style={{ position: "relative" }}>
      <View
        style={{
          backgroundColor: color,
          height: showProgressBar ? 1 : 0,
          width: `${progress * 100}%`,
          position: "absolute",
          top: -1
        }}
        testID="validity-header-progress"
      />

      <TouchableHighlight
        style={{
          height: 44,
          flexDirection: "row",
          paddingTop: 8,
          paddingBottom: 8,
          paddingLeft: 24,
          paddingRight: 24,
          backgroundColor
        }}
        underlayColor={backgroundColor}
        onPress={onPress}
        testID="validity-header-button"
      >
        <View
          style={{
            width: "100%",
            flexDirection: "row",
            alignItems: "stretch",
            justifyContent: "space-between"
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <ValidityIcon checkStatus={checkStatus} size={20} />
            <Text
              style={{
                color,
                fontSize: 14,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 0.7,
                marginLeft: 10
              }}
              testID="validity-header-label"
            >
              {label}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            <Feather
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={16}
              color={DARK}
              testID="validity-header-icon"
            />
          </View>
        </View>
      </TouchableHighlight>
    </View>
  );
};
