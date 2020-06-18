import React, { FunctionComponent, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert,
  Vibration
} from "react-native";
import { size, color } from "../../common/styles";
import {
  withNavigationFocus,
  NavigationFocusInjectedProps
} from "react-navigation";
import { TopBackground } from "../Layout/TopBackground";
import { useConfigContext } from "../../context/config";
import { AppHeader } from "../Layout/AppHeader";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { Banner } from "../Layout/Banner";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { Card } from "../Layout/Card";
import { Credits } from "../Credits";
import { HelpModalContext } from "../../context/help";
import { VoucherInputSection } from "./VoucherInputSection";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { Feather } from "@expo/vector-icons";
import { validateMerchantCode } from "../../utils/validateMerchantCode";

const styles = StyleSheet.create({
  content: {
    position: "relative",
    padding: size(2),
    paddingVertical: size(8),
    height: "100%",
    width: 512,
    maxWidth: "100%"
  },
  headerText: {
    marginBottom: size(4)
  },
  bannerWrapper: {
    marginBottom: size(1.5)
  },
  buttonsWrapper: {
    marginTop: size(2),
    flexDirection: "row",
    alignItems: "center"
  },
  submitWrapper: {
    flex: 1,
    marginRight: size(1)
  }
});

export type Voucher = {
  serial: string;
  denomination: number;
};

export const MerchantPayoutScreen: FunctionComponent<NavigationFocusInjectedProps> = ({
  navigation
}) => {
  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);
  const [vouchers, setVouchers] = useState<Voucher[]>([
    { serial: "000000001", denomination: 2 }
  ]);
  const [merchantCode, setMerchantCode] = useState("");

  const redeemVouchers = (): void => {
    try {
      validateMerchantCode(merchantCode);
      Vibration.vibrate(50);
      Alert.alert("Valid Merchant Code");
    } catch (e) {
      Alert.alert("Error", e.message || e, [
        {
          text: "Dismiss"
        }
      ]);
    }
  };

  return (
    <>
      <ScrollView
        contentContainerStyle={{ alignItems: "center" }}
        scrollIndicatorInsets={{ right: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <KeyboardAvoidingView behavior="position">
          <TopBackground mode={config.appMode} />
          <View style={styles.content}>
            <View style={styles.headerText}>
              <AppHeader mode={config.appMode} />
            </View>
            {messageContent && (
              <View style={styles.bannerWrapper}>
                <Banner {...messageContent} />
              </View>
            )}
            <Card>
              <VoucherInputSection
                vouchers={vouchers}
                merchantCode={merchantCode}
                setMerchantCode={setMerchantCode}
                redeemVouchers={redeemVouchers}
              />
            </Card>
            {vouchers.length > 0 && (
              <View style={styles.buttonsWrapper}>
                <View style={styles.submitWrapper}>
                  <DarkButton
                    fullWidth={true}
                    text="Checkout"
                    icon={
                      <Feather
                        name="shopping-cart"
                        size={size(2)}
                        color={color("grey", 0)}
                      />
                    }
                    onPress={redeemVouchers}
                  />
                </View>
                <SecondaryButton
                  text="Cancel"
                  onPress={() => {
                    Alert.alert(
                      "Warning",
                      "Cancelling clears all vouchers. Are you sure?",
                      [
                        {
                          text: "No",
                          onPress: () => console.log("No Pressed")
                        },
                        {
                          text: "Yes",
                          onPress: () => {
                            setVouchers([]);
                            console.log("Yes Pressed");
                          },
                          style: "destructive"
                        }
                      ]
                    );
                  }}
                />
              </View>
            )}
            <FeatureToggler feature="HELP_MODAL">
              <HelpButton onPress={showHelpModal} />
            </FeatureToggler>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      <Credits style={{ bottom: size(3) }} />
    </>
  );
};

export const MerchantPayoutScreenContainer = withNavigationFocus(
  MerchantPayoutScreen
);
