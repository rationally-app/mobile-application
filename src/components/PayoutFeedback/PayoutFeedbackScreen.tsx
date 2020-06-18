import React, { FunctionComponent, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { NavigationProps } from "../../types";
import {
  size,
  color,
  fontSize,
  borderRadius,
  shadow
} from "../../common/styles";
import { AppHeader } from "../Layout/AppHeader";
import { useConfigContext } from "../../context/config";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { HelpModalContext } from "../../context/help";
import { TopBackground } from "../Layout/TopBackground";
import { Banner } from "../Layout/Banner";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { AppText } from "../Layout/AppText";
import { Feather } from "@expo/vector-icons";
import { DarkButton } from "../Layout/Buttons/DarkButton";

const styles = StyleSheet.create({
  content: {
    position: "relative",
    padding: size(1.5),
    paddingTop: size(8),
    paddingBottom: size(10),
    height: "100%",
    width: 512,
    maxWidth: "100%"
  },
  headerText: {
    marginBottom: size(2),
    fontFamily: "brand-bold",
    fontSize: fontSize(3)
  },
  bannerWrapper: {
    marginBottom: size(1.5)
  },
  card: {
    backgroundColor: color("green", 10),
    borderRadius: borderRadius(3),
    ...shadow(2)
  },
  emoji: {
    fontSize: fontSize(3),
    marginBottom: size(2)
  },
  cardHeaderText: {
    color: color("grey", 0)
  },
  cardHeaderWrapper: {
    backgroundColor: color("blue-green", 40),
    padding: size(3),
    flexDirection: "row",
    alignItems: "center",
    borderTopLeftRadius: borderRadius(3),
    borderTopRightRadius: borderRadius(3)
  },
  cardContextWrapper: {
    paddingHorizontal: size(3),
    paddingVertical: size(5)
  },
  buttonsWrapper: {
    marginTop: size(5)
  },
  valueText: {
    marginLeft: size(1),
    paddingLeft: size(1)
  }
});

export const PayoutFeedbackScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);
  const vouchers = navigation.getParam("vouchers", []);
  const merchantCode = navigation.getParam("merchantCode");

  return (
    <ScrollView
      contentContainerStyle={{ alignItems: "center" }}
      scrollIndicatorInsets={{ right: 1 }}
      keyboardShouldPersistTaps="handled"
    >
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

        <View style={styles.card}>
          <View style={styles.cardHeaderWrapper}>
            <Feather
              name="user"
              size={size(3)}
              color={color("grey", 0)}
              style={{ marginRight: size(1) }}
            />
            <View>
              <AppText style={styles.cardHeaderText}>Merchant Code</AppText>
              <AppText
                style={[styles.cardHeaderText, { fontFamily: "brand-bold" }]}
              >
                {merchantCode}
              </AppText>
            </View>
          </View>
          <View style={styles.cardContextWrapper}>
            <AppText style={styles.emoji}>✅</AppText>
            <AppText style={styles.headerText}>Paid!</AppText>
            <AppText style={{ marginBottom: size(2) }}>
              Item(s) redeemed:
            </AppText>
            <View>
              <AppText style={{ fontFamily: "brand-bold" }}>
                Voucher(s):
              </AppText>
              <AppText style={styles.valueText}>
                ${vouchers.length * vouchers[0].denomination}
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.buttonsWrapper}>
          <DarkButton
            fullWidth
            text="Next merchant"
            onPress={() => {
              navigation.navigate("MerchantPayoutScreen");
            }}
          />
        </View>

        <FeatureToggler feature="HELP_MODAL">
          <HelpButton onPress={showHelpModal} />
        </FeatureToggler>
      </View>
    </ScrollView>
  );
};
