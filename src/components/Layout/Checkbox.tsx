import React, { FunctionComponent, ReactElement } from "react";
import { TouchableHighlight, View, StyleSheet } from "react-native";
import { size, color, borderRadius } from "../../common/styles";
import { Feather } from "@expo/vector-icons";

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "center",
    minHeight: size(10),
    borderWidth: 1,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    paddingHorizontal: size(2),
    paddingVertical: size(1.5)
  },
  wrapperUnchecked: {
    backgroundColor: color("grey", 10),
    borderColor: color("grey", 20)
  },
  wrapperChecked: {
    backgroundColor: color("green", 10),
    borderColor: color("green", 40)
  },
  labelWrapper: {
    marginRight: size(1),
    flex: 1
  },
  toggle: {
    borderWidth: 1,
    width: size(5),
    height: size(5),
    borderRadius: borderRadius(2),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: color("grey", 0)
  },
  toggleUnchecked: {
    borderColor: color("grey", 30)
  },
  toggleChecked: {
    borderColor: color("green", 50)
  }
});

interface Toggle {
  isChecked: boolean;
}

const Toggle: FunctionComponent<Toggle> = ({ isChecked }) => {
  return (
    <View
      style={[
        styles.toggle,
        isChecked ? styles.toggleChecked : styles.toggleUnchecked
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
  onToggle: (isChecked: boolean) => void;
}

export const Checkbox: FunctionComponent<Checkbox> = ({
  label,
  isChecked,
  onToggle
}) => {
  return (
    <TouchableHighlight
      onPress={() => onToggle(!isChecked)}
      underlayColor="transparent"
      activeOpacity={1}
    >
      <View
        style={[
          styles.wrapper,
          isChecked ? styles.wrapperChecked : styles.wrapperUnchecked
        ]}
      >
        <View style={styles.labelWrapper}>{label}</View>
        <Toggle isChecked={isChecked} />
      </View>
    </TouchableHighlight>
  );
};
