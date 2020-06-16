import React, { FunctionComponent, useContext, useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Alert
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

export const MerchantPayoutScreen: FunctionComponent<NavigationFocusInjectedProps> = ({
  navigation
}) => {
  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);
  const [vouchers, setVouchers] = useState([{ valid: 5, invalid: 3 }]);
  const [merchantCode, setMerchantCode] = useState("");

  const submitMerchantCode = (): void => {
    if (!validateMerchantCode(merchantCode)) {
      return Alert.alert(
        "Error",
        "Invalid Merchant Code",
        [
          {
            text: "Dismiss"
          }
        ],
        {}
      );
    }
    Alert.alert("Valid Merchant Code");
  };

  const onCancel = (): void => {
    Alert.alert("Warning", "Cancelling clears all vouchers. Are you sure?", [
      {
        text: "Yes",
        onPress: () => {
          setVouchers([]);
          console.log("Yes Pressed");
        }
      },
      {
        text: "No",
        onPress: () => console.log("No Pressed")
      }
    ]);
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
                submitMerchantCode={submitMerchantCode}
              />
            </Card>
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
                  onPress={submitMerchantCode}
                />
              </View>
              <SecondaryButton text="Cancel" onPress={onCancel} />
            </View>
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
