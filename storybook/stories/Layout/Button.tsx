import React from "react";
import { storiesOf } from "@storybook/react-native";
import {
  Button,
  DangerButton,
  DarkButton,
  HelpButton,
  SecondaryButton,
  TransparentButton,
} from "../../../src/components/Layout/Buttons";
import { View, Text, StyleSheet } from "react-native";
import { size, color } from "../../../src/common/styles";
import { Feather, Ionicons } from "@expo/vector-icons";

const styles = StyleSheet.create({
  wrapper: {
    margin: size(3),
  },
  item: {
    marginBottom: size(1),
  },
});

const darkButtonElements = (): JSX.Element[] => {
  return [
    <DarkButton key="0" text="Checkout" />,
    <DarkButton key="1" text="Checkout" isLoading={true} />,
    <DarkButton
      key="2"
      text="Checkout"
      icon={
        <Feather name="shopping-cart" size={size(2)} color={color("grey", 0)} />
      }
    />,
    <DarkButton
      key="3"
      text="Scan"
      icon={<Feather name="maximize" size={size(2)} color={color("grey", 0)} />}
    />,
    <DarkButton key="4" text="Next customer" fullWidth={true} />,
  ];
};

const dangerButtonElements = (): JSX.Element[] => {
  return [
    <DangerButton key="0" text="Danger" />,
    <DangerButton key="1" text="Danger" isLoading={true} />,
    <DangerButton key="2" text="Danger" fullWidth={true} />,
    <DangerButton key="3" text="" accessibilityLabel="test button" />,
  ];
};

const secondaryButtonElements = (): JSX.Element[] => {
  return [
    <SecondaryButton key="0" text="Default Secondary Button" />,
    <SecondaryButton key="1" text="Secondary Button" isLoading={true} />,
    <SecondaryButton key="2" text="Button disabled" disabled={true} />,
    <SecondaryButton key="3" text="Small Button" size="small" />,
    <SecondaryButton key="4" text="Medium Button" size="medium" />,
    <SecondaryButton
      key="5"
      text="Icon Button"
      icon={
        <Feather
          name="shopping-cart"
          size={size(2)}
          color={color("grey", 100)}
        />
      }
    />,
    <SecondaryButton key="6" text="FullWith Button" fullWidth={true} />,
  ];
};

storiesOf("Layout", module)
  .add("Button", () => (
    <View style={styles.wrapper}>
      <Button text="Button" />
    </View>
  ))
  .add("DarkButton", () => (
    <View style={styles.wrapper}>
      {darkButtonElements().map((darkButtonElement, index) => (
        <View key={index} style={styles.item}>
          {darkButtonElement}
        </View>
      ))}
    </View>
  ))
  .add("DangerButton", () => (
    <View style={styles.wrapper}>
      {dangerButtonElements().map((darkButtonElement, index) => (
        <View key={index} style={styles.item}>
          {darkButtonElement}
        </View>
      ))}
      <View style={styles.item}></View>
    </View>
  ))
  .add("HelpButton", () => (
    <View style={styles.wrapper}>
      <HelpButton onPress={() => null} />
    </View>
  ))
  .add("SecondaryButton", () => (
    <View style={styles.wrapper}>
      {secondaryButtonElements().map((secondaryButtonElement, index) => (
        <View key={index} style={styles.item}>
          {secondaryButtonElement}
        </View>
      ))}
    </View>
  ))
  .add("TransparentButton", () => (
    <View style={styles.wrapper}>
      <View style={styles.item}>
        <Text>
          The Transparent button is with white color, only visible when
          background color is in different color
        </Text>
      </View>
      <View
        style={{ marginBottom: size(1), backgroundColor: color("grey", 100) }}
      >
        <TransparentButton
          text="Transparent Button"
          icon={
            <Ionicons
              name="ios-arrow-back"
              size={size(2)}
              color={color("grey", 0)}
            />
          }
          accessibilityLabel="id-scanner-back-button"
        />
      </View>
    </View>
  ));
