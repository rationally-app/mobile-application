import React, { FunctionComponent } from "react";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { size, color, fontSize, borderRadius } from "../../common/styles";
import { SecondaryButton } from "./Buttons/SecondaryButton";
import { AppText } from "./AppText";

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: color("yellow", 30),
    paddingHorizontal: size(2),
    paddingVertical: size(1.5),
    borderRadius: borderRadius(3)
  },
  iconWrapper: {
    marginRight: size(1)
  },
  contentWrapper: {
    flex: 1
  },
  title: {
    fontFamily: "brand-bold",
    fontSize: fontSize(-1)
  },
  description: {
    fontSize: fontSize(-2)
  },
  buttonWrapper: {
    alignSelf: "center",
    marginLeft: size(1)
  }
});

interface Banner {
  title: string;
  description?: string;
  featherIconName?: string;
  action?: {
    callback: () => void;
    label: string;
  };
}

export const Banner: FunctionComponent<Banner> = ({
  title,
  description,
  featherIconName,
  action
}) => (
  <View style={styles.wrapper}>
    {featherIconName && (
      <View style={styles.iconWrapper}>
        <Feather
          name={featherIconName}
          size={size(2.5)}
          color={color("blue", 50)}
        />
      </View>
    )}
    <View style={styles.contentWrapper}>
      <AppText style={styles.title}>{title}</AppText>
      {description && (
        <AppText style={styles.description}>{description}</AppText>
      )}
    </View>
    {action && (
      <View style={styles.buttonWrapper}>
        <SecondaryButton
          onPress={action.callback}
          text={action.label}
          size="small"
        />
      </View>
    )}
  </View>
);
