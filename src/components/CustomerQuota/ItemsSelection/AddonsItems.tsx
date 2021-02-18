import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
} from "react";
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
  isShowAddonItems: boolean;
  categoryFilter?: string[];
}> = ({ ids, isShowAddonItems, categoryFilter }) => {
  const [transactionList, setTransactionList] = useState<TransactionsGroup[]>(
    []
  );
  const { sessionToken, endpoint } = useContext(AuthContext);
  const { policies: allProducts } = useContext(CampaignConfigContext);
  const {
    pastTransactionsResult: sortedTransactions,
    loading,
    error,
  } = usePastTransaction(ids, sessionToken, endpoint, categoryFilter);

  const { showErrorAlert } = useContext(AlertModalContext);
  useEffect(() => {
    if (error) {
      showErrorAlert(error);
    }
  }, [error, showErrorAlert]);
  const translationProps = useTranslate();

  useEffect(() => {
    const latestTransactionTime: Date | undefined =
      sortedTransactions && sortedTransactions.length > 0
        ? sortedTransactions[0].transactionTime
        : undefined;

    const transactionsByCategoryMap = groupTransactionsByCategory(
      sortedTransactions,
      allProducts || [],
      latestTransactionTime,
      translationProps
    );

    const transactionsByCategoryList = sortTransactionsByCategory(
      transactionsByCategoryMap
    );
    setTransactionList(transactionsByCategoryList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortedTransactions]);
  return loading && isShowAddonItems ? (
    <ActivityIndicator
      style={{ alignSelf: "flex-start" }}
      size="large"
      color={color("grey", 40)}
    />
  ) : (
    <View>
      {transactionList.map(
        (transactionsByCategory: TransactionsGroup, index: number) => (
          <TransactionsGroup
            key={index}
            maxTransactionsToDisplay={!isShowAddonItems ? 0 : BIG_NUMBER}
            {...transactionsByCategory}
            header={undefined}
          />
        )
      )}
    </View>
  );
};
