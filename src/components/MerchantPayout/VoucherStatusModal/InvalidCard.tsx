import React, { FunctionComponent } from "react";
import { StyleSheet, Text } from "react-native";
import { Card } from "../../Layout/Card";
import { AppText } from "../../Layout/AppText";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { size, color, fontSize } from "../../../common/styles";

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
  headerText: {
    fontFamily: "brand-bold",
    fontSize: fontSize(3),
    marginBottom: size(2)
  },
  details: {
    marginBottom: size(4)
  }
});

interface InvalidCard {
  title: string;
  details: string;
  closeModal: () => void;
}

export const InvalidCard: FunctionComponent<InvalidCard> = ({
  title,
  details,
  closeModal
}) => {
  return (
    <Card style={styles.card}>
      <Text style={styles.emoji}>❌</Text>
      <AppText style={styles.headerText}>{title}</AppText>
      <AppText style={styles.details}>{details}</AppText>
      <DarkButton
        fullWidth={true}
        text="Continue scanning"
        onPress={() => {
          closeModal();
        }}
      />
    </Card>
  );
};
