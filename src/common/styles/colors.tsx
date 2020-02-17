export type ColorName =
  | "grey"
  | "yellow"
  | "orange"
  | "blue"
  | "blue-green"
  | "green"
  | "red";
export type ToneLevel = 0 | 10 | 20 | 30 | 40 | 50 | 60 | 100;

const palette: { [color in ColorName]: { [tone: string]: string } } = {
  grey: {
    "0": "#FFFFFF",
    "10": "#F5F7FA",
    "20": "#E4E7EB",
    "30": "#CBD2D9",
    "40": "#9AA5B1",
    "100": "#000000"
  },
  yellow: {
    "10": "#FFFBEA",
    "20": "#FFF3C4",
    "50": "#CB6E17"
  },
  orange: {
    "30": "#F9DBAF"
  },
  blue: {
    "50": "#305367"
  },
  "blue-green": {
    "40": "#378282"
  },
  green: {
    "10": "#E3F9E5",
    "20": "#C8F4CD",
    "30": "#51CA58",
    "40": "#0F8613"
  },
  red: {
    "10": "#FFE3E3",
    "20": "#FFD1D1",
    "30": "#FB8383",
    "40": "#F94343"
  }
};

export function color(
  colorName: "grey",
  tone: 0 | 10 | 20 | 30 | 40 | 100
): string;
export function color(colorName: "green", tone: 10 | 20 | 30 | 40): string;
export function color(colorName: "red", tone: 10 | 20 | 30 | 40): string;
export function color(colorName: "yellow", tone: 10 | 20 | 50): string;
export function color(colorName: "orange", tone: 30): string;
export function color(colorName: "blue", tone: 50): string;
export function color(colorName: "blue-green", tone: 40): string;
/**
 * Returns the color according to the given color name and tone.
 *
 * @param colorName grey, orange, blue, green, red
 * @param tone based on the colorName
 */
export function color(colorName: ColorName, tone: ToneLevel): string {
  return palette[colorName][tone];
}
