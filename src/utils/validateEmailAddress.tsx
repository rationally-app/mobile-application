import Joi from "react-native-joi";
import { ERROR_MESSAGE } from "../context/alert";

const emailAddressSchema = Joi.string().trim().email().required();

export const validateEmailAddress = (emailAddress: string): string => {
  const result = emailAddressSchema.validate(emailAddress);
  if (result.error) {
    throw new Error(ERROR_MESSAGE.INVALID_EMAIL_ADDRESS);
  }
  return emailAddress;
};
