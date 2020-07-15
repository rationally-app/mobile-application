import React, { FunctionComponent, useCallback, useContext } from "react";
import {
  Linking,
  StyleSheet,
  Alert,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-navigation";
import {
  DrawerContentComponentProps,
  DrawerActions
} from "react-navigation-drawer";
import { useLogout } from "../../hooks/useLogout";
import { AppText } from "./AppText";
import { size, color, fontSize } from "../../common/styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { HelpModalContext } from "../../context/help";
import { useDrawerContext, DrawerButtons } from "../../context/drawer";
import Constants from "expo-constants";
import version from "../../../version.json";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative"
  },
  navLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: size(4),
    paddingVertical: size(2.5),
    borderBottomColor: color("grey", 20),
    borderBottomWidth: 1
  },
  navLinkText: {
    color: color("blue", 50),
    fontFamily: "brand-bold"
  },
  bottomNavContainerLink: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: size(4),
    paddingVertical: size(1)
  },
  bottomNavContainerText: {
    color: color("blue", 50),
    fontSize: fontSize(-1)
  }
});

interface BottomNavigationLink {
  onPress: () => void;
}

export const BottomNavigationLink: FunctionComponent<BottomNavigationLink> = ({
  children,
  onPress
}) => {
  return (
    <View style={styles.bottomNavContainerLink}>
      <TouchableOpacity onPress={onPress}>
        <AppText style={styles.bottomNavContainerText}>{children}</AppText>
      </TouchableOpacity>
    </View>
  );
};

export const DrawerButton: FunctionComponent<DrawerButtons> = ({
  icon,
  label,
  onPress
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
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
  navigation
}) => {
  const { logout } = useLogout();
  const showHelpModal = useContext(HelpModalContext);
  const { drawerButtons } = useDrawerContext();
  const handleLogout = useCallback((): void => {
    logout(navigation.dispatch);
  }, [logout, navigation.dispatch]);

  const onPressLogout = (): void => {
    Alert.alert(
      "Are you sure you want to log out?",
      "Stay logged in to change your scanning location.",
      [
        {
          text: "Cancel"
        },
        {
          text: "Logout",
          onPress: handleLogout,
          style: "destructive"
        }
      ],
      { cancelable: false }
    );
  };

  const onPressCloseDrawer = (): void => {
    navigation.dispatch(DrawerActions.closeDrawer());
  };

  return (
    <SafeAreaView
      style={styles.container}
      forceInset={{ top: "always", horizontal: "never" }}
    >
      <TouchableOpacity
        onPress={onPressCloseDrawer}
        style={{
          position: "absolute",
          right: size(3),
          top: size(5),
          padding: size(1)
        }}
      >
        <MaterialCommunityIcons
          name="close"
          size={size(3)}
          color={color("blue", 50)}
        />
      </TouchableOpacity>
      <View
        style={{
          marginTop: size(9),
          borderTopColor: color("grey", 20),
          borderTopWidth: 1
        }}
      >
        {drawerButtons.map(button => (
          <DrawerButton {...button} key={button.label} />
        ))}
        <TouchableOpacity onPress={onPressLogout}>
          <View style={styles.navLink}>
            <MaterialCommunityIcons
              name="logout"
              size={size(2.5)}
              color={color("blue", 50)}
              style={{ marginRight: size(2) }}
            />
            <AppText style={styles.navLinkText}>Logout</AppText>
          </View>
        </TouchableOpacity>
      </View>
      <View style={{ marginTop: "auto", marginBottom: size(4) }}>
        <BottomNavigationLink onPress={showHelpModal}>
          Help & Support
        </BottomNavigationLink>
        <BottomNavigationLink
          onPress={() => {
            Linking.openURL("https://www.supplyally.gov.sg/terms-of-use");
          }}
        >
          Terms of use
        </BottomNavigationLink>
        <BottomNavigationLink
          onPress={() => {
            Linking.openURL("https://www.supplyally.gov.sg/privacy");
          }}
        >
          Privacy Statement
        </BottomNavigationLink>
        <BottomNavigationLink
          onPress={() => {
            Linking.openURL("https://www.tech.gov.sg/report_vulnerability");
          }}
        >
          Report vulnerability
        </BottomNavigationLink>
        <View style={{ marginTop: size(3), ...styles.bottomNavContainerLink }}>
          <AppText style={{ color: color("blue", 50), fontSize: fontSize(-4) }}>
            {`Version: ${Constants.manifest.version}/ ${version.jsBuildNumber}`}
          </AppText>
        </View>
      </View>
    </SafeAreaView>
  );
};
