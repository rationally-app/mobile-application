import { color } from "./colors";

export type ElevationLevel = 1 | 2 | 3 | 4;
export interface ShadowProps {
  shadowColor: string;
  shadowOffset: {
    width: number;
    height: number;
  };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

/**
 * Returns shadow props for the given elevation level
 *
 * @param elevationLevel 1 (4), 2 (8), 3 (16), 4 (20)
 * @param shadowColor defaults to black
 */
export const shadow = (
  elevationLevel: ElevationLevel,
  shadowColor = color("grey", 90)
): ShadowProps => {
  switch (elevationLevel) {
    case 1:
      return {
        shadowColor,
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.13,
        shadowRadius: 2.62,
        elevation: 4,
      };
    case 2:
      return {
        shadowColor,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.2,
        shadowRadius: 4.65,
        elevation: 8,
      };
    case 3:
      return {
        shadowColor,
        shadowOffset: {
          width: 0,
          height: 8,
        },
        shadowOpacity: 0.34,
        shadowRadius: 10.32,
        elevation: 16,
      };
    case 4:
      return {
        shadowColor,
        shadowOffset: {
          width: 0,
          height: 10,
        },
        shadowOpacity: 0.41,
        shadowRadius: 13.16,
        elevation: 20,
      };
  }
};
