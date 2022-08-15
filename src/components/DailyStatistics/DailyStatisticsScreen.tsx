import React, {
  FunctionComponent,
  useEffect,
  useContext,
  useState,
  useCallback,
} from "react";
import { View, StyleSheet } from "react-native";
import { size, fontSize } from "../../common/styles";
import { TopBackground } from "../Layout/TopBackground";
import { Credits } from "../Credits";
import { AuthContext } from "../../context/auth";
import { AuthStoreContext } from "../../context/authStore";
import { useConfigContext } from "../../context/config";
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
import { AlertModalContext } from "../../context/alert";
import { DailyStatisticsScreenProps } from "../../types";
import { useDailyStatistics } from "../../hooks/useDailyStatistics/useDailyStatistics";
import { useTheme } from "../../context/theme";
import { NetworkError, SessionError } from "../../services/helpers";
import { CommonActions } from "@react-navigation/native";

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

const DailyStatisticsScreen: FunctionComponent<DailyStatisticsScreenProps> = ({
  navigation,
  route,
}) => {
  const { theme } = useTheme();
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
  const { setAuthCredentials } = useContext(AuthStoreContext);
  const [currentTimestamp, setCurrentTimestamp] = useState(Date.now());

  const {
    lastTransactionTime,
    totalCount,
    transactionHistory,
    error,
    loading,
    clearDailyStatisticsError,
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

  const expireSession = useCallback(() => {
    const key = `${operatorToken}${endpoint}`;
    setAuthCredentials(key, {
      operatorToken,
      endpoint,
      sessionToken,
      expiry: new Date().getTime(),
    });
  }, [setAuthCredentials, endpoint, operatorToken, sessionToken]);

  useEffect(() => {
    if (error) {
      switch (true) {
        case error instanceof NetworkError:
          throw error; // Let error boundary handle.
        case error instanceof SessionError:
          clearDailyStatisticsError();
          expireSession();
          showErrorAlert(error, () => {
            navigation.navigate("CampaignLocationsScreen", {
              shouldAutoLoad: false,
            });
          });
          return;
      }
      showErrorAlert(error, () => {
        // navigateHome(navigation)
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "CollectCustomerDetailsScreen" }],
          })
        );
      });
    }
  }, [
    error,
    navigation,
    clearDailyStatisticsError,
    expireSession,
    showErrorAlert,
  ]);

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
          }}
          mode={config.appMode}
          customPrimaryColor={theme.statisticsScreen.topBackgroundColor}
        />
        <View style={styles.content}>
          <View style={styles.headerText}>
            <StatisticsHeader
              mode={config.appMode}
              navigation={navigation}
              route={route}
            />
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

export const DailyStatisticsScreenContainer = DailyStatisticsScreen;
