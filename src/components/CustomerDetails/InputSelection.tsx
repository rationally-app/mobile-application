import React, {
  FunctionComponent} from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity
} from "react-native";
import { size, fontSize, color } from "../../common/styles";

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
  }
});

export const InputSelection: FunctionComponent<{
  onInputSelection: (inputType: string) => void;
}> = ({ onInputSelection }) => {
  return (
    <View style={styles.selectionContainer}>
      <View style={styles.selectedIndicator}>
        <TouchableOpacity
          onPress={() => {
            onInputSelection("NRIC");
          }}
        >
          <Text style={styles.selectedText}>NRIC/FIN</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.selectedIndicator}>
        <TouchableOpacity
          onPress={() => {
            onInputSelection("PASSPORT");
          }}
        >
          <Text style={styles.selectedText}>Passport</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
