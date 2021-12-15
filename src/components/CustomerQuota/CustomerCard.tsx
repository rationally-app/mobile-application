import React, { FunctionComponent } from "react";
import {
  StyleSheet,
  View,
  ViewStyle,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { Feather } from "@expo/vector-icons";
import { size, color, borderRadius, fontSize } from "../../common/styles";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { useTheme } from "../../context/theme";

const styles = StyleSheet.create({
  header: {
    borderTopLeftRadius: borderRadius(3),
    borderTopRightRadius: borderRadius(3),
    paddingHorizontal: size(2),
    paddingVertical: size(2),
    flexDirection: "row",
    alignItems: "flex-start",
  },
  headerText: {
    marginLeft: size(1.5),
    flex: 1,
  },
  idLabel: {
    fontSize: fontSize(-2),
    marginBottom: 2,
  },
  idText: {
    fontSize: fontSize(1),
    fontFamily: "brand-bold",
    lineHeight: 1.2 * fontSize(1),
  },
  childrenWrapper: {
    overflow: "hidden",
    borderBottomLeftRadius: borderRadius(4),
    borderBottomRightRadius: borderRadius(4),
  },
});

interface AddButton {
  text: string;
  onPress?: TouchableOpacityProps["onPress"];
}

export const AddButton: FunctionComponent<AddButton> = ({ text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={{
          backgroundColor: color("grey", 0),
          borderColor: color("blue", 50),
          borderWidth: 1,
          alignSelf: "flex-start",
          alignItems: "center",
          justifyContent: "center",
          paddingVertical: size(1),
          paddingHorizontal: size(2),
          borderRadius: borderRadius(2),
        }}
      >
        <AppText
          style={{
            fontFamily: "brand-bold",
            textAlign: "center",
          }}
        >
          {text}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

export const CustomerCard: FunctionComponent<{
  ids: string[];
  onAddId?: () => void;
  headerBackgroundColor?: ViewStyle["backgroundColor"];
}> = ({ ids, onAddId, headerBackgroundColor, children }) => {
  const { theme } = useTheme();
  const { i18nt } = useTranslate();
  return (
    <Card
      style={{
        paddingTop: 0,
        paddingBottom: 0,
        paddingHorizontal: 0,
      }}
    >
      <View
        style={[
          styles.header,
          headerBackgroundColor
            ? { backgroundColor: headerBackgroundColor }
            : { backgroundColor: theme.customerCard.successfulHeaderColor },
        ]}
      >
        <Feather
          name="user"
          size={size(3)}
          color={theme.customerCard.userIconColor}
        />
        <View style={styles.headerText}>
          <AppText
            style={{
              color: theme.customerCard.idLabelColor,
              ...styles.idLabel,
            }}
          >
            {ids.length > 1
              ? i18nt("customerQuotaScreen", "idNumbers")
              : i18nt("customerQuotaScreen", "idNumber")}
          </AppText>
          {ids.map((id) => (
            <AppText
              key={id}
              style={{
                color: theme.customerCard.idTextColor,
                ...styles.idText,
              }}
            >
              {id}
            </AppText>
          ))}
        </View>
        {onAddId && (
          <AddButton
            onPress={onAddId}
            text={`+ ${i18nt("customerQuotaScreen", "quotaButtonAdd")}`}
          ></AddButton>
        )}
      </View>
      <View style={styles.childrenWrapper}>{children}</View>
    </Card>
  );
};
