import React, { useState, FunctionComponent, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { size, color } from "../../common/styles";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { AppText } from "../Layout/AppText";
import { DropdownFilterInput } from "../DropdownFilterModal/DropdownFilterInput";
import { nationalityItems } from "../DropdownFilterModal/nationalityItems";
import { DropdownItem } from "../DropdownFilterModal/DropdownFilterModal";
import { useTranslate } from "../../hooks/useTranslate/useTranslate";
import { sharedStyles } from "./sharedStyles";

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
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

interface PassportInputSection {
  hasScanner: boolean;
  openCamera: () => void;
  setIdInput: (id: string) => void;
  submitId: () => void;
}

export const PassportInputSection: FunctionComponent<PassportInputSection> = ({
  hasScanner,
  openCamera,
  setIdInput,
  submitId,
}) => {
  const { i18nt } = useTranslate();

  const [selectedCountry, setSelectedCountry] = useState<DropdownItem>();
  const [passportNum, setPassportNum] = useState<string>();

  const onItemSelection = (item: DropdownItem): void => {
    setSelectedCountry(item);
  };

  useEffect(() => {
    selectedCountry && passportNum
      ? setIdInput(`${selectedCountry?.id}-${passportNum}`)
      : setIdInput("");
  }, [selectedCountry, passportNum, setIdInput]);

  const getScannerComponent = (): JSX.Element | null => {
    return hasScanner ? (
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
              value={selectedCountry?.name}
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
              autoCompleteType="off"
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
