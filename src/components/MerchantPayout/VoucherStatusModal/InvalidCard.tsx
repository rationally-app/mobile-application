import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import { Card } from "../../Layout/Card";
import { AppText } from "../../Layout/AppText";
import { DarkButton } from "../../Layout/Buttons/DarkButton";
import { size, color, fontSize } from "../../../common/styles";
import { MaterialIcons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  card: {
    width: 512,
    maxWidth: "100%",
    borderTopWidth: size(2),
    backgroundColor: color("red", 10),
    borderColor: color("red", 50)
  },
  iconWrapper: {
    marginBottom: size(1.5),
    marginTop: size(1)
  },
  headerText: {
    fontFamily: "brand-bold",
    fontSize: fontSize(3),
    marginBottom: size(2.5)
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
      <View style={styles.iconWrapper}>
        <MaterialIcons name="close" size={size(4)} color={color("red", 60)} />
      </View>
      <AppText style={styles.headerText}>{title}</AppText>
      <AppText style={{ marginBottom: size(5) }}>{details}</AppText>
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
