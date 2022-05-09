import React, { FunctionComponent, useContext, useEffect } from "react";
import {
  TouchableOpacity,
  StyleSheet,
  GestureResponderEvent,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { color, size } from "../../../common/styles";
import { AppText } from "../../Layout/AppText";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";
import { Translations } from "../../../common/i18n/translations/type";
import { AuthContext } from "../../../context/auth";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import { usePastTransaction } from "../../../hooks/usePastTransaction/usePastTransaction";
import { AlertModalContext } from "../../../context/alert";
import {
  groupTransactionsByCategory,
  sortTransactionsByCategory,
} from "../utils";
import { TransactionsGroup } from "../TransactionsGroup";
import { NetworkError } from "../../../services/helpers";

const styles = StyleSheet.create({
  descriptionAlert: {
    fontFamily: "brand-italic",
    color: color("red", 50),
    marginTop: size(2),
  },
});

export type DescriptionAlertTypes = keyof Translations["addonsToggleComponent"];

export const ShowAddonsToggle: FunctionComponent<{
  descriptionAlert: DescriptionAlertTypes;
  toggleIsShowAddons?: (e: GestureResponderEvent) => void;
  isShowAddons?: boolean;
  addonsTransactionList: TransactionsGroup[];
  setAddonsTransactionList: (transactions: TransactionsGroup[]) => void;
  ids: string[];
  categoryFilter?: string;
}> = ({
  descriptionAlert,
  toggleIsShowAddons,
  isShowAddons,
  addonsTransactionList,
  setAddonsTransactionList,
  ids,
  categoryFilter,
}) => {
  const { sessionToken, endpoint } = useContext(AuthContext);
  const { policies: allProducts } = useContext(CampaignConfigContext);
  const {
    pastTransactionsResult: sortedTransactions,
    loading,
    error,
  } = usePastTransaction(
    ids,
    sessionToken,
    endpoint,
    categoryFilter ? [categoryFilter] : undefined,
    true
  );

  const { showErrorAlert } = useContext(AlertModalContext);
  useEffect(() => {
    if (error) {
      if (error instanceof NetworkError) {
        throw error; // Let error boundary handle.
      }
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
    setAddonsTransactionList(transactionsByCategoryList);
  }, [
    sortedTransactions,
    allProducts,
    translationProps,
    setAddonsTransactionList,
  ]);
  return addonsTransactionList && addonsTransactionList.length > 0 ? (
    loading ? (
      <ActivityIndicator
        style={{ alignSelf: "flex-start" }}
        size="large"
        color={color("grey", 40)}
      />
    ) : (
      <TouchableOpacity onPress={toggleIsShowAddons}>
        <AppText style={styles.descriptionAlert}>
          {`${translationProps.i18nt(
            "addonsToggleComponent",
            descriptionAlert
          )} `}
          <MaterialCommunityIcons
            name={isShowAddons ? "chevron-up" : "chevron-down"}
            size={size(2)}
          />
        </AppText>
      </TouchableOpacity>
    )
  ) : null;
};
