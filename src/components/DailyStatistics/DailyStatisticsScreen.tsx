import React, {
  FunctionComponent,
  useEffect,
  useContext,
  useCallback,
  useState,
  createContext
} from "react";
import { View, StyleSheet } from "react-native";
import { size, fontSize } from "../../common/styles";
import { TopBackground } from "../Layout/TopBackground";
import { Credits } from "../Credits";
import { useConfigContext } from "../../context/config";
import { CampaignConfigContext } from "../../context/campaignConfig";
import { withNavigationFocus } from "react-navigation";
import { TitleStatistic } from "./TitleStatistic";
import { Sentry } from "../../utils/errorTracking";
import { HelpButton } from "../Layout/Buttons/HelpButton";
import { HelpModalContext } from "../../context/help";
import { FeatureToggler } from "../FeatureToggler/FeatureToggler";
import { Banner } from "../Layout/Banner";
import { ImportantMessageContentContext } from "../../context/importantMessage";
import { KeyboardAvoidingScrollView } from "../Layout/KeyboardAvoidingScrollView";
import { AuthContext } from "../../context/auth";
import { getDailyStatistics } from "../../services/statistics";
import { summariseTransactions } from "./utils";
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

interface StatisticsContext {
  totalCount: number | null;
  currentTimestamp: number;
  lastTransactionTime: number | null;
  transactionHistory: { name: string; category: string; quantity: number }[];
  setTotalCount: (totalCount: number | null) => void;
  setCurrentTimestamp: (currentTimestamp: number) => void;
  setLastTransactionTime: (lastTransactionTime: number) => void;
  setTransactionHistory: (
    transactionHistory: { name: string; category: string; quantity: number }[]
  ) => void;
  clearStatistics: () => void;
}

export const StatisticsContext = createContext<StatisticsContext>({
  totalCount: null,
  currentTimestamp: Date.now(),
  lastTransactionTime: null,
  transactionHistory: [],
  setTotalCount: () => null,
  setCurrentTimestamp: () => null,
  setLastTransactionTime: () => null,
  setTransactionHistory: () => null,
  clearStatistics: () => null
});

export const StatisticsContextProvider: FunctionComponent = ({ children }) => {
  const [totalCount, setTotalCount] = useState<StatisticsContext["totalCount"]>(
    null
  );
  const [currentTimestamp, setCurrentTimestamp] = useState<
    StatisticsContext["currentTimestamp"]
  >(Date.now());
  const [lastTransactionTime, setLastTransactionTime] = useState<
    StatisticsContext["lastTransactionTime"]
  >(null);
  const [transactionHistory, setTransactionHistory] = useState<
    StatisticsContext["transactionHistory"]
  >([]);

  const clearStatistics: StatisticsContext["clearStatistics"] = useCallback(() => {
    setTotalCount(null);
    setCurrentTimestamp(Date.now());
    setLastTransactionTime(null);
    setTransactionHistory([]);
  }, []);

  return (
    <StatisticsContext.Provider
      value={{
        totalCount,
        currentTimestamp,
        lastTransactionTime,
        transactionHistory,
        setTotalCount,
        setCurrentTimestamp,
        setLastTransactionTime,
        setTransactionHistory,
        clearStatistics
      }}
    >
      {children}
    </StatisticsContext.Provider>
  );
};

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
  const { sessionToken, endpoint, operatorToken } = useContext(AuthContext);
  const {
    currentTimestamp,
    setCurrentTimestamp,
    lastTransactionTime,
    setLastTransactionTime,
    totalCount,
    setTotalCount,
    transactionHistory,
    setTransactionHistory
  } = useContext(StatisticsContext);
  const { showAlert } = useContext(AlertModalContext);
  const { policies } = useContext(CampaignConfigContext);
  const [error, setError] = useState<Error>();
  const clearError = useCallback((): void => setError(undefined), []);

  const fetchDailyStatistics = useCallback(
    async (currentTimestamp: number): Promise<void> => {
      try {
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
      } catch (error) {
        setError(error);
        showAlert({
          ...systemAlertProps,
          description: ERROR_MESSAGE.SERVER_ERROR,
          onOk: () => {
            navigateHome(navigation);
            clearError();
          }
        });
      }
    },
    [
      clearError,
      endpoint,
      navigation,
      operatorToken,
      policies,
      sessionToken,
      setCurrentTimestamp,
      setLastTransactionTime,
      setTotalCount,
      setTransactionHistory,
      showAlert
    ]
  );

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
    if (totalCount === null && !error) {
      fetchDailyStatistics(Date.now());
    }
  }, [totalCount, error, fetchDailyStatistics]);

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
