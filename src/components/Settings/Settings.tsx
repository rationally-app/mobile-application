import React, { FunctionComponent } from "react";
import { ScreenView } from "../ScreenView";
import { Header } from "../Layout/Header";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { ScrollView, View, Text } from "react-native";
import { DARK } from "../../common/colors";
import { BottomNav } from "../Layout/BottomNav";
import { NavigationProps } from "../../types";
import { BuildView } from "./BuildView";

export interface Settings extends NavigationProps {
  onResetDocumentData: () => void;
}

export const SettingsView: FunctionComponent<{
  onResetDocumentData: () => void;
}> = ({ onResetDocumentData }) => {
  return (
    <ScrollView>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: 5
        }}
      >
        <Text>Delete all documents</Text>
        <DarkButton text="Delete" onPress={onResetDocumentData} />
      </View>
    </ScrollView>
  );
};

export const Settings: FunctionComponent<Settings> = ({
  onResetDocumentData,
  navigation
}) => {
  return (
    <ScreenView>
      <Header>
        <View style={{ alignItems: "center", flex: 1 }}>
          <Text style={{ fontWeight: "bold", color: DARK, fontSize: 18 }}>
            Settings
          </Text>
        </View>
      </Header>
      <View
        style={{
          flex: 1,
          padding: 12,
          justifyContent: "space-between"
        }}
      >
        <SettingsView onResetDocumentData={onResetDocumentData} />
        <BuildView />
      </View>
      <BottomNav navigation={navigation} />
    </ScreenView>
  );
};
