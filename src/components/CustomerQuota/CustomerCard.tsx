import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps
} from "react-native";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { Feather } from "@expo/vector-icons";
import { size, color, borderRadius, fontSize } from "../../common/styles";

const styles = StyleSheet.create({
  header: {
    borderTopLeftRadius: borderRadius(3),
    borderTopRightRadius: borderRadius(3),
    paddingHorizontal: size(2),
    paddingVertical: size(2),
    backgroundColor: color("blue-green", 40),
    flexDirection: "row",
    alignItems: "flex-start"
  },
  headerText: {
    marginLeft: size(1.5),
    flex: 1
  },
  nricLabel: {
    color: color("grey", 0),
    fontSize: fontSize(-2),
    marginBottom: 2
  },
  nricText: {
    color: color("grey", 0),
    fontSize: fontSize(1),
    lineHeight: 1.2 * fontSize(1),
    fontFamily: "brand-bold"
  },
  childrenWrapper: {
    overflow: "hidden",
    borderBottomLeftRadius: borderRadius(4),
    borderBottomRightRadius: borderRadius(4)
  }
});

interface AddButton {
  text: string;
  onPress?: TouchableOpacityProps["onPress"];
}

export const AddButton: FunctionComponent<AddButton> = ({ text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          backgroundColor: color("grey", 0),
          borderColor: color("blue", 50),
          borderWidth: 1,
          alignSelf: "flex-start",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: size(1),
          paddingHorizontal: size(2),
          borderRadius: borderRadius(2)
        }}
      >
        <AppText
          style={{
            fontFamily: "brand-bold",
            textAlign: "center"
          }}
        >
          {text}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

export const CustomerCard: FunctionComponent<{
  nrics: string[];
  onAddNric?: () => void;
  headerBackgroundColor?: ViewStyle["backgroundColor"];
}> = ({ nrics, onAddNric, headerBackgroundColor, children }) => (
  <Card
    style={{
      paddingTop: 0,
      paddingBottom: 0,
      paddingHorizontal: 0
    }}
  >
    <View
      style={[
        styles.header,
        headerBackgroundColor ? { backgroundColor: headerBackgroundColor } : {}
      ]}
    >
      <Feather name="user" size={size(3)} color={color("grey", 0)} />
      <View style={styles.headerText}>
        <AppText style={styles.nricLabel}>
          Customer NRIC{nrics.length > 1 ? "s" : ""}
        </AppText>
        {nrics.map(nric => (
          <AppText key={nric} style={styles.nricText}>
            {nric}
          </AppText>
        ))}
      </View>
      {onAddNric && <AddButton onPress={onAddNric} text="+ Add"></AddButton>}
    </View>
    <View style={styles.childrenWrapper}>{children}</View>
  </Card>
);
