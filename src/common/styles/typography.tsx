import { Dimensions, Platform, PixelRatio } from "react-native";

export type FontSizeLevel = -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Returns the font size given the level
 *
 * @param level
 *    -4 (9), -3 (10), -2 (12), -1 (14), 0 (16),
 *    1 (18), 2 (20), 3 (24), 4 (32), 5 (40), 6 (48), 7 (56)
 */
export const fontSize = (level: FontSizeLevel): number => {
  if (level < 0) {
    return [14, 12, 10, 9][Math.abs(level) - 1];
  } else {
    return [16, 18, 20, 24, 32, 40, 48, 56][level];
  }
};

export type LetterSpacingLevel = 1 | 2;

/**
 * Returns the amount of letter spacing given the level
 *
 * @param level 1 (0.5), 2 (0.7)
 */
export const letterSpacing = (level: LetterSpacingLevel): number =>
  [0.5, 0.7][level - 1];

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// based on iphone 6s's scale
const scale = SCREEN_WIDTH / 375;

export const normalize = (size: number): number => {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};
