import React, { FunctionComponent, ReactElement } from "react";
import {
  TouchableHighlight,
  View,
  StyleSheet,
  Vibration,
  Platform,
} from "react-native";
import { size, color, borderRadius } from "../../common/styles";
import { Feather } from "@expo/vector-icons";

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: size(2),
    paddingVertical: size(1.5),
  },
  wrapperUnchecked: {
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    backgroundColor: color("grey", 10),
    borderColor: color("grey", 20),
  },
  wrapperChecked: {
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    backgroundColor: color("green", 10),
    borderColor: color("green", 40),
  },
  categoryWrapper: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: size(10),
  },
  labelWrapper: {
    marginRight: size(1),
    flex: 1,
  },
  toggleWrapper: {
    flex: 0.5,
    alignItems: "flex-end",
  },
  addonsWrapper: {
    marginRight: size(1),
    flex: 0.5,
  },
  toggle: {
    borderWidth: 1,
    width: size(5),
    height: size(5),
    borderRadius: borderRadius(2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color("grey", 0),
  },
  toggleUnchecked: {
    borderColor: color("grey", 30),
  },
  toggleChecked: {
    borderColor: color("green", 50),
  },
});

interface Toggle {
  isChecked: boolean;
}

const Toggle: FunctionComponent<Toggle> = ({ isChecked }) => {
  return (
    <View
      style={[
        styles.toggle,
        isChecked ? styles.toggleChecked : styles.toggleUnchecked,
      ]}
    >
      {isChecked && (
        <Feather name="check" size={size(2.5)} color={color("grey", 80)} />
      )}
    </View>
  );
};

interface Checkbox extends Toggle {
  label: ReactElement;
  addons?: ReactElement;
  addonsLabel?: ReactElement;
  onToggle: (isChecked: boolean) => void;
}

export const Checkbox: FunctionComponent<Checkbox> = ({
  label,
  addons,
  addonsLabel,
  isChecked,
  onToggle,
}) => {
  return (
    <View
      style={[
        styles.wrapper,
        isChecked ? styles.wrapperChecked : styles.wrapperUnchecked,
      ]}
    >
      <View style={styles.categoryWrapper}>
        <View style={styles.labelWrapper}>{label}</View>

        <TouchableHighlight
          style={styles.toggleWrapper}
          onPress={() => {
            onToggle(!isChecked);
            if (Platform.OS === "android") {
              Vibration.vibrate(10);
            }
          }}
          underlayColor="transparent"
          activeOpacity={1}
          testID="item-checkbox"
        >
          <Toggle isChecked={isChecked} />
        </TouchableHighlight>
      </View>

      {addonsLabel && <View style={styles.labelWrapper}>{addonsLabel}</View>}
      {addons && <View style={styles.addonsWrapper}>{addons}</View>}
    </View>
  );
};
