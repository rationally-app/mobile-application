import React, { FunctionComponent } from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";
import { VerifiedLabel } from "./VerifiedLabel";
import { color, fontSize, size, borderRadius } from "../../common/styles";

const styles = StyleSheet.create({
  documentListItem: {
    minHeight: size(6),
    borderRadius: borderRadius(2),
    marginBottom: size(1.5),
    backgroundColor: color("grey", 0),
    borderColor: color("grey", 15),
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: size(1),
    paddingVertical: size(1)
  },
  documentTitle: {
    color: color("grey", 40),
    fontWeight: "bold",
    fontSize: fontSize(0),
    paddingHorizontal: size(1),
    flexShrink: 1
  }
});

export interface DocumentListItem {
  title: string;
  isVerified?: boolean;
  lastVerification?: number;
  onPress: () => void;
}

export const DocumentListItem: FunctionComponent<DocumentListItem> = ({
  title,
  isVerified,
  onPress,
  lastVerification
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.documentListItem}
    testID="document-list-item"
  >
    <Text style={styles.documentTitle}>{title}</Text>
    {!isVerified && (
      <VerifiedLabel
        isVerified={isVerified}
        lastVerification={lastVerification}
      />
    )}
  </TouchableOpacity>
);
