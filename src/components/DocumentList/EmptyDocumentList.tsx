import React, { FunctionComponent } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import QRIcon from "../../../assets/icons/qr.svg";
import {
  fontSize,
  color,
  shadow,
  size,
  borderRadius
} from "../../common/styles";

const styles = StyleSheet.create({
  emptyDocumentList: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  },
  callout: {
    width: 240,
    borderRadius: borderRadius(3),
    backgroundColor: color("grey", 0),
    ...shadow(1)
  },
  calloutText: {
    fontSize: fontSize(2),
    lineHeight: 1.3 * fontSize(2),
    padding: size(3)
  },
  calloutButton: {
    backgroundColor: color("orange", 30),
    flexDirection: "row",
    alignItems: "center",
    height: size(6),
    paddingHorizontal: size(3),
    borderRadius: borderRadius(3),
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0
  },
  calloutButtonText: {
    color: color("grey", 40),
    fontWeight: "bold",
    marginLeft: size(1.5)
  }
});

interface EmptyDocumentList {
  onAdd: () => void;
}

export const EmptyDocumentList: FunctionComponent<EmptyDocumentList> = ({
  onAdd
}) => (
  <View testID="empty-document-list" style={styles.emptyDocumentList}>
    <View style={styles.callout}>
      <Text style={styles.calloutText}>
        Start by adding a licence to your wallet
      </Text>

      <TouchableOpacity
        testID="scanner-button"
        style={styles.calloutButton}
        onPress={onAdd}
      >
        <QRIcon width={20} height={20} fill={color("grey", 40)} />
        <Text style={styles.calloutButtonText}>Scan to add</Text>
      </TouchableOpacity>
    </View>
  </View>
);
