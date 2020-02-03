export type ColorName = "grey" | "orange" | "blue" | "green" | "red";
export type ToneLevel = 0 | 5 | 10 | 15 | 20 | 30 | 40 | 50 | 100;
export type ToneLookup = {
  [color in ColorName]: Tone;
};
interface Tone {
  [toneLevel: number]: string;
}

const palette: ToneLookup = {
  grey: {
    "0": "#FFFFFF",
    "5": "#FEFCFA",
    "10": "#F2F2F2",
    "15": "#E8E8E8",
    "20": "#828282",
    "30": "#4F4F4F",
    "40": "#333333",
    "100": "#000000"
  },
  orange: {
    "10": "#F8EBDB",
    "20": "#EFE1CF",
    "30": "#F9DBAF"
  },
  blue: {
    "50": "#305367"
  },
  green: {
    "10": "#DBF8E3",
    "20": "#B0E2BE",
    "30": "#378282"
  },
  red: {
    "10": "#F8DBDB",
    "20": "#EAC6C6",
    "50": "#FB8383"
  }
};

/**
 * Returns the color according to the given color name and tone.
 *
 * @param colorName grey, orange, blue, green, red
 * @param tone based on the colorName
 */
export function color<T extends ColorName, K extends ToneLevel>(
  colorName: T,
  tone: K
): typeof palette[T][K] {
  return palette[colorName][tone];
}
