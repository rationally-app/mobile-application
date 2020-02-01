import React, { FunctionComponent, useState } from "react";
import { View, StyleSheet, SafeAreaView } from "react-native";
import { NavigationProps } from "../../types";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { color, size, borderRadius, fontSize } from "../../common/styles";
import { QuotaResponse, postTransaction } from "../../services/quota";
import { useAuthenticationContext } from "../../context/auth";
import { AppName } from "../Layout/AppName";
import { Card } from "../Layout/Card";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";
import { AppText } from "../Layout/AppText";
import { TopBackground } from "../Layout/TopBackground";
import { Credits } from "../Credits";

const styles = StyleSheet.create({
  content: {
    position: "relative",
    padding: size(3),
    paddingVertical: size(8),
    height: "100%",
    width: 512,
    maxWidth: "100%"
  },
  headerText: {
    marginBottom: size(3)
  },
  nricText: {
    fontFamily: "inter-bold"
  },
  resultWrapper: {
    marginTop: size(3),
    marginHorizontal: -size(3),
    marginBottom: -size(4),
    paddingHorizontal: size(3),
    paddingVertical: size(4),
    borderBottomLeftRadius: borderRadius(4),
    borderBottomRightRadius: borderRadius(4),
    borderWidth: 1
  },
  successfulResultWrapper: {
    backgroundColor: color("green", 10),
    borderColor: color("green", 20)
  },
  failureResultWrapper: {
    backgroundColor: color("red", 10),
    borderColor: color("red", 20)
  },
  emoji: {
    fontSize: fontSize(3),
    marginBottom: size(1)
  },
  statusTitle: {
    fontSize: fontSize(3),
    fontFamily: "inter-bold",
    marginBottom: size(2)
  },
  statusMessage: {
    marginBottom: size(3)
  },
  buttonRow: {
    flexDirection: "row"
  }
});

const PurchasedResult: FunctionComponent<{ onCancel: () => void }> = ({
  onCancel
}) => (
  <>
    <AppText style={styles.emoji}>✅</AppText>
    <AppText style={styles.statusTitle}>Purchased 1 box!</AppText>
    <AppText style={styles.statusMessage}>
      Customer can purchase another box in a week.
    </AppText>
    <DarkButton text="Next customer" onPress={onCancel} fullWidth={true} />
  </>
);

const CanBuyResult: FunctionComponent<{
  isLoading: boolean;
  onRecordTransaction: () => Promise<void>;
  onCancel: () => void;
}> = ({ isLoading, onRecordTransaction, onCancel }) => (
  <>
    <AppText style={styles.emoji}>👍</AppText>
    <AppText style={styles.statusTitle}>Customer can purchase</AppText>
    <AppText style={styles.statusMessage}>
      They have 1 box left until next week.
    </AppText>
    <View style={styles.buttonRow}>
      <View style={{ marginRight: size(2) }}>
        <DarkButton
          text="Buy 1 box"
          onPress={onRecordTransaction}
          isLoading={isLoading}
        />
      </View>
      {!isLoading && <SecondaryButton text="Cancel" onPress={onCancel} />}
    </View>
  </>
);

const CannotBuyResult: FunctionComponent<{ onCancel: () => void }> = ({
  onCancel
}) => (
  <>
    <AppText style={styles.emoji}>❌</AppText>
    <AppText style={styles.statusTitle}>Customer cannot purchase</AppText>
    <AppText style={styles.statusMessage}>
      Customer can purchase 1 box in a week.
    </AppText>
    <DarkButton text="Next customer" onPress={onCancel} fullWidth={true} />
  </>
);

export const CustomerQuotaScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const { authKey } = useAuthenticationContext();
  const quota: QuotaResponse = navigation.getParam("quota");
  const nric: string = navigation.getParam("nric");
  const [quantity] = useState("1");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // TODO: provide the correct date to buy another box of masks
  const canBuy = quota.remainingQuota > 0;

  const onRecordTransaction = async (): Promise<void> => {
    try {
      setIsLoading(true);
      // Checks if quantity is correct
      const qtyNum = Number(quantity);
      if (isNaN(qtyNum)) throw new Error("Invalid quantity");
      if (!Number.isInteger(qtyNum))
        throw new Error("Quantity cannot have decimals");
      if (qtyNum > quota.remainingQuota)
        throw new Error("Quantity cannot exceed quota");
      if (qtyNum <= 0) throw new Error("Quantity must be greater than 0");

      await postTransaction(nric, qtyNum, authKey);
      // TODO: error handling

      setHasPurchased(true);
    } catch (e) {
      alert(e.message || e);
    } finally {
      setIsLoading(false);
    }
  };

  const onCancel = (): void => {
    navigation.goBack();
  };

  return (
    <View style={{ alignItems: "center" }}>
      <TopBackground />
      <SafeAreaView>
        <View style={styles.content}>
          <View style={styles.headerText}>
            <AppName />
          </View>
          <Card>
            <AppText style={styles.nricText}>Customer NRIC: {nric}</AppText>
            <View
              style={[
                styles.resultWrapper,
                hasPurchased || canBuy
                  ? styles.successfulResultWrapper
                  : styles.failureResultWrapper
              ]}
            >
              {hasPurchased ? (
                <PurchasedResult onCancel={onCancel} />
              ) : canBuy ? (
                <CanBuyResult
                  isLoading={isLoading}
                  onRecordTransaction={onRecordTransaction}
                  onCancel={onCancel}
                />
              ) : (
                <CannotBuyResult onCancel={onCancel} />
              )}
            </View>
          </Card>
        </View>
        <Credits style={{ bottom: size(3) }} />
      </SafeAreaView>
    </View>
  );
};
