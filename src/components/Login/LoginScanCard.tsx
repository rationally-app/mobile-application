import React, { FunctionComponent } from "react";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { size, color } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { getTranslatedStringWithI18n } from "../../utils/translations";

const styles = StyleSheet.create({
  scanButtonWrapper: {
    marginTop: size(3)
  }
});

interface LoginScanCard {
  onToggleScanner: () => void;
  isLoading: boolean;
}

export const LoginScanCard: FunctionComponent<LoginScanCard> = ({
  onToggleScanner,
  isLoading
}) => (
  <Card>
    <AppText>
      {getTranslatedStringWithI18n("loginScanCard", "loginWithQR")}
    </AppText>
    <View style={styles.scanButtonWrapper}>
      <DarkButton
        text={getTranslatedStringWithI18n("loginScanCard", "scanToLogin")}
        onPress={onToggleScanner}
        icon={
          <Feather name="maximize" size={size(2)} color={color("grey", 0)} />
        }
        fullWidth={true}
        isLoading={isLoading}
      />
    </View>
  </Card>
);
