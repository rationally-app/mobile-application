import React, { FunctionComponent, useState, useEffect } from "react";
import { View, Text, TouchableHighlight } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ValidityIcon } from "./ValidityIcon";
import { CheckStatus } from "../../../constants/verifier";
import {
  GREEN_30,
  GREEN_20,
  RED_30,
  RED_20,
  DARK,
  YELLOW_20
} from "../../../common/colors";

interface ValidityBannerHeader {
  checkStatus?: CheckStatus;
  isExpanded?: boolean;
  progress?: number;
  onPress: () => void;
}

export const ValidityBannerHeader: FunctionComponent<ValidityBannerHeader> = ({
  checkStatus = CheckStatus.CHECKING,
  isExpanded = false,
  progress = 0,
  onPress
}) => {
  let status;
  switch (checkStatus) {
    case CheckStatus.VALID:
      status = {
        label: "Valid",
        labelColor: GREEN_30,
        backgroundColor: GREEN_20
      };
      break;
    case CheckStatus.INVALID:
      status = {
        label: "Invalid",
        labelColor: RED_30,
        backgroundColor: RED_20
      };
      break;
    case CheckStatus.CHECKING:
    default:
      status = {
        label: "Verifying...",
        labelColor: DARK,
        backgroundColor: YELLOW_20
      };
      break;
  }

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
          backgroundColor: status.labelColor,
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
          backgroundColor: status.backgroundColor
        }}
        underlayColor={status.backgroundColor}
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
                color: status.labelColor,
                fontSize: 14,
                fontWeight: "bold",
                textTransform: "uppercase",
                letterSpacing: 0.7,
                marginLeft: 10
              }}
              testID="validity-header-label"
            >
              {status.label}
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
