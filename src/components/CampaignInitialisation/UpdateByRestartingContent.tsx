import React, { FunctionComponent } from "react";
import { AppText } from "../Layout/AppText";
import { sharedStyles } from "./sharedStyles";
import { View, Linking } from "react-native";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { Feather } from "@expo/vector-icons";
import { Updates } from "expo";
import { size, color } from "../../common/styles";

export const UpdateByRestartingContent: FunctionComponent = () => {
  const supportLink = `mailto:supplyallyhelp@hive.gov.sg?subject=[SupplyAlly OTA Update Error]`;
  return (
    <>
      <AppText style={sharedStyles.emoji}>📦</AppText>
      <AppText style={sharedStyles.heading}>
        SupplyAlly needs to be updated
      </AppText>
      <AppText style={sharedStyles.description}>
        Please restart the app to receive the latest updates and continue using
        SupplyAlly.
      </AppText>
      <AppText style={sharedStyles.additionalInfo}>
        If this persists, drop us an email at{" "}
        <AppText
          style={sharedStyles.emailLink}
          onPress={() => Linking.openURL(supportLink)}
        >
          supplyallyhelp@hive.gov.sg
        </AppText>
      </AppText>

      <View style={sharedStyles.ctaButton}>
        <DarkButton
          text="Restart app"
          onPress={() => Updates.reload()}
          icon={
            <Feather
              name="refresh-cw"
              size={size(2)}
              color={color("grey", 0)}
            />
          }
        />
      </View>
    </>
  );
};
