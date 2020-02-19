import React, { FunctionComponent, ReactElement } from "react";
import { TouchableHighlight, View, StyleSheet } from "react-native";
import { size, color, borderRadius } from "../../common/styles";
import { Feather } from "@expo/vector-icons";

const styles = StyleSheet.create({
  outerWrapper: {
    paddingHorizontal: size(3)
  },
  innerWrapper: {
    flexDirection: "row",
    paddingVertical: size(2),
    borderBottomColor: color("grey", 20),
    borderBottomWidth: 1
  },
  labelWrapper: {
    flex: 1
  },
  toggle: {
    borderWidth: 1,
    width: size(6),
    height: size(6),
    borderRadius: borderRadius(3),
    justifyContent: "center",
    alignItems: "center"
  },
  toggleUnchecked: {
    backgroundColor: "white",
    borderColor: color("grey", 30)
  },
  toggleChecked: {
    backgroundColor: color("green", 30),
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
        <Feather name="check" size={size(3)} color={color("green", 60)} />
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
      style={styles.outerWrapper}
      onPress={() => onToggle(!isChecked)}
      underlayColor={color("grey", 20) + "33"}
      activeOpacity={1}
    >
      <View style={styles.innerWrapper}>
        <View style={styles.labelWrapper}>{label}</View>
        <Toggle isChecked={isChecked} />
      </View>
    </TouchableHighlight>
  );
};
