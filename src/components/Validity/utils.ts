import {
  GREEN_30,
  GREEN_20,
  RED_30,
  RED_20,
  YELLOW_20,
  DARK
} from "../../common/colors";
import { CheckStatus } from "./constants";

type StatusProps<T extends {}> = T & {
  color: string;
  backgroundColor: string;
};

type OverrideStatusProps<T extends {}> = { [status in CheckStatus]: T };

/**
 * Returns the status props for the given checkStatus.
 *
 * @param checkStatus CheckStatus
 */
export function getStatusProps(checkStatus: CheckStatus): StatusProps<{}>;

/**
 * Returns the status props for the given checkStatus.
 * The overrides allows for
 * 1. additional props or
 * 2. overriding the default status props for the corresponding checkStatus.
 *
 * @param checkStatus CheckStatus
 * @param overrides Object with CheckStatus as keys and overriding props as values
 */
export function getStatusProps<T extends {}>(
  checkStatus: CheckStatus,
  overrides: OverrideStatusProps<T>
): StatusProps<T>;
export function getStatusProps<T extends {}>(
  checkStatus: CheckStatus,
  overrides?: OverrideStatusProps<T>
): StatusProps<T | {}> {
  switch (checkStatus) {
    case CheckStatus.VALID:
      return {
        color: GREEN_30,
        backgroundColor: GREEN_20,
        ...overrides?.[CheckStatus.VALID]
      };
    case CheckStatus.INVALID:
      return {
        color: RED_30,
        backgroundColor: RED_20,
        ...overrides?.[CheckStatus.INVALID]
      };
    case CheckStatus.CHECKING:
    default:
      return {
        color: DARK,
        backgroundColor: YELLOW_20,
        ...overrides?.[CheckStatus.CHECKING]
      };
  }
}
