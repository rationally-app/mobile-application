import React, { FunctionComponent, useState } from "react";
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import { NavigationProps } from "../../types";
import { replaceRouteFn } from "../../common/navigation";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { color, size, borderRadius, fontSize } from "../../common/styles";
import { QuotaResponse, postTransaction } from "../../services/quota";
import { useAuthenticationContext } from "../../context/auth";
import { AppName } from "../Layout/AppName";
import { Card } from "../Layout/Card";
import { SecondaryButton } from "../Layout/Buttons/SecondaryButton";

const styles = StyleSheet.create({
  bg: {
    backgroundColor: color("blue", 50),
    width: "100%",
    height: 240,
    position: "absolute"
  },
  content: {
    position: "relative",
    padding: size(3),
    height: "100%",
    width: "100%"
  },
  headerText: {
    marginBottom: size(3)
  },
  nricText: {
    fontWeight: "bold",
    fontSize: fontSize(0)
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
    marginBottom: size(2)
  },
  statusTitle: {
    color: color("blue", 50),
    fontSize: fontSize(3),
    fontWeight: "bold",
    marginBottom: size(2)
  },
  statusMessage: {
    color: color("blue", 50),
    fontSize: fontSize(0),
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
    <Text style={styles.emoji}>✅</Text>
    <Text style={styles.statusTitle}>Purchased!</Text>
    <Text style={styles.statusMessage}>
      Customer has purchased 1 box of masks.
    </Text>
    <DarkButton text="Next customer" onPress={onCancel} />
  </>
);

const CanBuyResult: FunctionComponent<{
  isLoading: boolean;
  onRecordTransaction: () => Promise<void>;
  onCancel: () => void;
}> = ({ isLoading, onRecordTransaction, onCancel }) => (
  <>
    <Text style={styles.emoji}>👍</Text>
    <Text style={styles.statusTitle}>Can buy 1 box of masks</Text>
    {isLoading ? (
      <View style={{ height: size(6), justifyContent: "center" }}>
        <ActivityIndicator size="small" color={color("grey", 40)} />
      </View>
    ) : (
      <View style={styles.buttonRow}>
        <View style={{ marginRight: size(2) }}>
          <DarkButton text="Buy 1 box" onPress={onRecordTransaction} />
        </View>
        <SecondaryButton text="Cancel" onPress={onCancel} />
      </View>
    )}
  </>
);

const CannotBuyResult: FunctionComponent<{ onCancel: () => void }> = ({
  onCancel
}) => (
  <>
    <Text style={styles.emoji}>❌</Text>
    <Text style={styles.statusTitle}>Cannot buy</Text>
    <DarkButton text="Next customer" onPress={onCancel} />
  </>
);

export const CustomerQuotaScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const { authKey } = useAuthenticationContext();
  const quota: QuotaResponse = navigation.getParam("quota");
  const nric: string = navigation.getParam("nric");
  const [quantity, setQuantity] = useState("1");
  const [hasPurchased, setHasPurchased] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

      const transactions = await postTransaction(nric, qtyNum, authKey);

      // TODO: error handling

      setHasPurchased(true);
      // replaceRouteFn(navigation, "TransactionConfirmationScreen", {
      //   transactions,
      //   nric
      // })();
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
    <View>
      <View style={styles.bg} />
      <SafeAreaView>
        <View style={styles.content}>
          <View style={styles.headerText}>
            <AppName />
          </View>
          <Card>
            <Text style={styles.nricText}>Customer NRIC: {nric}</Text>
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
              {/* <Text>{quota.remainingQuota} masks left</Text>
              <Text>Enter quantity to buy...</Text>
              <TextInput
                autoFocus={true}
                style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
                value={quantity}
                onChange={({ nativeEvent: { text } }) => setQuantity(text)}
                keyboardType="numeric"
              />
              <DarkButton text="Buy Mask" onPress={onRecordTransaction} />
              <DarkButton text="Cancel" onPress={onCancel} /> */}
            </View>
          </Card>
        </View>
      </SafeAreaView>
    </View>
  );
};
