import React, { FunctionComponent, useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";
import { NavigationProps } from "../../types";
import { replaceRouteFn } from "../../common/navigation";
import { Header } from "../Layout/Header";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { fontSize } from "../../common/styles";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useAuthenticationContext } from "../../context/auth";

interface BarCodeScanningResult {
  type: string;
  data: string;
}

const styles = StyleSheet.create({
  headerText: {
    fontWeight: "bold",
    fontSize: fontSize(1),
    flex: 1,
    textAlign: "center",
    alignSelf: "center"
  }
});

export const CollectCustomerDetailsScreen: FunctionComponent<NavigationProps> = ({
  navigation
}) => {
  const { authKey } = useAuthenticationContext();
  const [scannerEnabled, setScannerEnabled] = useState(true);
  const [nric, setNric] = useState("");
  const [hasCameraPermission, setHasCameraPermission] = useState();
  const askForCameraPermission = async (): Promise<void> => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission(status === "granted");
  };
  useEffect(() => {
    askForCameraPermission();
  }, []);

  const onBarCodeScanned = (event: BarCodeScanningResult): void => {
    if (event.data) {
      setNric(event.data);
      onCheck();
    }
  };

  const onCheck = () => {
    navigation.navigate("CustomerQuotaScreen");
  };

  const onToggleScanner = () => {
    setScannerEnabled(!scannerEnabled);
  };

  return (
    <View>
      <Header>
        <Text style={styles.headerText}>Input NRIC</Text>
      </Header>
      <Text>Enter customer's NRIC...</Text>
      {scannerEnabled && (
        <BarCodeScanner
          barCodeTypes={[BarCodeScanner.Constants.BarCodeType.code39]}
          style={{ width: "100%", height: 80 }}
          onBarCodeScanned={onBarCodeScanned}
        />
      )}
      <TextInput
        style={{ height: 40, borderColor: "gray", borderWidth: 1 }}
        value={nric}
        onChange={({ nativeEvent: { text } }) => setNric(text)}
      />
      <DarkButton text="Check" onPress={onCheck} />
      <DarkButton text="Toggle Scanner" onPress={onToggleScanner} />
    </View>
  );
};
