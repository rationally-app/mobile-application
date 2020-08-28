import React, { FunctionComponent, useContext, useState } from "react";
import { compareDesc } from "date-fns";
import { differenceInSeconds, format, formatDistance } from "date-fns";
import { View, StyleSheet, TouchableOpacity } from "react-native";
import { CustomerCard } from "./CustomerCard";
import { AppText } from "../Layout/AppText";
import { color, size, fontSize } from "../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { Cart } from "../../hooks/useCart/useCart";
import { usePastTransaction } from "../../hooks/usePastTransaction/usePastTransaction";
import { Quota } from "../../types";
import { CampaignConfigContext } from "../../context/campaignConfig";
import { ProductContext } from "../../context/products";
import { getAllIdentifierInputDisplay } from "../../utils/getIdentifierInputDisplay";
import { AuthContext } from "../../context/auth";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { formatQuantityText } from "./utils";

const DURATION_THRESHOLD_SECONDS = 60 * 10; // 10 minutes
const MAX_TRANSACTIONS_TO_DISPLAY = 5;

const styles = StyleSheet.create({
  wrapper: {
    marginTop: size(2),
    marginBottom: size(2)
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline"
  },
  itemHeader: {
    lineHeight: 1.5 * fontSize(0),
    fontFamily: "brand-bold"
  },
  itemSubheader: {
    fontSize: fontSize(-1),
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
  },
  showFullListToggleBorder: {
    borderBottomWidth: 1,
    borderBottomColor: color("grey", 30),
    flex: 1
  },
  showFullListToggleWrapper: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
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

interface TransactionsByCategory {
  category: string;
  transactions: Transaction[];
}

interface Transaction {
  transactionDate: string;
  details: string;
  quantity: string;
  order?: number;
}

const TransactionsByCategory: FunctionComponent<{
  category: string;
  transactions: Transaction[];
  maxTransactionsToDisplay: number;
}> = ({ category, transactions, maxTransactionsToDisplay }) => {
  const shouldShowCategory =
    (transactions[0].order || 0) < maxTransactionsToDisplay;
  return shouldShowCategory ? (
    <View style={styles.wrapper}>
      <View style={styles.itemRow}>
        <AppText style={styles.itemHeader}>{category}</AppText>
      </View>
      {transactions.map(
        (transaction, index) =>
          (transaction.order || 0) < maxTransactionsToDisplay && (
            <Transaction key={index} {...transaction} />
          )
      )}
    </View>
  ) : null;
};

const Transaction: FunctionComponent<Transaction> = ({
  transactionDate,
  details,
  quantity
}) => (
  <>
    <View style={styles.itemRow}>
      <AppText style={styles.itemSubheader}>{transactionDate}</AppText>
      <AppText style={styles.itemSubheader}>{quantity}</AppText>
    </View>
    {!!details && (
      <View style={styles.itemDetailWrapper}>
        <View style={styles.itemDetailBorder} />
        <AppText style={styles.itemDetail}>{details}</AppText>
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

const ShowFullListToggle: FunctionComponent<{
  onClick: () => void;
  displayText: string;
  icon: any;
}> = ({ onClick, displayText, icon }) => (
  <View
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      marginTop: size(2),
      marginBottom: size(2)
    }}
  >
    <TouchableOpacity
      onPress={onClick}
      style={styles.showFullListToggleWrapper}
    >
      <View style={styles.showFullListToggleBorder} />
      {icon}
      <View style={styles.showFullListToggleBorder} />
    </TouchableOpacity>
    <AppText style={styles.itemHeader}>{displayText}</AppText>
  </View>
);

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
  const [isShowFullList, setIsShowFullList] = useState<boolean>(false);
  const { policies: allProducts } = useContext(CampaignConfigContext);
  const { getProduct } = useContext(ProductContext);
  const { sessionToken, endpoint } = useContext(AuthContext);

  const policyType = cart.length > 0 && getProduct(cart[0].category)?.type;

  const { pastTransactionsResult } = usePastTransaction(ids, sessionToken, endpoint);
  // Assumes results are already sorted (valid assumption for results from /transactions/history)
  const sortedTransactions = pastTransactionsResult?.pastTransactions;

  const latestTransactionTime: Date | undefined =
    sortedTransactions?.[0].transactionTime ?? undefined;
  const now = new Date();
  const secondsFromLatestTransaction = latestTransactionTime
    ? differenceInSeconds(now, latestTransactionTime)
    : -1;

  const transactionsByCategoryMap: {
    [category: string]: {
      transactions: Transaction[];
      hasLatestTransaction?: boolean;
    };
  } = {};
  sortedTransactions?.forEach(item => {
    const policy = allProducts.find(
      policy => policy.category === item.category
    );
    const categoryName = policy?.name ?? item.category;
    const formattedDate = format(item.transactionTime, "d MMM yyyy, h:mma");

    if (!(categoryName in transactionsByCategoryMap)) {
      transactionsByCategoryMap[categoryName] = {
        transactions: [],
        hasLatestTransaction: false
      };
    }
    transactionsByCategoryMap[categoryName].transactions.push({
      transactionDate: formattedDate,
      details: getAllIdentifierInputDisplay(item.identifierInputs ?? []),
      quantity: formatQuantityText(
        item.quantity,
        policy?.quantity.unit || { type: "POSTFIX", label: " qty" }
      )
    });
    // TODO: check if seconds is good, or need to change to minutes
    transactionsByCategoryMap[categoryName].hasLatestTransaction =
      transactionsByCategoryMap[categoryName].hasLatestTransaction ||
      differenceInSeconds(latestTransactionTime || 0, item.transactionTime) ===
        0;
  });

  const latestTransactionsByCategory: TransactionsByCategory[] = [];
  const otherTransactionsByCategory: TransactionsByCategory[] = [];
  Object.entries(transactionsByCategoryMap).forEach(([key, value]) => {
    const { transactions, hasLatestTransaction } = value;
    if (hasLatestTransaction) {
      latestTransactionsByCategory.push({
        category: key,
        transactions: transactions
      });
    } else {
      otherTransactionsByCategory.push({ category: key, transactions });
    }
  });

  const sortTransactionsByCategory = (
    a: TransactionsByCategory,
    b: TransactionsByCategory
  ): 1 | -1 | 0 =>
    a.category > b.category ? 1 : b.category > a.category ? -1 : 0;
  latestTransactionsByCategory.sort(sortTransactionsByCategory);
  otherTransactionsByCategory.sort(sortTransactionsByCategory);

  let transactionCounter = 0;
  const transactionsByCategoryList = latestTransactionsByCategory
    .concat(otherTransactionsByCategory)
    .map(transactionsByCategory => {
      const orderedTransactions = transactionsByCategory.transactions.map(
        transaction => {
          const result = { ...transaction, order: transactionCounter };
          transactionCounter += 1;
          return result;
        }
      );
      return { ...transactionsByCategory, transactions: orderedTransactions };
    });

  const hasAppealProduct = (): boolean => {
    return (
      allProducts?.some(policy => policy.categoryType === "APPEAL") ?? false
    );
  };

  const showGlobalQuota =
    !!quotaResponse?.globalQuota &&
    cart.length > 0 &&
    !!getProduct(cart[0].category)?.quantity.usage;

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
          {transactionsByCategoryList.length > 0 && (
            <View>
              <AppText style={styles.wrapper}>
                Item(s) {policyType === "REDEEM" ? "redeemed" : "purchased"}{" "}
                previously:
              </AppText>
              {transactionsByCategoryList.map(
                (
                  transactionsByCategory: TransactionsByCategory,
                  index: number
                ) => (
                  <TransactionsByCategory
                    key={index}
                    maxTransactionsToDisplay={
                      isShowFullList ? 99999 : MAX_TRANSACTIONS_TO_DISPLAY
                    }
                    {...transactionsByCategory}
                  />
                )
              )}
            </View>
          )}
          {transactionCounter > MAX_TRANSACTIONS_TO_DISPLAY && (
            <ShowFullListToggle
              onClick={() => setIsShowFullList(!isShowFullList)}
              displayText={isShowFullList ? "Show less" : "Show more"}
              icon={
                <Ionicons
                  name={
                    isShowFullList
                      ? "ios-arrow-dropup-circle"
                      : "ios-arrow-dropdown-circle"
                  }
                  size={size(4)}
                  color={color("blue", 50)}
                />
              }
            />
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
