import React, { FunctionComponent, ReactElement } from "react";
import { StyleSheet, Text } from "react-native";
import { Card } from "../../Layout/Card";
import { AppText } from "../../Layout/AppText";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { size, color, fontSize } from "../../../common/styles";
import { sharedStyles } from "./sharedStyles";
import { i18nt } from "../../../utils/translations";

const styles = StyleSheet.create({
  card: {
    width: 512,
    maxWidth: "100%",
    borderTopWidth: size(2),
    backgroundColor: color("red", 10),
    borderColor: color("red", 50)
  },
  emoji: {
    fontSize: fontSize(3),
    marginBottom: size(2)
  },
  details: {
    marginBottom: size(4)
  }
});

interface InvalidCard {
  title: string | ReactElement;
  details: string;
  closeModal: () => void;
  ctaButtonText?: string;
}

export const InvalidCard: FunctionComponent<InvalidCard> = ({
  title,
  details,
  closeModal,
  ctaButtonText = i18nt("errorMessages", "errorScanning", "primaryActionText")
}) => {
  return (
    <Card style={styles.card}>
      <Text style={styles.emoji}>❌</Text>
      <AppText style={sharedStyles.statusTitleWrapper}>
        {typeof title === "string" ? (
          <AppText style={sharedStyles.statusTitle}>{title}</AppText>
        ) : (
          title
        )}
      </AppText>
      <AppText style={styles.details}>{details}</AppText>
      <DarkButton
        fullWidth={true}
        text={ctaButtonText}
        onPress={() => {
          closeModal();
        }}
      />
    </Card>
  );
};
