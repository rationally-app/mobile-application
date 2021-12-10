import React, {
  FunctionComponent,
  useEffect,
  useContext,
  useState,
} from "react";
import { View, StyleSheet } from "react-native";
import { size, fontSize } from "../../common/styles";
import { TopBackground } from "../Layout/TopBackground";
import { Credits } from "../Credits";
import { AuthContext } from "../../context/auth";
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
import { addDays, subDays, getTime, isSameDay } from "date-fns";
import { AlertModalContext, ERROR_MESSAGE } from "../../context/alert";
import { navigateHome } from "../../common/navigation";
import { NavigationProps } from "../../types";
import { useDailyStatistics } from "../../hooks/useDailyStatistics/useDailyStatistics";

const styles = StyleSheet.create({
  content: {
    padding: size(2),
    paddingVertical: size(6),
    height: "100%",
    width: 512,
    maxWidth: "100%",
  },
  headerText: {
    marginBottom: size(4),
  },
  bannerWrapper: {
    marginBottom: size(1.5),
  },
  categoryName: {
    fontFamily: "brand-bold",
    fontSize: fontSize(1),
    marginBottom: size(3),
  },
});

const DailyStatisticsScreen: FunctionComponent<NavigationProps> = ({
  navigation,
}) => {
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "DailyStatisticsScreen",
    });
  }, []);

  const messageContent = useContext(ImportantMessageContentContext);
  const { config } = useConfigContext();
  const showHelpModal = useContext(HelpModalContext);
  const { showErrorAlert } = useContext(AlertModalContext);
  const { sessionToken, endpoint, operatorToken } = useContext(AuthContext);
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());

  const {
    lastTransactionTime,
    totalCount,
    transactionHistory,
    error,
    loading,
  } = useDailyStatistics(
    sessionToken,
    endpoint,
    operatorToken,
    currentTimestamp
  );

  const onPressPrevDay = (): void => {
    const prevDay = getTime(subDays(currentTimestamp, 1));
    setCurrentTimestamp(prevDay);
  };

  const onPressNextDay = (): void => {
    if (!isSameDay(currentTimestamp, Date.now())) {
      const nextDay = getTime(addDays(currentTimestamp, 1));
      setCurrentTimestamp(nextDay);
    }
  };

  useEffect(() => {
    if (error) {
      showErrorAlert(new Error(ERROR_MESSAGE.SERVER_ERROR), () =>
        navigateHome(navigation)
      );
    }
  }, [error, navigation, showErrorAlert]);

  return (
    <>
      <Credits style={{ bottom: size(3) }} />
      <KeyboardAvoidingScrollView
        keyboardAvoidingViewStyle={{ flex: 1 }}
        scrollViewContentContainerStyle={{
          flexGrow: 1,
          alignItems: "center",
          paddingBottom: size(1),
        }}
      >
        <TopBackground
          style={{
            height: "50%",
            maxHeight: "auto",
            backgroundColor: "#FFF2F2",
          }}
          mode={config.appMode}
        />
        <View style={styles.content}>
          <View style={styles.headerText}>
            <StatisticsHeader mode={config.appMode} />
            <TitleStatistic
              totalCount={totalCount ?? 0}
              currentTimestamp={currentTimestamp}
              lastTransactionTime={lastTransactionTime}
              onPressPrevDay={onPressPrevDay}
              onPressNextDay={onPressNextDay}
            />
          </View>
          {messageContent && (
            <View style={styles.bannerWrapper}>
              <Banner {...messageContent} />
            </View>
          )}
          <TransactionHistoryCard
            transactionHistory={transactionHistory}
            loading={loading}
          />
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
