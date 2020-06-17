import React, { FunctionComponent } from "react";
import { StyleSheet } from "react-native";
import { Card } from "../../Layout/Card";
import { color } from "../../../common/styles";
import { LoadingView } from "../../Loading";

const styles = StyleSheet.create({
  card: {
    width: 512,
    height: 512,
    maxWidth: "100%",
    maxHeight: "50%",
    backgroundColor: color("grey", 0)
  }
});

export const LoadingCard: FunctionComponent = () => {
  return (
    <Card style={[styles.card]}>
      <LoadingView />
    </Card>
  );
};
