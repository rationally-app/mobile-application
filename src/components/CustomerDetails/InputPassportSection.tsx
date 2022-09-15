import React, { useState, FunctionComponent, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { size, color } from "../../common/styles";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { PolicyChoices } from "../../types";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { AppText } from "../Layout/AppText";
import { DropdownFilterInput } from "../DropdownFilterModal/DropdownFilterInput";
import { nationalityItems } from "../DropdownFilterModal/nationalityItems";
import { sharedStyles } from "./sharedStyles";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
  },
  inputAndButtonWrapper: {
    marginTop: size(3),
    flexDirection: "row",
    alignItems: "flex-end",
  },
  inputWrapper: {
    flex: 1,
    marginRight: size(1),
  },
});

interface InputPassportSection {
  scannerType: "CODE_39" | "QR" | "NONE";
  openCamera: () => void;
  idInput: string;
  setIdInput: (id: string) => void;
  submitId: () => void;
}

export const InputPassportSection: FunctionComponent<InputPassportSection> = ({
  scannerType,
  openCamera,
  idInput,
  setIdInput,
  submitId,
}) => {
  const { i18nt } = useTranslate();

  const [selectedCountry, setSelectedCountry] = useState<PolicyChoices>();
  const [passportNum, setPassportNum] = useState<string>();

  const onItemSelection = (item: PolicyChoices): void => {
    setSelectedCountry(item);
  };

  const trimmedPassportNum: string | undefined = passportNum
    ? passportNum.trim()
    : passportNum;

  useEffect(() => {
    selectedCountry && trimmedPassportNum
      ? setIdInput(`${selectedCountry?.value}-${trimmedPassportNum}`)
      : setIdInput("");
  }, [selectedCountry, trimmedPassportNum, setIdInput]);

  useEffect(() => {
    // Change both states to default value to sync the submitted
    // input field state (idInput) with the local states.
    if (idInput === "") {
      setPassportNum(undefined);
      setSelectedCountry(undefined);
    }
  }, [idInput]);

  const getScannerComponent = (): JSX.Element | null => {
    return scannerType !== "NONE" ? (
      <>
        <View style={sharedStyles.scanButtonWrapper}>
          <DarkButton
            fullWidth={true}
            text={i18nt("collectCustomerDetailsScreen", "scanIdentification")}
            icon={
              <Feather
                name="maximize"
                size={size(2)}
                color={color("grey", 0)}
              />
            }
            onPress={openCamera}
          />
        </View>
        <View style={{ position: "relative" }}>
          <View style={sharedStyles.horizontalRule} />
          <View style={sharedStyles.orWrapper}>
            <AppText style={sharedStyles.orText}>
              {i18nt("collectCustomerDetailsScreen", "or")}
            </AppText>
          </View>
        </View>
      </>
    ) : null;
  };

  return (
    <>
      {getScannerComponent()}
      <View style={styles.centeredView}>
        <View style={styles.inputAndButtonWrapper}>
          <View style={styles.inputWrapper}>
            <DropdownFilterInput
              label="Nationality (non-Singaporean)"
              placeholder="Search country"
              value={selectedCountry?.label}
              dropdownItems={nationalityItems}
              onItemSelection={onItemSelection}
            />
          </View>
        </View>
        <View style={styles.inputAndButtonWrapper}>
          <View style={styles.inputWrapper}>
            <InputWithLabel
              label="Passport number"
              value={passportNum ? passportNum : undefined}
              onChange={({ nativeEvent: { text } }) => setPassportNum(text)}
              onSubmitEditing={submitId}
              autoComplete="off"
              autoCorrect={false}
              keyboardType={"default"}
            />
          </View>
        </View>
        <View style={styles.inputAndButtonWrapper}>
          <View style={styles.inputWrapper}>
            <DarkButton
              fullWidth={true}
              text={i18nt("collectCustomerDetailsScreen", "check")}
              onPress={submitId}
              accessibilityLabel="identity-details-check-button-passport"
            />
          </View>
        </View>
      </View>
    </>
  );
};
