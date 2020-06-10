import React, { FunctionComponent } from "react";
import { compareDesc } from "date-fns";
import { differenceInSeconds, format, formatDistance } from "date-fns";
import { View, StyleSheet } from "react-native";
import { CustomerCard } from "./CustomerCard";
import { AppText } from "../Layout/AppText";
import { color, size, fontSize } from "../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { Cart } from "../../hooks/useCart/useCart";
import { useProductContext } from "../../context/products";

const DURATION_THRESHOLD_SECONDS = 60 * 10; // 10 minutes

const styles = StyleSheet.create({
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline"
  },
  itemHeader: {
    marginTop: size(1),
    lineHeight: 1.5 * fontSize(0),
    marginBottom: -size(2)
  },
  itemSubheaderWrapper: {
    flexDirection: "row",
    marginTop: size(0.5)
  },
  itemSubheaderBorder: {
    borderLeftWidth: 1,
    borderLeftColor: color("grey", 30),
    marginLeft: size(1),
    marginRight: size(1)
  },
  itemSubheaderText: {
    fontSize: fontSize(-1)
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
  header: string;
  subheader: string;
}> = ({ header, subheader }) => (
  <>
    <View style={styles.itemRow}>
      <AppText style={styles.itemHeader}>{header}</AppText>
    </View>
    {!!subheader && (
      <View style={styles.itemSubheaderWrapper}>
        <View style={styles.itemSubheaderBorder} />
        <AppText style={styles.itemSubheaderText}>{subheader}</AppText>
      </View>
    )}
  </>
);

const NoPreviousTransactionTitle: FunctionComponent = () => (
  <AppText style={sharedStyles.statusTitle}>Limit reached.</AppText>
);

interface NoQuotaCard {
  nrics: string[];
  cart: Cart;
  onCancel: () => void;
}

/**
 * Shows when the user cannot purchase anything
 *
 * Precondition: Only rendered when all items in cart have max quantity of 0
 */
export const NoQuotaCard: FunctionComponent<NoQuotaCard> = ({
  nrics,
  cart,
  onCancel
}) => {
  const { getProduct } = useProductContext();

  const sortedCart = cart.sort((item1, item2) =>
    compareDesc(item1.lastTransactionTime ?? 0, item2.lastTransactionTime ?? 0)
  );

  const itemTransactions: { header: string; subheader: string }[] = [];
  sortedCart.forEach(({ category, lastTransactionTime, identifiers }) => {
    if (lastTransactionTime) {
      const categoryName = getProduct(category)?.name ?? category;
      const formattedDate = format(lastTransactionTime, "hh:mm a, do MMMM");
      itemTransactions.push({
        header: `• ${categoryName} (${formattedDate})`,
        subheader:
          identifiers && identifiers.length > 0
            ? `${identifiers[0].value} — ${
                identifiers[identifiers.length - 1].value
              }`
            : ""
      });
    }
  });

  const now = new Date();
  const latestTransactionTime = sortedCart[0]?.lastTransactionTime ?? undefined;
  const secondsFromLatestTransaction = latestTransactionTime
    ? differenceInSeconds(now, latestTransactionTime)
    : -1;

  return (
    <View>
      <CustomerCard nrics={nrics} headerBackgroundColor={color("red", 60)}>
        <View
          style={[
            sharedStyles.resultWrapper,
            sharedStyles.failureResultWrapper
          ]}
        >
          <AppText style={sharedStyles.emoji}>❌</AppText>
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
              <AppText>When limits were reached:</AppText>
              {itemTransactions.map(
                (
                  { header, subheader }: { header: string; subheader: string },
                  index: number
                ) => (
                  <ItemTransaction
                    key={index}
                    header={header}
                    subheader={subheader}
                  />
                )
              )}
            </View>
          )}
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton text="Next customer" onPress={onCancel} fullWidth={true} />
      </View>
    </View>
  );
};
