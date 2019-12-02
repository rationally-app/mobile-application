import React, { FunctionComponent } from "react";
import { View, Text, TouchableOpacity, TextStyle } from "react-native";
import { DARK, LIGHT } from "../../common/colors";
import { FontAwesome } from "@expo/vector-icons";

const mainFontStyle: TextStyle = {
  color: DARK,
  fontSize: 18,
  textAlign: "center",
  fontWeight: "bold"
};

interface EmptyDocumentList {
  onAdd: () => void;
}

export const EmptyDocumentList: FunctionComponent<EmptyDocumentList> = ({
  onAdd
}) => (
  <View
    testID="empty-document-list"
    style={{
      flex: 1,
      width: "100%",
      alignItems: "center",
      justifyContent: "center"
    }}
  >
    <View
      style={{
        width: "80%",
        padding: 24,
        borderRadius: 10,
        borderStyle: "dashed",
        borderWidth: 2,
        borderColor: LIGHT
      }}
    >
      <Text style={mainFontStyle}>Add a new document</Text>
      <Text style={mainFontStyle}>to your wallet</Text>
      <View style={{ alignItems: "center", marginTop: 12 }}>
        <TouchableOpacity
          testID="scanner-button"
          style={{
            backgroundColor: LIGHT,
            flexDirection: "row",
            alignItems: "center",
            padding: 5,
            borderRadius: 5
          }}
          onPress={onAdd}
        >
          <View style={{ padding: 5 }}>
            <FontAwesome name="qrcode" size={24} style={{ color: DARK }} />
          </View>
          <View style={{ padding: 5 }}>
            <Text style={{ color: DARK, fontWeight: "bold" }}>Add</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);
