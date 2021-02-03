import React, {
  FunctionComponent,
  useState,
  useContext,
  useEffect,
} from "react";
import { differenceInSeconds, compareDesc } from "date-fns";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { CustomerCard } from "../CustomerCard";
import { AppText } from "../../Layout/AppText";
import { color, size } from "../../../common/styles";
import { sharedStyles } from "../sharedStyles";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { Cart } from "../../../hooks/useCart/useCart";
import { usePastTransaction } from "../../../hooks/usePastTransaction/usePastTransaction";
import { FontAwesome } from "@expo/vector-icons";
import {
  BIG_NUMBER,
  groupTransactionsByCategory,
  sortTransactionsByCategory,
} from "../utils";
import { TransactionsGroup } from "../TransactionsGroup";
import { ShowFullListToggle } from "../ShowFullListToggle";
import {
  DistantTransactionTitle,
  RecentTransactionTitle,
  NoPreviousTransactionTitle,
  UsageQuotaTitle,
} from "./TransactionTitle";
import { AppealButton } from "./AppealButton";
import { Quota, CampaignPolicy } from "../../../types";
import { AlertModalContext } from "../../../context/alert";
import { CampaignConfigContext } from "../../../context/campaignConfig";
import { AuthContext } from "../../../context/auth";
import { useTranslate } from "../../../hooks/useTranslate/useTranslate";

const DURATION_THRESHOLD_SECONDS = 60 * 10; // 10 minutes
const MAX_TRANSACTIONS_TO_DISPLAY = 5;

export const styles = StyleSheet.create({
  wrapper: {
    marginTop: size(2),
    marginBottom: size(2),
  },
});

interface NoQuotaCard {
  ids: string[];
  cart: Cart;
  onCancel: () => void;
  onAppeal?: () => void;
  quotaResponse?: Quota;
  allQuotaResponse?: Quota;
}

export const getLatestTransactionTime = (cart: Cart): Date | undefined => {
  cart.sort((item1, item2) =>
    compareDesc(item1.lastTransactionTime ?? 0, item2.lastTransactionTime ?? 0)
  );

  return cart[0]?.lastTransactionTime;
};

export const checkHasAppealProduct = (
  allProducts: CampaignPolicy[] | null,
  allQuotaResponse: Quota | undefined
): boolean => {
  const appealProductsCategories = allProducts
    ?.filter((product) => product.categoryType === "APPEAL")
    .map((product) => product.category);

  const hasAppealProduct =
    (appealProductsCategories &&
      allQuotaResponse?.remainingQuota.some(
        (quota) =>
          appealProductsCategories.includes(quota.category) &&
          quota.quantity !== 0
      )) ??
    false;
  return hasAppealProduct;
};

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
  allQuotaResponse,
  quotaResponse,
}) => {
  const [isShowFullList, setIsShowFullList] = useState<boolean>(false);
  const { policies: allProducts } = useContext(CampaignConfigContext);
  const { sessionToken, endpoint } = useContext(AuthContext);

  const { pastTransactionsResult, loading, error } = usePastTransaction(
    ids,
    sessionToken,
    endpoint
  );
  // Assumes results are already sorted (valid assumption for results from /transactions/history)
  const sortedTransactions = pastTransactionsResult;

  const { showErrorAlert } = useContext(AlertModalContext);
  useEffect(() => {
    if (error) {
      showErrorAlert(error);
    }
  }, [error, showErrorAlert]);

  const latestTransactionTime: Date | undefined =
    (quotaResponse && getLatestTransactionTime(cart)) ?? undefined;

  const now = new Date();
  const secondsFromLatestTransaction = latestTransactionTime
    ? differenceInSeconds(now, latestTransactionTime)
    : -1;

  const hasAppealProduct = checkHasAppealProduct(allProducts, allQuotaResponse);

  const translationProps = useTranslate();
  const { i18nt, c13nt } = translationProps;
  const transactionsByCategoryMap = groupTransactionsByCategory(
    sortedTransactions,
    allProducts || [],
    latestTransactionTime,
    translationProps
  );

  const transactionsByCategoryList = sortTransactionsByCategory(
    transactionsByCategoryMap
  );

  const showGlobalQuota =
    !!quotaResponse?.globalQuota &&
    cart.length > 0 &&
    /**
     * We only display global limit messages if there is only one category for now
     */
    allProducts?.length === 1 &&
    !!allProducts[0].quantity.usage;

  const firstGlobalQuota = showGlobalQuota
    ? quotaResponse!.globalQuota[0]
    : undefined;

  return (
    <View>
      <CustomerCard ids={ids} headerBackgroundColor={color("red", 60)}>
        <View style={sharedStyles.failureResultWrapper}>
          <View style={sharedStyles.resultWrapper}>
            <FontAwesome
              name="thumbs-down"
              color={color("red", 60)}
              style={sharedStyles.icon}
            />
            <AppText
              style={sharedStyles.statusTitleWrapper}
              accessibilityLabel="no-quota-title"
              testID="no-quota-title"
              accessible={true}
            >
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
              {showGlobalQuota && firstGlobalQuota!.quotaRefreshTime ? (
                <UsageQuotaTitle
                  quantity={firstGlobalQuota!.quantity}
                  quotaRefreshTime={firstGlobalQuota!.quotaRefreshTime}
                />
              ) : undefined}
            </AppText>
            {loading ? (
              <ActivityIndicator
                style={{ alignSelf: "flex-start" }}
                size="large"
                color={color("grey", 40)}
              />
            ) : (
              transactionsByCategoryList.length > 0 && (
                <View>
                  <AppText style={styles.wrapper}>
                    {`${c13nt(
                      "checkoutSuccessPreviousItems",
                      undefined,
                      i18nt("checkoutSuccessScreen", "previouslyRedeemedItems")
                    )}:`}
                  </AppText>
                  {transactionsByCategoryList.map(
                    (
                      transactionsByCategory: TransactionsGroup,
                      index: number
                    ) => (
                      <TransactionsGroup
                        key={index}
                        maxTransactionsToDisplay={
                          isShowFullList
                            ? BIG_NUMBER
                            : MAX_TRANSACTIONS_TO_DISPLAY
                        }
                        {...transactionsByCategory}
                      />
                    )
                  )}
                </View>
              )
            )}
          </View>
          {!loading &&
            sortedTransactions &&
            sortedTransactions.length > MAX_TRANSACTIONS_TO_DISPLAY && (
              <ShowFullListToggle
                toggleIsShowFullList={() => setIsShowFullList(!isShowFullList)}
                isShowFullList={isShowFullList}
              />
            )}
        </View>
      </CustomerCard>
      <View style={sharedStyles.ctaButtonsWrapper}>
        <DarkButton
          text={i18nt("checkoutSuccessScreen", "nextIdentity")}
          onPress={onCancel}
          fullWidth={true}
          accessibilityLabel="no-quota-next-identity-button"
        />
      </View>
      {onAppeal && hasAppealProduct ? (
        <AppealButton onAppeal={onAppeal} />
      ) : undefined}
    </View>
  );
};
