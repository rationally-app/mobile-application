import React, { FunctionComponent, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { CustomerCard } from "../CustomerCard";
import { AppText } from "../../Layout/AppText";
import { sharedStyles } from "../sharedStyles";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { CartHook } from "../../../hooks/useCart/useCart";
import { size, color } from "../../../common/styles";
import { getCheckoutMessages } from "./checkoutMessages";
import { FontAwesome } from "@expo/vector-icons";
import { Quota, Transaction } from "../../../types";
import { ProductContext } from "../../../context/products";
import { AuthContext } from "../../../context/auth";
import { format } from "date-fns";
import { usePastTransaction } from "../../../hooks/usePastTransaction/usePastTransaction";
import { getAllIdentifierInputDisplay } from "../../../utils/getIdentifierInputDisplay";
import { formatQuantityText } from "../utils";
import { TransactionsGroup } from "../TransactionsGroup";
import { CampaignConfigContext } from "../../../context/campaignConfig";

const styles = StyleSheet.create({
  checkoutItemsList: {
    marginTop: size(2)
  }
});

interface CheckoutSuccessCard {
  ids: string[];
  onCancel: () => void;
  checkoutResult: CartHook["checkoutResult"];
  quotaResponse: Quota | null;
}

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

export const CheckoutSuccessCard: FunctionComponent<CheckoutSuccessCard> = ({
  ids,
  onCancel,
  checkoutResult,
  quotaResponse
}) => {
  const { getProduct } = useContext(ProductContext);
  const { policies: allProducts } = useContext(CampaignConfigContext);
  const { sessionToken, endpoint } = useContext(AuthContext);
  const { pastTransactionsResult } = usePastTransaction(
    ids,
    sessionToken,
    endpoint
  );
  // Assumes results are already sorted (valid assumption for results from /transactions/history)
  const sortedTransactions = pastTransactionsResult;

  // Group transactions by transaction time (round to seconds)
  const transactionsByTimeMap: {
    [transactionTimeInSeconds: string]: {
      formattedDate: string;
      transactions: Transaction[];
    };
  } = {};
  sortedTransactions?.forEach(item => {
    const policy = allProducts?.find(
      policy => policy.category === item.category
    );
    const categoryName = policy?.name ?? item.category;
    const transactionTimeInSeconds = String(
      Math.floor(item.transactionTime.getTime() / 1000)
    );

    if (!(transactionTimeInSeconds in transactionsByTimeMap)) {
      transactionsByTimeMap[transactionTimeInSeconds] = {
        formattedDate: format(
          item.transactionTime.getTime(),
          "d MMM yyyy, h:mma"
        ),
        transactions: []
      };
    }
    transactionsByTimeMap[transactionTimeInSeconds].transactions.push({
      header: categoryName,
      details: getAllIdentifierInputDisplay(item.identifierInputs ?? []),
      quantity: formatQuantityText(
        item.quantity,
        policy?.quantity.unit || { type: "POSTFIX", label: " qty" }
      ),
      isAppeal: policy?.categoryType === "APPEAL"
    });
  });

  // Transform map to array of transactions group
  const transactionsByTimeList: TransactionsGroup[] = Object.entries(
    transactionsByTimeMap
  ).map(([, value]) => ({
    header: value.formattedDate,
    transactions: value.transactions.sort(sortByHeaderAsc)
  }));

  // Order each group of transactions by category
  transactionsByTimeList.sort((a, b) => -sortByHeaderAsc(a, b));

  const productType = getProduct(allProducts[0].category)?.type;
  const { title, description, ctaButtonText } = getCheckoutMessages(
    productType
  );

  const showGlobalQuota: boolean =
    !!quotaResponse?.globalQuota &&
    !!getProduct(checkoutQuantities[0].category)?.quantity.usage;

  return (
    <View>
      <CustomerCard ids={ids}>
        <View
          style={[
            sharedStyles.resultWrapper,
            sharedStyles.successfulResultWrapper
          ]}
        >
          <FontAwesome
            name="thumbs-up"
            color={color("blue-green", 40)}
            style={sharedStyles.icon}
          />
          <AppText style={sharedStyles.statusTitleWrapper}>
            <AppText style={sharedStyles.statusTitle}>{title}</AppText>
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
          <View>
            <AppText>{description}</AppText>
            <View style={styles.checkoutItemsList}>
              {transactionsByTimeList.map(
                (transactionsByTime: TransactionsGroup, index: number) => (
                  <TransactionsGroup
                    key={index}
                    maxTransactionsToDisplay={99999}
                    {...transactionsByTime}
                  />
                )
              )}
            </View>
          </View>
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton text={ctaButtonText} onPress={onCancel} fullWidth={true} />
      </View>
    </View>
  );
};
