import React, {
  FunctionComponent,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  useState
} from "react";
import { View, TouchableOpacity, StyleSheet, TextInput } from "react-native";
import { Feather } from "@expo/vector-icons";
import { clamp, debounce } from "lodash";
import { size, color, fontSize, borderRadius } from "../../common/styles";
import { AppText } from "./AppText";

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: color("grey", 0),
    minWidth: 144,
    flexDirection: "row",
    minHeight: size(6),
    borderWidth: 1,
    borderRadius: borderRadius(2),
    borderColor: color("grey", 30)
  },
  stepButton: {
    minWidth: size(6),
    alignItems: "center",
    justifyContent: "center"
  },
  inputAndSuffixWrapper: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    marginTop: -2,
    marginHorizontal: 2,
    fontFamily: "monospace",
    fontWeight: "bold",
    fontSize: fontSize(1),
    color: color("blue", 50),
    borderBottomColor: color("grey", 30),
    borderBottomWidth: 1,
    textAlign: "center",
    paddingVertical: 0,
    paddingHorizontal: 2
  },
  suffix: {
    marginTop: -2,
    fontFamily: "inter",
    fontSize: fontSize(0)
  }
});

const parseNumber = (value: string): number => Number(value.replace(/\s/g, ""));
const isNumber = (value: string): boolean => !isNaN(parseNumber(value));
const clampAndRound = (
  value: string,
  min: number,
  max: number,
  step: number
): number => {
  const num = parseNumber(value);
  const clampedNum = clamp(num, min, max);
  const roundedNum = Math.floor(clampedNum / step) * step;
  return roundedNum;
};

export interface Stepper {
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
  bounds?: {
    min: number;
    max: number;
  };
  step?: number;
  unit?: {
    type: "PREFIX" | "POSTFIX";
    label: string;
  };
}

export const Stepper: FunctionComponent<Stepper> = ({
  value,
  setValue,
  bounds = {
    min: Number.MIN_SAFE_INTEGER,
    max: Number.MAX_SAFE_INTEGER
  },
  step = 1,
  unit
}) => {
  const [internalValue, setInternalValue] = useState<string>(`${value}`);

  const delayedClampAndRound = useRef(
    debounce<typeof clampAndRound>((...props) => {
      const num = clampAndRound(...props);
      setInternalValue(`${num}`);
      setValue(num);
      return num;
    }, 800)
  );

  // Sync internal and external values
  useEffect(() => {
    setInternalValue(internalValue =>
      internalValue !== `${value}` ? `${value}` : internalValue
    );
  }, [value]);

  useEffect(() => {
    delayedClampAndRound.current(internalValue, bounds.min, bounds.max, step);
  }, [internalValue, bounds.min, bounds.max, step]);

  const decrement = (): void => {
    const newValue = clamp(
      parseNumber(internalValue) - step,
      bounds.min,
      bounds.max
    );
    setInternalValue(`${newValue}`);
    setValue(newValue);
  };

  const increment = (): void => {
    const newValue = clamp(
      parseNumber(internalValue) + step,
      bounds.min,
      bounds.max
    );
    setInternalValue(`${newValue}`);
    setValue(newValue);
  };

  const onChangeTextValue = (value: string): void => {
    if (value === "") {
      // Allow empty strings as a temporary internal value so that when the entire string
      // is cleared, it won't default to 0.
      setInternalValue(value);
    } else if (isNumber(value)) {
      setInternalValue(`${parseNumber(value)}`);
    }
  };

  // When input is blurred, immediately clamp and round
  const onBlur = (): void => {
    const num = clampAndRound(internalValue, bounds.min, bounds.max, step);
    setInternalValue(`${num}`);
    setValue(num);
  };

  return (
    <View style={styles.wrapper}>
      <TouchableOpacity
        style={styles.stepButton}
        onPress={decrement}
        disabled={value === bounds?.min}
      >
        <Feather
          name="minus"
          size={size(2.5)}
          color={color("grey", value === bounds?.min ? 30 : 80)}
        />
      </TouchableOpacity>
      <View style={styles.inputAndSuffixWrapper}>
        {unit?.type === "PREFIX" && (
          <AppText style={styles.suffix}>{unit?.label}</AppText>
        )}
        <TextInput
          style={styles.input}
          value={internalValue}
          onChangeText={onChangeTextValue}
          onBlur={onBlur}
          keyboardType="number-pad"
          maxLength={Math.ceil(Math.log10(bounds.max + 1))}
        />
        {unit?.type === "POSTFIX" && (
          <AppText style={styles.suffix}>{unit?.label}</AppText>
        )}
      </View>
      <TouchableOpacity
        style={styles.stepButton}
        onPress={increment}
        disabled={value === bounds?.max}
      >
        <Feather
          name="plus"
          size={size(2.5)}
          color={color("grey", value === bounds?.max ? 30 : 80)}
        />
      </TouchableOpacity>
    </View>
  );
};
