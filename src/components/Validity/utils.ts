import { CheckStatus } from "./constants";
import { color } from "../../common/styles";

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
        color: color("green", 30),
        backgroundColor: color("green", 20),
        ...overrides?.[CheckStatus.VALID]
      };
    case CheckStatus.INVALID:
      return {
        color: color("red", 30),
        backgroundColor: color("red", 20),
        ...overrides?.[CheckStatus.INVALID]
      };
    case CheckStatus.CHECKING:
    default:
      return {
        color: color("grey", 30),
        backgroundColor: color("yellow", 20),
        ...overrides?.[CheckStatus.CHECKING]
      };
  }
}
