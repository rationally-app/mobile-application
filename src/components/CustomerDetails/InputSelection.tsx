import React, { FunctionComponent } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { size, fontSize, color } from "../../common/styles";
import { IdentificationFlag } from "../../types";

const styles = StyleSheet.create({
  selectionContainer: {
    flex: 1,
    flexDirection: "row"
  },
  selectedText: {
    color: color("grey", 0),
    fontFamily: "brand-bold",
    fontSize: fontSize(0),
    paddingBottom: 20
  },
  selectedIndicator: {
    borderBottomColor: color("grey", 0),
    borderBottomWidth: 2,
    marginLeft: size(1),
    marginRight: size(5),
    marginBottom: size(2)
  },
  unselectedText: {
    color: color("grey", 10),
    fontFamily: "brand-regular",
    fontSize: fontSize(0),
    paddingBottom: 20
  },
  unselectedIndicator: {
    borderBottomColor: color("grey", 10),
    borderBottomWidth: 0,
    marginLeft: size(1),
    marginRight: size(5),
    marginBottom: size(2)
  }
});

export const InputSelection: FunctionComponent<{
  selectionArray: IdentificationFlag[];
  currentSelection: IdentificationFlag;
  onInputSelection: (inputType: IdentificationFlag) => void;
}> = ({ selectionArray, currentSelection, onInputSelection }) => {
  return (
    <View style={styles.selectionContainer}>
      {selectionArray.map(selectionType => (
        <View
          key={selectionType.label}
          style={
            selectionType.label === currentSelection.label
              ? styles.selectedIndicator
              : styles.unselectedIndicator
          }
        >
          <TouchableOpacity
            onPress={() => {
              onInputSelection(selectionType);
            }}
          >
            <Text
              style={
                selectionType.label === currentSelection.label
                  ? styles.selectedText
                  : styles.unselectedText
              }
            >
              {selectionType.label}
            </Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};
