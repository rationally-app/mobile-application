import React, { FunctionComponent, ReactElement } from "react";
import { TouchableHighlight, View, StyleSheet } from "react-native";
import { size, color, borderRadius } from "../../common/styles";
import { Feather } from "@expo/vector-icons";

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    borderRadius: borderRadius(3),
    alignItems: "center",
    minHeight: size(9),
    borderWidth: 1
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
    marginLeft: size(2.5),
    flex: 1
  },
  toggle: {
    borderWidth: 1,
    marginRight: size(3),
    width: size(3),
    height: size(3),
    borderRadius: 9999,
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
        <Feather name="check" size={size(1.5)} color={color("green", 60)} />
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
