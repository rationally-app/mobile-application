import React, { FunctionComponent } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { truncate } from "lodash";
import { VerifiedLabel } from "./VerifiedLabel";
import { DARK, VERY_LIGHT } from "../../common/colors";

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
    style={{ width: "100%", margin: 5 }}
    testID="document-list-item"
  >
    <View
      style={{
        backgroundColor: VERY_LIGHT,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 5
      }}
    >
      <Text style={{ color: DARK, fontWeight: "bold" }}>{truncate(title)}</Text>
      <VerifiedLabel
        isVerified={isVerified}
        lastVerification={lastVerification}
      />
    </View>
  </TouchableOpacity>
);
