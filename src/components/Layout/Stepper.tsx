import React, {
  FunctionComponent,
  Dispatch,
  SetStateAction,
  useRef,
  useEffect,
  useState
} from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Platform,
  Vibration
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { clamp, debounce } from "lodash";
import { size, color, fontSize, borderRadius } from "../../common/styles";
import { AppText } from "./AppText";
import { useIsMounted } from "../../hooks/useIsMounted";

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: color("grey", 0),
    minWidth: 160,
    flexDirection: "row",
    minHeight: size(7),
    borderWidth: 1,
    borderRadius: borderRadius(2)
  },
  wrapperDefault: {
    borderColor: color("grey", 30)
  },
  wrapperHighlighted: {
    borderColor: color("green", 50)
  },
  stepButton: {
    minWidth: size(7),
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
    marginHorizontal: 2,
    fontWeight: "bold",
    fontSize: fontSize(1),
    color: color("blue", 50),
    borderBottomColor: color("grey", 30),
    borderBottomWidth: 1,
    textAlign: "center",
    paddingVertical: 0,
    paddingHorizontal: 2,
    fontFamily: "brand-bold",
    ...Platform.select({
      android: {
        marginTop: -2
      }
    })
  },
  suffix: {
    marginTop: -2,
    fontFamily: "brand-regular",
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
  const flooredNum = Math.floor(clampedNum / step) * step;
  return isNaN(flooredNum) ? 0 : flooredNum;
};

interface StepperButton {
  onPress: () => void;
  variant: "PLUS" | "MINUS";
  disabled?: boolean;
}

const StepperButton: FunctionComponent<StepperButton> = ({
  onPress,
  variant,
  disabled = false
}) => {
  const [isPressedIn, setIsPressedIn] = useState(false);
  const [longPressStartTime, setLongPressStartTime] = useState(0);

  useEffect(() => {
    let timeout: any;
    if (longPressStartTime > 0 && isPressedIn) {
      // Exponential decay so that the rate of change in value changes with time.
      const duration = Math.round(
        300 * 0.4 ** ((Date.now() - longPressStartTime) / 1000)
      );
      timeout = setTimeout(() => {
        if (Platform.OS === "android") {
          Vibration.vibrate(5);
        }
        onPress();
      }, duration);
    } else {
      clearTimeout(timeout);
    }
    return () => {
      clearTimeout(timeout);
    };
  }, [isPressedIn, longPressStartTime, onPress]);

  return (
    <TouchableOpacity
      style={styles.stepButton}
      onPress={() => {
        onPress();
        if (Platform.OS === "android") {
          Vibration.vibrate(10);
        }
      }}
      disabled={disabled}
      delayLongPress={300}
      onPressIn={() => setIsPressedIn(true)}
      onPressOut={() => {
        setIsPressedIn(false);
        setLongPressStartTime(0);
      }}
      onLongPress={() => {
        setLongPressStartTime(Date.now());
      }}
    >
      <Feather
        name={variant === "PLUS" ? "plus" : "minus"}
        size={size(3)}
        color={color("grey", disabled ? 30 : 80)}
      />
    </TouchableOpacity>
  );
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
  const isMounted = useIsMounted();
  const [internalValue, setInternalValue] = useState<string>(`${value}`);

  const delayedClampAndRound = useRef(
    debounce<typeof clampAndRound>((...props) => {
      const num = clampAndRound(...props);
      if (isMounted.current) {
        setInternalValue(`${num}`);
      }
      return num;
    }, 800)
  );

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
    } else {
      // e.g. "-1"
      return;
    }

    const num = clampAndRound(value, bounds.min, bounds.max, step);
    setValue(num);
  };

  // When input is blurred, immediately clamp and round
  const onBlur = (): void => {
    const num = clampAndRound(internalValue, bounds.min, bounds.max, step);
    setInternalValue(`${num}`);
  };

  return (
    <View
      style={[
        styles.wrapper,
        value > 0 ? styles.wrapperHighlighted : styles.wrapperDefault
      ]}
    >
      <StepperButton
        variant="MINUS"
        onPress={decrement}
        disabled={value === bounds.min}
      />
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
      <StepperButton
        variant="PLUS"
        onPress={increment}
        disabled={value === bounds.max}
      />
    </View>
  );
};
