import { differenceInSeconds } from "date-fns";
import { useCallback, useContext } from "react";
import { NavigationDispatch } from "react-navigation";
import { ImportantMessageSetterContext } from "../context/importantMessage";
import { AuthContext } from "../context/auth";
import { useLogout } from "./useLogout";

const ABOUT_TO_EXPIRE_SECONDS = 30 * 60;
const MAX_INTERVAL_SECONDS = 60; // refreshes countdown at most every minute
let timeout: NodeJS.Timeout;

export const useValidateExpiry = (
  navigationDispatch: NavigationDispatch | undefined
): (() => void) => {
  const setMessageContent = useContext(ImportantMessageSetterContext);
  const { expiry } = useContext(AuthContext);
  const { isLoggingOut, logout } = useLogout();

  const onExpired = useCallback(() => {
    logout(navigationDispatch, {
      title: "Session expired",
      description: "You have been logged out"
    });
  }, [logout, navigationDispatch]);

  const onAboutToExpire = useCallback(
    secondsLeft => {
      const duration =
        secondsLeft > 60
          ? `less than ${Math.ceil(secondsLeft / 60)} minutes`
          : `${secondsLeft} second${secondsLeft > 1 ? "s" : ""}`;
      setMessageContent({
        title: `Session ends in ${duration}`,
        description:
          "You will need to login with a new QR code when it expires",
        featherIconName: "clock",
        action: {
          callback: () => logout(navigationDispatch),
          label: "Logout"
        }
      });
    },
    [logout, navigationDispatch, setMessageContent]
  );

  const validate = useCallback(async (): Promise<void> => {
    clearTimeout(timeout);

    if (!expiry || isLoggingOut) {
      return;
    }

    const diffInSeconds = differenceInSeconds(Number(expiry), Date.now());
    if (diffInSeconds <= 0) {
      onExpired();
    } else if (diffInSeconds <= ABOUT_TO_EXPIRE_SECONDS) {
      onAboutToExpire(diffInSeconds);
      let durationInSeconds = MAX_INTERVAL_SECONDS;
      if (diffInSeconds > MAX_INTERVAL_SECONDS) {
        if (diffInSeconds % MAX_INTERVAL_SECONDS > 0) {
          // set timeout to the nearest interval first.
          // e.g. when max interval is 60s, with 2min 20s left,
          // 1st timeout will be after 20s, 2nd timeout will be after another 60s.
          durationInSeconds = diffInSeconds % MAX_INTERVAL_SECONDS;
        }
      } else {
        // countdown once there's less than 1 minute left
        durationInSeconds = 1;
      }
      timeout = setTimeout(() => {
        validate();
      }, durationInSeconds * 1000);
    }
  }, [expiry, isLoggingOut, onAboutToExpire, onExpired]);

  return validate;
};
