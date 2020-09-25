import React, { FunctionComponent, useEffect, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { size, fontSize } from "../../common/styles";
import { TopBackground } from "../Layout/TopBackground";
import { Credits } from "../Credits";
import { useConfigContext } from "../../context/config";
import { CampaignConfigContext } from "../../context/campaignConfig";
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
import { StatisticsContext } from "../../context/statistics";
import { getDailyStatistics } from "../../services/statistics";
import { summariseTransactions } from "./utils";
import { TransactionHistoryCard } from "./TransactionHistoryCard";
import { StatisticsHeader } from "./StatisticsHeader";
import { addDays, subDays, getTime } from "date-fns";

const styles = StyleSheet.create({
  content: {
    padding: size(2),
    paddingVertical: size(6),
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

const DailyStatisticsScreen: FunctionComponent<NavigationFocusInjectedProps> = ({
  navigation,
  isFocused
}) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "DailyStatisticsScreen"
    });
  }, []);

  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);
  const checkUpdates = useCheckUpdates();
  const { sessionToken, endpoint, operatorToken } = useContext(AuthContext);
  const { totalCount, setTotalCount } = useContext(StatisticsContext);
  const {
    currentTimestamp,
    setCurrentTimestamp,
    lastTransactionTime,
    setLastTransactionTime,
    transactionHistory,
    setTransactionHistory
  } = useContext(StatisticsContext);

  const { policies } = useContext(CampaignConfigContext);

  const fetchDailyStatistics = async (
    currentTimestamp: number
  ): Promise<void> => {
    const response = await getDailyStatistics(
      currentTimestamp,
      sessionToken,
      endpoint,
      [operatorToken]
    );

    const {
      summarisedTransactionHistory,
      summarisedTotalCount
    } = summariseTransactions(response, policies);

    setTransactionHistory(summarisedTransactionHistory);
    setTotalCount(summarisedTotalCount);
    setCurrentTimestamp(currentTimestamp);

    if (response.pastTransactions.length !== 0) {
      setLastTransactionTime(response.pastTransactions[0].transactionTime);
    } else {
      setLastTransactionTime(0);
    }
  };

  const onPressPrevDay = (): void => {
    const prevDay = getTime(subDays(currentTimestamp, 1));
    setCurrentTimestamp(prevDay);
    fetchDailyStatistics(prevDay);
  };

  const onPressNextDay = (): void => {
    const nextDay = getTime(addDays(currentTimestamp, 1));
    setCurrentTimestamp(nextDay);
    fetchDailyStatistics(nextDay);
  };

  useEffect(() => {
    // When entering the first time
    if (totalCount === null) {
      fetchDailyStatistics(Date.now());
    }
  });

  return (
    <>
      <Credits style={{ bottom: size(3) }} />
      <KeyboardAvoidingScrollView
        keyboardAvoidingViewStyle={{ flex: 1 }}
        scrollViewContentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingBottom: size(2)
        }}
      >
        <TopBackground
          style={{ height: "50%", maxHeight: "auto" }}
          mode={config.appMode}
        />
        <View style={styles.content}>
          <View style={styles.headerText}>
            <StatisticsHeader mode={config.appMode} />
            <TitleStatistic
              totalCount={totalCount ? totalCount : 0}
              currentTimestamp={currentTimestamp}
              lastTransactionTime={
                lastTransactionTime ? lastTransactionTime : 0
              }
              onPressPrevDay={onPressPrevDay}
              onPressNextDay={onPressNextDay}
            />
          </View>
          {messageContent && (
            <View style={styles.bannerWrapper}>
              <Banner {...messageContent} />
            </View>
          )}
          <TransactionHistoryCard transactionHistory={transactionHistory} />
          <FeatureToggler feature="HELP_MODAL">
            <HelpButton onPress={showHelpModal} />
          </FeatureToggler>
        </View>
      </KeyboardAvoidingScrollView>
    </>
  );
};

export const DailyStatisticsScreenContainer = withNavigationFocus(
  DailyStatisticsScreen
);
