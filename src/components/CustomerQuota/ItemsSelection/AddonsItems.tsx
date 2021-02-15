import React, { FunctionComponent, useContext, useEffect } from "react";
import { ActivityIndicator, View } from "react-native";
import { color } from "../../../common/styles";
import { AlertModalContext } from "../../../context/alert";
import { AuthContext } from "../../../context/auth";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import { usePastTransaction } from "../../../hooks/usePastTransaction/usePastTransaction";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { TransactionsGroup } from "../TransactionsGroup";
import {
  groupTransactionsByCategory,
  sortTransactionsByCategory,
} from "../utils";

const BIG_NUMBER = 99999;

export const AddonsItems: FunctionComponent<{
  ids: string[];
  isShowAddons: boolean;
  categoryFilter?: string[];
}> = ({ ids, isShowAddons, categoryFilter }) => {
  const { sessionToken, endpoint } = useContext(AuthContext);
  const { policies: allProducts } = useContext(CampaignConfigContext);
  const { pastTransactionsResult, loading, error } = usePastTransaction(
    ids,
    sessionToken,
    endpoint,
    categoryFilter
  );

  const sortedTransactions = pastTransactionsResult;

  const { showErrorAlert } = useContext(AlertModalContext);
  useEffect(() => {
    if (error) {
      showErrorAlert(error);
    }
  }, [error, showErrorAlert]);
  const latestTransactionTime: Date | undefined =
    sortedTransactions && sortedTransactions.length > 0
      ? sortedTransactions[0].transactionTime
      : undefined;

  const translationProps = useTranslate();
  const transactionsByCategoryMap = groupTransactionsByCategory(
    sortedTransactions,
    allProducts || [],
    latestTransactionTime,
    translationProps
  );

  const transactionsByCategoryList = sortTransactionsByCategory(
    transactionsByCategoryMap
  );
  return loading && isShowAddons ? (
    <ActivityIndicator
      style={{ alignSelf: "flex-start" }}
      size="large"
      color={color("grey", 40)}
    />
  ) : (
    <View>
      {transactionsByCategoryList.map(
        (transactionsByCategory: TransactionsGroup, index: number) => (
          <TransactionsGroup
            key={index}
            maxTransactionsToDisplay={!isShowAddons ? 0 : BIG_NUMBER}
            {...transactionsByCategory}
            header={undefined}
          />
        )
      )}
    </View>
  );
};
