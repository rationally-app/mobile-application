import React, { FunctionComponent, useState, useEffect } from "react";
import { View, Text, TouchableHighlight, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { ValidityIcon } from "../ValidityIcon";
import { getStatusProps } from "../utils";
import { CheckStatus } from "../constants";
import {
  color as colorPalette,
  size,
  fontSize,
  letterSpacing
} from "../../../common/styles";

const styles = StyleSheet.create({
  validityBannerHeader: {
    position: "relative"
  },
  progressBar: {
    position: "absolute",
    top: -1
  },
  validityBannerHeaderButton: {
    height: size(5),
    paddingVertical: size(1),
    paddingHorizontal: size(3)
  },
  validityStatusWrapper: {
    width: "100%",
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between"
  },
  validityStatus: {
    flexDirection: "row",
    alignItems: "center"
  },
  validityStatusText: {
    fontSize: fontSize(-1),
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: letterSpacing(2),
    marginLeft: size(1)
  }
});

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
    <View style={styles.validityBannerHeader}>
      <View
        style={[
          styles.progressBar,
          {
            width: `${progress * 100}%`,
            backgroundColor: color,
            height: showProgressBar ? 1 : 0
          }
        ]}
        testID="validity-header-progress"
      />

      <TouchableHighlight
        style={[
          styles.validityBannerHeaderButton,
          {
            backgroundColor
          }
        ]}
        underlayColor={backgroundColor}
        onPress={onPress}
        testID="validity-header-button"
      >
        <View style={styles.validityStatusWrapper}>
          <View style={styles.validityStatus}>
            <ValidityIcon checkStatus={checkStatus} size={size(2.5)} />
            <Text
              style={[styles.validityStatusText, { color }]}
              testID="validity-header-label"
            >
              {label}
            </Text>
          </View>
          <Feather
            name={isExpanded ? "chevron-up" : "chevron-down"}
            size={size(2)}
            color={colorPalette("grey", 40)}
            testID="validity-header-icon"
          />
        </View>
      </TouchableHighlight>
    </View>
  );
};
