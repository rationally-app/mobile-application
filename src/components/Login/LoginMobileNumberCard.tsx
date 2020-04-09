import React, {
  useState,
  FunctionComponent,
  Dispatch,
  SetStateAction,
} from "react";
import { View, StyleSheet } from "react-native";
import { DarkButton } from "../Layout/Buttons/DarkButton";
import { size } from "../../common/styles";
import { Card } from "../Layout/Card";
import { AppText } from "../Layout/AppText";
import { InputWithLabel } from "../Layout/InputWithLabel";
import { LOGIN_STAGES } from "../../types";
import { requestOTP } from "../../services/auth";
import { useAuthenticationContext } from "../../context/auth";
import { mobileNumberValidator } from "./utils";

const styles = StyleSheet.create({
  inputAndButtonWrapper: {
    marginTop: size(3),
  },
  inputWrapper: {
    marginBottom: size(2),
  },
});

interface LoginMobileNumberCard {
  setLoginStage: Dispatch<SetStateAction<LOGIN_STAGES>>;
  mobileNumber: string;
  setMobileNumber: Dispatch<SetStateAction<string>>;
  codeKey: string;
}

export const LoginMobileNumberCard: FunctionComponent<LoginMobileNumberCard> = ({
  setLoginStage,
  mobileNumber,
  setMobileNumber,
  codeKey,
}: LoginMobileNumberCard) => {
  const [isLoading, setIsLoading] = useState(false);
  const { endpoint } = useAuthenticationContext();

  const onRequestOTP = async (mobileNumber: string): Promise<void> => {
    setIsLoading(true);
    try {
      await requestOTP(mobileNumber, codeKey, endpoint);
      setIsLoading(false);
      setLoginStage(LOGIN_STAGES.OTP);
    } catch (e) {
      alert(e.message || e);
    }
  };

  const onSubmitMobileNumber = (): void => {
    if (mobileNumberValidator(mobileNumber)) {
      onRequestOTP(mobileNumber);
    } else {
      alert("Invalid mobile phone number");
    }
  };

  return (
    <Card>
      <AppText>
        Please enter your mobile phone number to receive a one-time password.
      </AppText>
      <View style={styles.inputAndButtonWrapper}>
        <View style={styles.inputWrapper}>
          <InputWithLabel
            label="Mobile phone number"
            value={mobileNumber}
            onChange={({ nativeEvent: { text } }) => setMobileNumber(text)}
            onSubmitEditing={onSubmitMobileNumber}
          />
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
