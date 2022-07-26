import React, { FunctionComponent, useContext } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { NavigationProps, PostTransactionResult } from "../../types";
import { size, color, fontSize, borderRadius } from "../../common/styles";
import { AppHeader } from "../Layout/AppHeader";
import { useConfigContext } from "../../context/config";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { HelpModalContext } from "../../context/help";
import { TopBackground } from "../Layout/TopBackground";
import { Banner } from "../Layout/Banner";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { AppText } from "../Layout/AppText";
import { Feather, FontAwesome } from "@expo/vector-icons";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { Card } from "../Layout/Card";
import { sharedStyles } from "../CustomerQuota/CheckoutSuccess/sharedStyles";
import { sharedStyles as sharedCardStyles } from "../CustomerQuota/sharedStyles";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

const styles = StyleSheet.create({
  content: {
    position: "relative",
    padding: size(1.5),
    paddingTop: size(8),
    paddingBottom: size(10),
    height: "100%",
    width: 512,
    maxWidth: "100%",
  },
  headerText: {
    marginBottom: size(4),
  },
  bannerWrapper: {
    marginBottom: size(1.5),
  },
  header: {
    borderTopLeftRadius: borderRadius(3),
    borderTopRightRadius: borderRadius(3),
    paddingHorizontal: size(2),
    paddingVertical: size(2),
    backgroundColor: color("blue-green", 40),
    flexDirection: "row",
    alignItems: "center",
  },
  cardHeaderTextWrapper: {
    marginLeft: size(1.5),
    flex: 1,
  },
  cardHeaderSubText: {
    color: color("grey", 0),
    fontSize: fontSize(-2),
    marginBottom: 2,
  },
  cardHeaderText: {
    color: color("grey", 0),
    fontSize: fontSize(1),
    lineHeight: 1.2 * fontSize(1),
    fontFamily: "brand-bold",
  },
  cardContextWrapper: {
    overflow: "hidden",
    borderBottomLeftRadius: borderRadius(2),
    borderBottomRightRadius: borderRadius(2),
  },
  resultWrapper: {
    padding: size(3),
    paddingBottom: size(4),
  },
  buttonsWrapper: {
    marginTop: size(5),
  },
});

export const PayoutFeedbackScreen: FunctionComponent<NavigationProps> = ({
  navigation,
}) => {
  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);
  const checkoutResult: PostTransactionResult = navigation.getParam(
    "checkoutResult"
  );
  const voucherArr = checkoutResult.transactions.filter(
    (transaction) =>
      transaction.transaction.filter((obj) => obj.category === "voucher")
        .length > 0
  );
  const itemQuantities = voucherArr.length;
  const merchantCode: string = navigation.getParam("merchantCode");

  const { i18nt } = useTranslate();

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
        <Card
          style={{
            paddingTop: 0,
            paddingBottom: 0,
            paddingHorizontal: 0,
          }}
        >
          <View style={styles.header}>
            <Feather name="user" size={size(3)} color={color("grey", 0)} />
            <View style={styles.cardHeaderTextWrapper}>
              <AppText style={styles.cardHeaderSubText}>
                {i18nt("merchantFlowScreen", "merchantCode")}
              </AppText>
              <AppText style={styles.cardHeaderText}>{merchantCode}</AppText>
            </View>
          </View>
          <View style={styles.cardContextWrapper}>
            <View
              style={[
                styles.resultWrapper,
                sharedCardStyles.successfulResultWrapper,
              ]}
            >
              <FontAwesome
                name="thumbs-up"
                color={color("blue-green", 40)}
                style={sharedCardStyles.icon}
              />
              <View style={sharedCardStyles.statusTitleWrapper}>
                <AppText
                  style={sharedCardStyles.statusTitle}
                  accessibilityLabel="redeemed!"
                  testID="redeemed"
                  accessible={true}
                >
                  {i18nt("checkoutSuccessScreen", "redeemed")}
                </AppText>
              </View>
              <AppText style={{ marginBottom: size(2) }}>
                {i18nt("checkoutSuccessScreen", "redeemedItems")}
              </AppText>
              <View>
                <View style={sharedStyles.itemRow}>
                  <AppText style={sharedStyles.itemHeaderText}>
                    {i18nt("merchantFlowScreen", "quotaCategoryVouchers")}:
                  </AppText>
                </View>
                <View style={sharedStyles.quantitiesWrapper}>
                  <View style={sharedStyles.quantitiesBorder} />
                  <View style={{ flexGrow: 1 }}>
                    <View style={sharedStyles.itemRow}>
                      <AppText style={sharedStyles.quantityByIdText}>
                        {itemQuantities}
                      </AppText>
                      <AppText style={sharedStyles.quantityByIdText}>
                        ${itemQuantities * 2}
                      </AppText>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </Card>

        <View style={styles.buttonsWrapper}>
          <DarkButton
            fullWidth={true}
            text={i18nt("merchantFlowScreen", "nextMerchant")}
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
