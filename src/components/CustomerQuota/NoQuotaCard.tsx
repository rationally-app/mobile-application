import React, { FunctionComponent } from "react";
import { compareDesc } from "date-fns";
import { differenceInSeconds, format, formatDistance } from "date-fns";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { CustomerCard } from "./CustomerCard";
import { AppText } from "../Layout/AppText";
import { color, size, fontSize } from "../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { Cart } from "../../hooks/useCart/useCart";
import { useProductContext } from "../../context/products";
import {
  getIdentifierInputDisplay,
  getAllIdentifierInputDisplay
} from "../../utils/getIdentifierInputDisplay";
import { usePastTransaction } from "../../hooks/usePastTransaction/usePastTransaction";
import { useAuthenticationContext } from "../../context/auth";
import { FontAwesome } from "@expo/vector-icons";
import { Quota } from "../../types";

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
  appealButtonText: {
    marginTop: size(1),
    marginBottom: 0,
    fontFamily: "brand-bold",
    fontSize: size(2)
  }
});

const DistantTransactionTitle: FunctionComponent<{
  transactionTime: Date;
  toggleTimeSensitiveTitle: boolean;
}> = ({ transactionTime, toggleTimeSensitiveTitle }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>Limit reached on </AppText>
    <AppText style={sharedStyles.statusTitle}>
      {format(transactionTime, "d MMM yyyy, h:mma")}
    </AppText>
    {toggleTimeSensitiveTitle ? (
      <AppText style={sharedStyles.statusTitle}> for today.</AppText>
    ) : (
      <AppText style={sharedStyles.statusTitle}>.</AppText>
    )}
  </>
);

const RecentTransactionTitle: FunctionComponent<{
  now: Date;
  transactionTime: Date;
  toggleTimeSensitiveTitle: boolean;
}> = ({ now, transactionTime, toggleTimeSensitiveTitle }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>Limit reached </AppText>
    <AppText style={sharedStyles.statusTitle}>
      {formatDistance(now, transactionTime)}
    </AppText>
    <AppText style={sharedStyles.statusTitle}> ago</AppText>
    {toggleTimeSensitiveTitle ? (
      <AppText style={sharedStyles.statusTitle}> for today.</AppText>
    ) : (
      <AppText style={sharedStyles.statusTitle}>.</AppText>
    )}
  </>
);

const UsageQuotaTitle: FunctionComponent<{
  quantity: number;
  quotaRefreshTime: number;
}> = ({ quantity, quotaRefreshTime }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>
      {"\n"}
      {quantity} item(s) more till {format(quotaRefreshTime, "d MMM yyyy")}.
    </AppText>
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

const NoPreviousTransactionTitle: FunctionComponent<{
  toggleTimeSensitiveTitle: boolean;
}> = ({ toggleTimeSensitiveTitle }) => (
  <>
    <AppText style={sharedStyles.statusTitle}>Limit reached</AppText>
    {toggleTimeSensitiveTitle ? (
      <AppText style={sharedStyles.statusTitle}> for today.</AppText>
    ) : (
      <AppText style={sharedStyles.statusTitle}>.</AppText>
    )}
  </>
);

const AppealButton: FunctionComponent<AppealButton> = ({ onAppeal }) => {
  return (
    <TouchableOpacity onPress={onAppeal}>
      <View style={{ alignItems: "center" }}>
        <AppText style={styles.appealButtonText}>Raise an appeal</AppText>
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
  onAppeal?: () => void;
  quotaResponse: Quota | null;
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
  onAppeal,
  quotaResponse
}) => {
  const { getProduct, allProducts } = useProductContext();
  const { token, endpoint } = useAuthenticationContext();

  const policyType = cart.length > 0 && getProduct(cart[0].category)?.type;

  const itemTransactions: { itemHeader: string; itemDetail: string }[] = [];
  let latestTransactionTime: Date | undefined = new Date();
  /**
   * Refactoring of Limit Reached Screen TBD
   * Current Limit Reached Screen caters for the following scenarios
   * 1. Listing of categories with latest transacted time; no identifiers and/or group transactions
   * 2. Listing of past transactions with identifiers and transacted time; identifier and single ID transactions
   */

  // This hook is only used in single ID transaction
  const { pastTransactionsResult } = usePastTransaction(
    ids[0],
    token,
    endpoint
  );

  if (
    ids.length > 1 ||
    allProducts.some(product => product.identifiers === undefined)
  ) {
    // For first scenario, cart provides an aggregated summary of the transacted categories
    // since it fetch data from quota endpoint
    // current distributions don't allow group transactions with identifiers
    // if it does, default to aggregated summary
    const sortedCart = cart.sort((item1, item2) =>
      compareDesc(
        item1.lastTransactionTime ?? 0,
        item2.lastTransactionTime ?? 0
      )
    );
    sortedCart.forEach(
      ({ category, lastTransactionTime, identifierInputs = [] }) => {
        if (lastTransactionTime) {
          const policy = getProduct(category);
          const categoryName = policy?.name ?? category;
          const formattedDate = format(
            lastTransactionTime,
            "d MMM yyyy, h:mma"
          );
          itemTransactions.push({
            itemHeader: `${categoryName} (${formattedDate})`,
            itemDetail: getIdentifierInputDisplay(identifierInputs)
          });
        }
      }
    );
    latestTransactionTime = sortedCart[0]?.lastTransactionTime ?? undefined;
  } else {
    // For second scenario, transactions with identifiers would require to show details transactions
    // hence, data will fetch from transactions endpoint
    const sortedTransactions = pastTransactionsResult?.pastTransactions.sort(
      (item1, item2) =>
        compareDesc(item1.transactionTime ?? 0, item2.transactionTime ?? 0)
    );

    sortedTransactions?.forEach(item => {
      const policy = allProducts.find(
        policy => policy.category === item.category
      );
      const categoryName = policy?.name ?? item.category;
      const formattedDate = format(item.transactionTime, "d MMM yyyy, h:mma");
      itemTransactions.push({
        itemHeader: `${categoryName} (${formattedDate})`,
        itemDetail: getAllIdentifierInputDisplay(item.identifierInputs ?? [])
      });
    });

    latestTransactionTime =
      sortedTransactions?.[0].transactionTime ?? undefined;
  }

  const now = new Date();
  const secondsFromLatestTransaction = latestTransactionTime
    ? differenceInSeconds(now, latestTransactionTime)
    : -1;

  const hasAppealProduct = (): boolean => {
    return allProducts.some(policy => policy.categoryType === "APPEAL");
  };

  const showGlobalQuota =
    quotaResponse?.globalQuota &&
    cart.length > 0 &&
    getProduct(cart[0].category) &&
    !!getProduct(cart[0].category)!.quantity.usage;

  return (
    <View>
      <CustomerCard ids={ids} headerBackgroundColor={color("red", 60)}>
        <View
          style={[
            sharedStyles.resultWrapper,
            sharedStyles.failureResultWrapper
          ]}
        >
          <FontAwesome
            name="thumbs-down"
            color={color("red", 60)}
            style={sharedStyles.icon}
          />
          <AppText style={sharedStyles.statusTitleWrapper}>
            {secondsFromLatestTransaction > 0 ? (
              secondsFromLatestTransaction > DURATION_THRESHOLD_SECONDS ? (
                <DistantTransactionTitle
                  transactionTime={latestTransactionTime!}
                  toggleTimeSensitiveTitle={showGlobalQuota}
                />
              ) : (
                <RecentTransactionTitle
                  now={now}
                  transactionTime={latestTransactionTime!}
                  toggleTimeSensitiveTitle={showGlobalQuota}
                />
              )
            ) : (
              <NoPreviousTransactionTitle
                toggleTimeSensitiveTitle={showGlobalQuota}
              />
            )}
            {showGlobalQuota &&
              quotaResponse!.globalQuota!.map(
                ({ quantity, quotaRefreshTime }, index: number) =>
                  quotaRefreshTime ? (
                    <UsageQuotaTitle
                      key={index}
                      quantity={quantity}
                      quotaRefreshTime={quotaRefreshTime}
                    />
                  ) : undefined
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
        <DarkButton text="Next identity" onPress={onCancel} fullWidth={true} />
      </View>
      {onAppeal && hasAppealProduct() ? (
        <AppealButton onAppeal={onAppeal} />
      ) : undefined}
    </View>
  );
};
