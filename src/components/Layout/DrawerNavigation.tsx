import React, {
  FunctionComponent,
  PropsWithChildren,
  useCallback,
  useContext,
} from "react";
import {
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { CommonActions, DrawerActions } from "@react-navigation/native";
import { DrawerContentComponentProps } from "@react-navigation/drawer";
import { AppText } from "./AppText";
import { size, color, fontSize } from "../../common/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HelpModalContext } from "../../context/help";
import { useDrawerContext, DrawerButton } from "../../context/drawer";
import Constants from "expo-constants";
import { AlertModalContext, CONFIRMATION_MESSAGE } from "../../context/alert";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { useTheme } from "../../context/theme";
import { Screens } from "../../types";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  navLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: size(4),
    paddingVertical: size(2.5),
    borderBottomColor: color("grey", 20),
    borderBottomWidth: 1,
  },
  navLinkText: {
    fontFamily: "brand-bold",
  },
  bottomNavContainerLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: size(4),
    paddingVertical: size(1),
  },
  bottomVersionText: {
    paddingHorizontal: size(4),
    marginTop: size(3),
    paddingVertical: size(1),
    fontSize: fontSize(-4),
  },
  bottomNavContainerText: {
    fontSize: fontSize(-1),
  },
});

interface BottomNavigationLink {
  onPress: () => void;
}

export const BottomNavigationLink: FunctionComponent<
  PropsWithChildren<BottomNavigationLink>
> = ({ children, onPress }) => {
  return (
    <View style={styles.bottomNavContainerLink}>
      <TouchableOpacity onPress={onPress}>
        <AppText style={styles.bottomNavContainerText}>{children}</AppText>
      </TouchableOpacity>
    </View>
  );
};

export const DrawerButtonComponent: FunctionComponent<DrawerButton> = ({
  icon,
  label,
  onPress,
  accessibilityLabel = "drawer-nav-button",
}) => {
  const { theme } = useTheme();
  return (
    <TouchableOpacity
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      testID={accessibilityLabel}
    >
      <View style={styles.navLink}>
        <MaterialCommunityIcons
          name={icon}
          size={size(2.5)}
          color={theme.drawer.generalButtonColor}
          style={{ marginRight: size(2) }}
        />
        <AppText style={styles.navLinkText}>{label}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export const DrawerNavigationComponent: FunctionComponent<
  DrawerContentComponentProps
> = ({ navigation }) => {
  const { showConfirmationAlert } = useContext(AlertModalContext);
  const showHelpModal = useContext(HelpModalContext);
  const { drawerButtons } = useDrawerContext();
  const handleLogout = useCallback((): void => {
    navigation.dispatch(
      CommonActions.navigate({
        name: Screens.LogoutScreen,
      })
    );
  }, [navigation]);

  const { i18nt } = useTranslate();

  const onPressLogout = (): void => {
    showConfirmationAlert(CONFIRMATION_MESSAGE.CONFIRM_LOGOUT, handleLogout);
  };

  const onPressCloseDrawer = (): void => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };
  const branchName: string | undefined = (Constants.manifest2?.metadata as any)
    ?.branchName
    ? (Constants.manifest2?.metadata as any)?.branchName
    : Constants.manifest?.releaseChannel;
  const manifestVersion = Constants.manifest?.version
    ? Constants.manifest?.version
    : Constants.manifest2?.extra?.expoClient?.version;
  let version = "";
  const appBuildVersion = Constants.manifest?.extra?.appBuildVersion
    ? Constants.manifest?.extra?.appBuildVersion
    : Constants.manifest2?.extra?.expoClient?.extra?.appBuildVersion;
  if (__DEV__) {
    version += "Dev version";
  } else {
    version += `ver ${manifestVersion}`;
    if (appBuildVersion) {
      version += ` / ${appBuildVersion}`;
    }
    if (
      branchName &&
      (branchName === "staging" || branchName.match(/pr\d+/g))
    ) {
      version += ` / ${branchName}`;
    }
  }

  return (
    <View style={{ flex: 1, marginBottom: size(2) }}>
      <View
        style={{
          marginTop: size(8),
          marginRight: size(2),
          alignItems: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={onPressCloseDrawer}
          style={{
            padding: size(1),
          }}
        >
          <MaterialCommunityIcons
            name="close"
            size={size(3)}
            color={color("blue", 50)}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
        }}
      >
        <View
          style={{
            marginTop: size(3),
            borderTopColor: color("grey", 20),
            borderTopWidth: 1,
            marginBottom: size(4),
          }}
        >
          <View>
            {drawerButtons.map((button) => (
              <DrawerButtonComponent {...button} key={button.label} />
            ))}
            <DrawerButtonComponent
              icon="logout"
              label={i18nt("navigationDrawer", "logout")}
              onPress={onPressLogout}
              accessibilityLabel="drawer-nav-logout-button"
            />
          </View>
        </View>
        <View style={{ marginBottom: size(4) }}>
          <BottomNavigationLink onPress={showHelpModal}>
            {i18nt("navigationDrawer", "helpSupport")}
          </BottomNavigationLink>
          <BottomNavigationLink
            onPress={() => {
              Linking.openURL("https://www.supply.gov.sg/terms-of-use");
            }}
          >
            {i18nt("navigationDrawer", "termsOfUse")}
          </BottomNavigationLink>
          <BottomNavigationLink
            onPress={() => {
              Linking.openURL("https://www.supply.gov.sg/privacy");
            }}
          >
            {i18nt("navigationDrawer", "privacyStatement")}
          </BottomNavigationLink>
          <BottomNavigationLink
            onPress={() => {
              Linking.openURL("https://www.tech.gov.sg/report_vulnerability");
            }}
          >
            {i18nt("navigationDrawer", "reportVulnerability")}
          </BottomNavigationLink>
          <AppText style={styles.bottomVersionText}>{version}</AppText>
        </View>
      </ScrollView>
    </View>
  );
};
