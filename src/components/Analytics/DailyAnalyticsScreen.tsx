import React, { FunctionComponent, useEffect, useContext } from "react";
import { groupBy, forEach } from "lodash";
import { View, StyleSheet } from "react-native";
import { size, fontSize } from "../../common/styles";
import { Card } from "../Layout/Card";
import { TopBackground } from "../Layout/TopBackground";
import { Credits } from "../Credits";
import { useConfigContext } from "../../context/config";
import {
  withNavigationFocus,
  NavigationFocusInjectedProps
} from "react-navigation";
import { TitleStatistic } from "./TitleStatistic";
import { Sentry } from "../../utils/errorTracking";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { HelpModalContext } from "../../context/help";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { Banner } from "../Layout/Banner";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { useCheckUpdates } from "../../hooks/useCheckUpdates";
import { KeyboardAvoidingScrollView } from "../Layout/KeyboardAvoidingScrollView";
import { AuthContext } from "../../context/auth";
import { StatisticsContext } from "../../context/statistic";
import { getDailyStatistics } from "../../services/statistics";
import { ItemQuantity } from "./types";
import { TransactionHistory } from "./TransactionHistory";
import { AnalyticsHeader } from "./AnalyticsHeader";

const styles = StyleSheet.create({
  content: {
    padding: size(2),
    paddingVertical: size(8),
    height: "100%",
    width: 512,
    maxWidth: "100%"
  },
  headerText: {
    marginBottom: size(4)
  },
  bannerWrapper: {
    marginBottom: size(1.5)
  },
  categoryName: {
    fontFamily: "brand-bold",
    fontSize: fontSize(1),
    marginBottom: size(3)
  }
});

const DailyAnalyticsScreen: FunctionComponent<NavigationFocusInjectedProps> = ({
  navigation,
  isFocused
}) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "DailyAnalyticsScreen"
    });
  }, []);

  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);
  const checkUpdates = useCheckUpdates();
  const { sessionToken, endpoint, operatorToken } = useContext(AuthContext);
  const { totalCount, setTotalCount } = useContext(StatisticsContext);
  const { currentTimestamp, setCurrentTimestamp } = useContext(
    StatisticsContext
  );
  const { lastTransactionTime, setLastTransactionTime } = useContext(
    StatisticsContext
  );
  const { transactionHistory, setTransactionHistory } = useContext(
    StatisticsContext
  );

  const fetchDailyStatistics = async (): Promise<void> => {
    const response = await getDailyStatistics(
      currentTimestamp,
      sessionToken,
      endpoint,
      [operatorToken]
    );

    const result: ItemQuantity[] = [];

    const transactionsByCategory = groupBy(
      response.dailyTransactions,
      "category"
    );
    forEach(transactionsByCategory, (value, key) => {
      let quantity = 0;
      transactionsByCategory[key].forEach(transaction => {
        quantity += transaction.quantity;
      });
      result.push({ category: key, quantity: quantity });
    });

    if (result) {
      setTransactionHistory(result);
    }

    setTotalCount(response.dailyTransactions.length);
    setCurrentTimestamp(currentTimestamp);

    if (response.dailyTransactions.length !== 0) {
      setLastTransactionTime(response.dailyTransactions[0].transactionTime);
    } else {
      setLastTransactionTime(0);
    }
  };

  useEffect(() => {
    if (totalCount !== null) {
      fetchDailyStatistics();
    }
  });
  useEffect(() => {
    if (isFocused) {
      checkUpdates();
    }
  }, [isFocused, checkUpdates]);

  return (
    <>
      <Credits style={{ bottom: size(3) }} />
      <KeyboardAvoidingScrollView
        keyboardAvoidingViewStyle={{ flex: 1 }}
        scrollViewContentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingBottom: size(8)
        }}
      >
        <TopBackground
          style={{ height: "50%", maxHeight: "auto" }}
          mode={config.appMode}
        />
        <View style={styles.content}>
          <View style={styles.headerText}>
            <AnalyticsHeader mode={config.appMode} />
            <TitleStatistic
              totalCount={totalCount ? totalCount : 0}
              currentTimestamp={currentTimestamp}
              lastTransactionTime={
                lastTransactionTime ? lastTransactionTime : 0
              }
            />
          </View>
          {messageContent && (
            <View style={styles.bannerWrapper}>
              <Banner {...messageContent} />
            </View>
          )}
          <Card style={{ marginVertical: size(10), minHeight: "40%" }}>
            <TransactionHistory transactionHistory={transactionHistory} />
          </Card>
          <FeatureToggler feature="HELP_MODAL">
            <HelpButton onPress={showHelpModal} />
          </FeatureToggler>
        </View>
      </KeyboardAvoidingScrollView>
    </>
  );
};

export const DailyAnalyticsScreenContainer = withNavigationFocus(
  DailyAnalyticsScreen
);
