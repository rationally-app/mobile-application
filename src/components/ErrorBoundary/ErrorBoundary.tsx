import React, { Component, ReactNode } from "react";
import * as Sentry from "sentry-expo";
import { Updates } from "expo";
import { AppText } from "../Layout/AppText";
import { StyleSheet, View, Linking } from "react-native";
import { size, fontSize, color } from "../../common/styles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { Feather } from "@expo/vector-icons";
import { format } from "date-fns";

const styles = StyleSheet.create({
  wrapper: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: size(5)
  },
  content: {
    width: 512,
    maxWidth: "100%",
    marginTop: -size(4)
  },
  emoji: {
    fontSize: fontSize(5)
  },
  heading: {
    fontFamily: "brand-bold",
    fontSize: fontSize(5)
  },
  feedback: {
    marginTop: size(1),
    fontSize: fontSize(2)
  },
  errorDescription: {
    marginTop: size(2),
    fontFamily: "brand-italic",
    fontSize: fontSize(-1),
    color: color("grey", 40)
  },
  emailLink: {
    fontFamily: "brand-italic",
    fontSize: fontSize(-1),
    textDecorationLine: "underline",
    color: color("blue", 40)
  },
  restartButton: {
    alignSelf: "flex-start",
    marginTop: size(5)
  }
});

type State = { hasError: boolean; errorMessage?: string };

export class ErrorBoundary extends Component<{}, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.name };
  }

  componentDidCatch(error: Error): void {
    Sentry.captureException(error);
  }

  render(): ReactNode {
    const error = `(${this.state.errorMessage} ${format(
      Date.now(),
      "hh:mm a, do MMMM"
    )})`;
    const supportLink = `mailto:supplyallyhelp@hive.gov.sg?subject=[SupplyAlly Error]&body=${error}`;

    return this.state.hasError ? (
      <View style={styles.wrapper}>
        <View style={styles.content}>
          <AppText style={styles.emoji}>😓</AppText>
          <AppText style={styles.heading}>Paiseh...</AppText>
          <AppText style={styles.feedback}>
            SupplyAlly has encountered an issue. We&apos;ve noted this down and
            are looking into it!
          </AppText>
          {this.state.errorMessage && (
            <>
              <AppText style={styles.errorDescription}>
                If this persists, drop us an email at{" "}
                <AppText
                  style={styles.emailLink}
                  onPress={() => Linking.openURL(supportLink)}
                >
                  supplyallyhelp@hive.gov.sg
                </AppText>
              </AppText>
              <AppText style={styles.errorDescription}>{error}</AppText>
            </>
          )}
          <View style={styles.restartButton}>
            <DarkButton
              text="Restart app"
              onPress={() => Updates.reload()}
              icon={
                <Feather
                  name="refresh-cw"
                  size={size(2)}
                  color={color("grey", 0)}
                />
              }
            />
          </View>
        </View>
      </View>
    ) : (
      this.props.children
    );
  }
}
