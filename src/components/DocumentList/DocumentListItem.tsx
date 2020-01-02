import React, { FunctionComponent } from "react";
import { Text, TouchableOpacity, StyleSheet, View } from "react-native";
import { VerifiedLabel } from "./VerifiedLabel";
import { color, fontSize, size, borderRadius } from "../../common/styles";
import { Feather } from "@expo/vector-icons";

const styles = StyleSheet.create({
  documentListItem: {
    minHeight: 152,
    borderRadius: borderRadius(3),
    marginBottom: size(2),
    backgroundColor: color("grey", 0),
    borderColor: color("grey", 15),
    borderWidth: 1,
    justifyContent: "flex-end",
    alignItems: "flex-start",
    padding: size(3)
  },
  iconWrapper: {
    marginBottom: size(1.5)
  },
  documentTitle: {
    color: color("grey", 40),
    fontWeight: "bold",
    fontSize: fontSize(0)
  },
  documentSubTitle: {
    marginTop: size(0.5),
    color: color("grey", 20),
    fontSize: fontSize(-1)
  },
  verifiedLabelWrapper: {
    position: "absolute",
    top: 0,
    right: 0,
    margin: size(2)
  }
});

export interface DocumentListItem {
  title: string;
  isVerified?: boolean;
  lastVerification?: number;
  issuedBy?: string;
  onPress: () => void;
}

export const DocumentListItem: FunctionComponent<DocumentListItem> = ({
  title,
  isVerified,
  onPress,
  issuedBy,
  lastVerification
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={styles.documentListItem}
    testID="document-list-item"
  >
    <View style={styles.iconWrapper}>
      <Feather name="file" size={size(2)} color={color("grey", 20)} />
    </View>
    {title && <Text style={styles.documentTitle}>{title}</Text>}
    {issuedBy && <Text style={styles.documentSubTitle}>{issuedBy}</Text>}
    {!isVerified && (
      <View style={styles.verifiedLabelWrapper}>
        <VerifiedLabel
          isVerified={isVerified}
          lastVerification={lastVerification}
        />
      </View>
    )}
  </TouchableOpacity>
);
