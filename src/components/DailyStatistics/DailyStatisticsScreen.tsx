import React, { FunctionComponent, useEffect, useContext } from "react";
import { View, StyleSheet } from "react-native";
import { size, fontSize } from "../../common/styles";
import { TopBackground } from "../Layout/TopBackground";
import { Credits } from "../Credits";
import { useConfigContext } from "../../context/config";
import { withNavigationFocus } from "react-navigation";
import { TitleStatistic } from "./TitleStatistic";
import { Sentry } from "../../utils/errorTracking";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { HelpModalContext } from "../../context/help";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { Banner } from "../Layout/Banner";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { KeyboardAvoidingScrollView } from "../Layout/KeyboardAvoidingScrollView";
import { TransactionHistoryCard } from "./TransactionHistoryCard";
import { StatisticsHeader } from "./StatisticsHeader";
import { addDays, subDays, getTime } from "date-fns";
import {
  AlertModalContext,
  systemAlertProps,
  ERROR_MESSAGE
} from "../../context/alert";
import { navigateHome } from "../../common/navigation";
import { NavigationProps } from "../../types";
import { useFetchDailyStatistics } from "../../hooks/useFetchDailyStatistics/useFetchDailyStatistics";

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

const DailyStatisticsScreen: FunctionComponent<NavigationProps> = ({
  navigation
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
  const { showAlert } = useContext(AlertModalContext);

  const {
    fetchDailyStatistics,
    currentTimestamp,
    setCurrentTimestamp,
    lastTransactionTime,
    totalCount,
    transactionHistory,
    error,
    clearError
  } = useFetchDailyStatistics(Date.now());

  const onPressPrevDay = (): void => {
    const prevDay = getTime(subDays(currentTimestamp, 1));
    setCurrentTimestamp(prevDay);
    try {
      fetchDailyStatistics(prevDay);
    } catch (error) {
      showAlert({
        ...systemAlertProps,
        description: ERROR_MESSAGE.SERVER_ERROR,
        onOk: () => {
          navigateHome(navigation);
          clearError();
        }
      });
    }
  };

  const onPressNextDay = (): void => {
    const nextDay = getTime(addDays(currentTimestamp, 1));
    setCurrentTimestamp(nextDay);
    try {
      fetchDailyStatistics(nextDay);
    } catch (error) {
      showAlert({
        ...systemAlertProps,
        description: ERROR_MESSAGE.SERVER_ERROR,
        onOk: () => {
          navigateHome(navigation);
          clearError();
        }
      });
    }
  };

  useEffect(() => {
    if (!error) {
      return;
    }
    console.log(error);
    if (error) {
      showAlert({
        ...systemAlertProps,
        description: ERROR_MESSAGE.SERVER_ERROR,
        onOk: () => {
          navigateHome(navigation);
          clearError();
        }
      });
    }
  }, [error, clearError, navigation, showAlert]);

  useEffect(() => {
    // When entering the first time
    if (totalCount === null && !error) {
      fetchDailyStatistics(Date.now());
    }
  }, [
    totalCount,
    error,
    fetchDailyStatistics,
    clearError,
    navigation,
    showAlert
  ]);

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
              totalCount={totalCount ?? 0}
              currentTimestamp={currentTimestamp}
              lastTransactionTime={lastTransactionTime ?? 0}
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
