import React, {
  useState,
  FunctionComponent,
  Dispatch,
  SetStateAction,
  useEffect
} from "react";
import { View, StyleSheet, TextInput } from "react-native";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { size, color, borderRadius, fontSize } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { LoginStage } from "./types";
import { requestOTP } from "../../services/auth";
import {
  mobileNumberValidator,
  countryCodeValidator,
  createFullNumber
} from "./utils";

const styles = StyleSheet.create({
  inputAndButtonWrapper: {
    marginTop: size(3)
  },
  numberWrapper: {
    marginBottom: size(2)
  },
  label: {
    fontFamily: "brand-bold"
  },
  inputsWrapper: {
    flexDirection: "row",
    alignItems: "center"
  },
  countryCode: {
    minHeight: size(6),
    paddingHorizontal: size(1),
    marginTop: size(1),
    backgroundColor: color("grey", 0),
    borderWidth: 1,
    borderRadius: borderRadius(2),
    borderColor: color("grey", 40),
    fontSize: fontSize(0),
    color: color("blue", 50),
    minWidth: size(7)
  },
  numberInput: {
    flex: 1,
    minHeight: size(6),
    paddingHorizontal: size(1),
    marginTop: size(1),
    backgroundColor: color("grey", 0),
    borderWidth: 1,
    borderRadius: borderRadius(2),
    borderColor: color("grey", 40),
    fontSize: fontSize(0),
    color: color("blue", 50)
  },
  hyphen: {
    marginRight: size(1),
    marginLeft: size(1),
    fontSize: fontSize(3)
  }
});

interface LoginMobileNumberCard {
  setLoginStage: Dispatch<SetStateAction<LoginStage>>;
  setMobileNumber: Dispatch<SetStateAction<string>>;
  codeKey: string;
  endpoint: string;
}

export const LoginMobileNumberCard: FunctionComponent<LoginMobileNumberCard> = ({
  setLoginStage,
  setMobileNumber,
  codeKey,
  endpoint
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [countryCode, setCountryCode] = useState("+65");
  const [mobileNumberValue, setMobileNumberValue] = useState("");

  useEffect(() => {
    if (mobileNumberValue === "123") {
      throw new Error("don't play punk");
    }
  }, [mobileNumberValue]);

  const onChangeCountryCode = (value: string): void => {
    if (value.length <= 4) {
      const valueWithPlusSign = value[0] === "+" ? value : `+${value}`;
      setCountryCode(valueWithPlusSign);
    }
  };

  const onChangeMobileNumber = (text: string): void => {
    /^\d*$/.test(text) && setMobileNumberValue(text);
  };

  const onRequestOTP = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const fullNumber = createFullNumber(countryCode, mobileNumberValue);
      await requestOTP(fullNumber, codeKey, endpoint);
      setIsLoading(false);
      setMobileNumber(fullNumber);
      setLoginStage("OTP");
    } catch (e) {
      setIsLoading(false);
      alert(e);
    }
  };

  const onSubmitMobileNumber = (): void => {
    if (!countryCodeValidator(countryCode)) {
      alert("Invalid country code");
    } else if (!mobileNumberValidator(countryCode, mobileNumberValue)) {
      alert("Invalid mobile phone number");
    } else {
      onRequestOTP();
    }
  };

  return (
    <Card>
      <AppText>
        Please enter your mobile phone number to receive a one-time password.
      </AppText>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.numberWrapper}>
          <AppText style={styles.label}>Mobile phone number</AppText>
          <View style={styles.inputsWrapper}>
            <TextInput
              style={styles.countryCode}
              keyboardType="phone-pad"
              value={countryCode}
              onChange={({ nativeEvent: { text } }) =>
                onChangeCountryCode(text)
              }
            />
            <AppText style={styles.hyphen}>-</AppText>
            <TextInput
              style={styles.numberInput}
              keyboardType="phone-pad"
              value={mobileNumberValue}
              onChange={({ nativeEvent: { text } }) =>
                onChangeMobileNumber(text)
              }
              onSubmitEditing={onSubmitMobileNumber}
            />
          </View>
        </View>
        <DarkButton
          text="Send OTP"
          onPress={onSubmitMobileNumber}
          fullWidth={true}
          isLoading={isLoading}
        />
      </View>
    </Card>
  );
};
