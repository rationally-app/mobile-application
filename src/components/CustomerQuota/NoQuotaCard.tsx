import React, { FunctionComponent } from "react";
import { compareDesc } from "date-fns";
import { differenceInSeconds, format, formatDistance } from "date-fns";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { CustomerCard } from "./CustomerCard";
import { AppText } from "../Layout/AppText";
import { color, size, fontSize } from "../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { Cart } from "../../hooks/useCart/useCart";
import { useProductContext } from "../../context/products";
import { getIdentifierInputDisplay } from "../../utils/getIdentifierInputDisplay";

const DURATION_THRESHOLD_SECONDS = 60 * 10; // 10 minutes

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline"
  },
  itemHeader: {
    marginTop: size(1.5),
    lineHeight: 1.5 * fontSize(0),
    marginBottom: -size(2),
    fontFamily: "brand-bold"
  },
  itemDetailWrapper: {
    flexDirection: "row"
  },
  itemDetailBorder: {
    borderLeftWidth: 1,
    borderLeftColor: color("grey", 30),
    marginLeft: size(1),
    marginRight: size(1)
  },
  itemDetail: {
    fontSize: fontSize(-1)
  },
  appealButton: {
    marginTop: size(1),
    marginBottom: 0,
    fontWeight: "bold",
    fontSize: size(2)
  }
});

const DistantTransactionTitle: FunctionComponent<{
  transactionTime: Date;
}> = ({ transactionTime }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>Limit reached on </AppText>
    <AppText style={sharedStyles.statusTitle}>
      {format(transactionTime, "hh:mm a, do MMMM")}.
    </AppText>
  </>
);

const RecentTransactionTitle: FunctionComponent<{
  now: Date;
  transactionTime: Date;
}> = ({ now, transactionTime }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>Limit reached </AppText>
    <AppText style={sharedStyles.statusTitle}>
      {formatDistance(now, transactionTime)}
    </AppText>
    <AppText style={sharedStyles.statusTitle}> ago.</AppText>
  </>
);

const ItemTransaction: FunctionComponent<{
  itemHeader: string;
  itemDetail: string;
}> = ({ itemHeader, itemDetail }) => (
  <>
    <View style={styles.itemRow}>
      <AppText style={styles.itemHeader}>{itemHeader}</AppText>
    </View>
    {!!itemDetail && (
      <View style={styles.itemDetailWrapper}>
        <View style={styles.itemDetailBorder} />
        <AppText style={styles.itemDetail}>{itemDetail}</AppText>
      </View>
    )}
  </>
);

const NoPreviousTransactionTitle: FunctionComponent = () => (
  <AppText style={sharedStyles.statusTitle}>Limit reached.</AppText>
);

const AppealButton: FunctionComponent<AppealButton> = ({ onAppeal }) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onAppeal();
      }}
    >
      <View style={{ alignItems: "center" }}>
        <AppText style={styles.appealButton}>{"Raise dispute"}</AppText>
      </View>
    </TouchableOpacity>
  );
};

interface AppealButton {
  onAppeal: () => void;
}

interface NoQuotaCard {
  ids: string[];
  cart: Cart;
  onCancel: () => void;
  onAppeal: () => void;
}

/**
 * Shows when the user cannot purchase anything
 *
 * Precondition: Only rendered when all items in cart have max quantity of 0
 */
export const NoQuotaCard: FunctionComponent<NoQuotaCard> = ({
  ids,
  cart,
  onCancel,
  onAppeal
}) => {
  const { getProduct, getAppeal } = useProductContext();

  const policyType = cart.length > 0 && getProduct(cart[0].category)?.type;

  const sortedCart = cart.sort((item1, item2) =>
    compareDesc(item1.lastTransactionTime ?? 0, item2.lastTransactionTime ?? 0)
  );

  const itemTransactions: { itemHeader: string; itemDetail: string }[] = [];
  sortedCart.forEach(
    ({ category, lastTransactionTime, identifierInputs = [] }) => {
      if (lastTransactionTime) {
        const policy = getProduct(category);
        const categoryName = policy?.name ?? category;
        const formattedDate = format(lastTransactionTime, "hh:mm a, do MMMM");
        itemTransactions.push({
          itemHeader: `${categoryName} (${formattedDate})`,
          itemDetail: getIdentifierInputDisplay(identifierInputs)
        });
      }
    }
  );

  const now = new Date();
  const latestTransactionTime = sortedCart[0]?.lastTransactionTime ?? undefined;
  const secondsFromLatestTransaction = latestTransactionTime
    ? differenceInSeconds(now, latestTransactionTime)
    : -1;

  return (
    <View>
      <CustomerCard ids={ids} headerBackgroundColor={color("red", 60)}>
        <View
          style={[
            sharedStyles.resultWrapper,
            sharedStyles.failureResultWrapper
          ]}
        >
          <Text style={sharedStyles.emoji}>❌</Text>
          <AppText style={sharedStyles.statusTitleWrapper}>
            {secondsFromLatestTransaction > 0 ? (
              secondsFromLatestTransaction > DURATION_THRESHOLD_SECONDS ? (
                <DistantTransactionTitle
                  transactionTime={latestTransactionTime!}
                />
              ) : (
                <RecentTransactionTitle
                  now={now}
                  transactionTime={latestTransactionTime!}
                />
              )
            ) : (
              <NoPreviousTransactionTitle />
            )}
          </AppText>
          {itemTransactions.length > 0 && (
            <View>
              <AppText style={{ marginBottom: size(1) }}>
                Item(s) {policyType === "REDEEM" ? "redeemed" : "purchased"}:
              </AppText>
              {itemTransactions.map(
                ({ itemHeader, itemDetail }, index: number) => (
                  <ItemTransaction
                    key={index}
                    itemHeader={itemHeader}
                    itemDetail={itemDetail}
                  />
                )
              )}
            </View>
          )}
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton text="Next identitys" onPress={onCancel} fullWidth={true} />
      </View>
      {getAppeal() ? <AppealButton onAppeal={onAppeal} /> : undefined}
    </View>
  );
};
