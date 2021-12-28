// Thanks to https://gist.github.com/kyrene-chew/6f275325335ab27895beb7a9a7b4c1cb
import { ERROR_MESSAGE } from "../context/alert";

const validate = (nricInput: string): boolean => {
  // validation rules
  const nricRegex = /(\D)(\d{7})(\D)/;
  const nricTypeRegex = /S|T|F|G|M/;
  const weightArr = [2, 7, 6, 5, 4, 3, 2];
  const nricLetterST = ["J", "Z", "I", "H", "G", "F", "E", "D", "C", "B", "A"];
  const nricLetterFG = ["X", "W", "U", "T", "R", "Q", "P", "N", "M", "L", "K"];
  const nricLetterM = ["K", "L", "J", "N", "P", "Q", "R", "T", "U", "W", "X"];

  // set nric to all uppercase to remove case sensitivity
  const nric = nricInput.toUpperCase();

  // returns false if it false basic validation
  if (!nricRegex.exec(nric)) {
    return false;
  }

  // get nric type
  const nricArr = nric.match(nricRegex);
  if (!nricArr) return false;
  const nricType = nricArr[1];

  // returns false if it false basic validation
  if (!nricTypeRegex.exec(nricType)) {
    return false;
  }

  // multiply each digit in the nric number by it's weight in order
  const nricDigitsArr = nricArr[2].split("");
  let total = 0;
  for (let i = 0; i < nricDigitsArr.length; i++) {
    total += parseInt(nricDigitsArr[i]) * weightArr[i];
  }

  // if the nric type is T or G, add 4 to the total
  // else if the nric type is M, add 3 to the total
  if (["T", "G"].indexOf(nricType) >= 0) {
    total += 4;
  } else if (["M"].indexOf(nricType) >= 0) {
    total += 3;
  }

  // check last letter of nric for local
  const letterIndex = total % 11;
  const nricLetter = nricArr[3];
  if (["S", "T"].indexOf(nricType) >= 0) {
    return nricLetterST[letterIndex] === nricLetter;
  } else if (["T", "G"].indexOf(nricType) >= 0) {
    // check last letter of nric for foreigners
    return nricLetterFG[letterIndex] === nricLetter;
  }
  // M nric type logic is slightly different
  return nricLetterM[11 - letterIndex - 1] === nricLetter;
};

export const validateAndCleanNric = (inputNric: string): string => {
  const cleanedInputNric = inputNric.trim().slice(0, 9).toUpperCase();
  const isNricValid = validate(cleanedInputNric);
  if (!isNricValid) {
    throw new Error(ERROR_MESSAGE.INVALID_ID);
  }
  return cleanedInputNric;
};
