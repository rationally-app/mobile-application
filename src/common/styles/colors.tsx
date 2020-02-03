export type ColorName = "grey" | "orange" | "blue" | "green" | "red";
export type ToneLevel = 0 | 5 | 10 | 15 | 20 | 30 | 40 | 50 | 100;

const palette: { [color in ColorName]: { [tone: string]: string } } = {
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

export function color(
  colorName: "grey",
  tone: 0 | 5 | 10 | 15 | 20 | 30 | 40 | 100
): string;
export function color(colorName: "orange", tone: 10 | 20 | 30): string;
export function color(colorName: "green", tone: 10 | 20 | 30): string;
export function color(colorName: "red", tone: 10 | 20 | 50): string;
export function color(colorName: "blue", tone: 50): string;
/**
 * Returns the color according to the given color name and tone.
 *
 * @param colorName grey, orange, blue, green, red
 * @param tone based on the colorName
 */
export function color(colorName: ColorName, tone: ToneLevel): string {
  return palette[colorName][tone];
}
