import React, { FunctionComponent, useCallback, useContext } from "react";
import {
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import {
  DrawerContentComponentProps,
  DrawerActions,
} from "react-navigation-drawer";
import { useLogout } from "../../hooks/useLogout";
import { AppText } from "./AppText";
import { size, color, fontSize } from "../../common/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HelpModalContext } from "../../context/help";
import { useDrawerContext, DrawerButton } from "../../context/drawer";
import Constants from "expo-constants";
import { AlertModalContext, CONFIRMATION_MESSAGE } from "../../context/alert";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";

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

export const BottomNavigationLink: FunctionComponent<BottomNavigationLink> = ({
  children,
  onPress,
}) => {
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
          color={color("blue", 50)}
          style={{ marginRight: size(2) }}
        />
        <AppText style={styles.navLinkText}>{label}</AppText>
      </View>
    </TouchableOpacity>
  );
};

export const DrawerNavigationComponent: FunctionComponent<DrawerContentComponentProps> = ({
  navigation,
}) => {
  const { logout } = useLogout();
  const { showConfirmationAlert } = useContext(AlertModalContext);
  const showHelpModal = useContext(HelpModalContext);
  const { drawerButtons } = useDrawerContext();
  const handleLogout = useCallback((): void => {
    logout(navigation.dispatch);
  }, [logout, navigation.dispatch]);

  const { i18nt } = useTranslate();

  const onPressLogout = (): void => {
    showConfirmationAlert(CONFIRMATION_MESSAGE.CONFIRM_LOGOUT, handleLogout);
  };

  const onPressCloseDrawer = (): void => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  const releaseChannel: string | undefined = Constants.manifest.releaseChannel;
  let version = "";
  if (releaseChannel) {
    version += `ver ${Constants.manifest.version}`;
    if (Constants.manifest.extra.appBuildVersion) {
      version += ` / ${Constants.manifest.extra.appBuildVersion}`;
    }
    if (releaseChannel === "staging" || releaseChannel.match(/pr\d+/g)) {
      version += ` / ${releaseChannel}`;
    }
  } else if (__DEV__) {
    version += "Dev version";
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
              Linking.openURL("https://www.supplyally.gov.sg/terms-of-use");
            }}
          >
            {i18nt("navigationDrawer", "termsOfUse")}
          </BottomNavigationLink>
          <BottomNavigationLink
            onPress={() => {
              Linking.openURL("https://www.supplyally.gov.sg/privacy");
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
