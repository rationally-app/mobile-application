import { differenceInSeconds } from "date-fns";
import { useCallback, useContext } from "react";
import { NavigationDispatch } from "react-navigation";
import { ImportantMessageSetterContext } from "../context/importantMessage";
import { useAuthenticationContext } from "../context/auth";
import { useLogout } from "./useLogout";

const ABOUT_TO_EXPIRE_SECONDS = 30 * 60;
const MAX_INTERVAL_SECONDS = 60; // refreshes countdown at most every minute
let timeout = 0;

export const useValidateExpiry = (
  navigationDispatch: NavigationDispatch | undefined
): (() => void) => {
  const setMessageContent = useContext(ImportantMessageSetterContext);
  const { expiry } = useAuthenticationContext();
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
          callback: () => logout(),
          label: "Logout"
        }
      });
    },
    [logout, setMessageContent]
  );

  const validate = useCallback(async (): Promise<void> => {
    clearTimeout(timeout);

    if (expiry === "" || isLoggingOut) {
      return;
    }
    const diffInSeconds = Math.max(
      0,
      differenceInSeconds(Number(expiry), Date.now())
    );
    if (diffInSeconds === 0) {
      onExpired();
    } else if (diffInSeconds <= ABOUT_TO_EXPIRE_SECONDS) {
      onAboutToExpire(diffInSeconds);
      let durationInSeconds = MAX_INTERVAL_SECONDS;
      if (diffInSeconds > MAX_INTERVAL_SECONDS) {
        if (diffInSeconds % MAX_INTERVAL_SECONDS > 0) {
          durationInSeconds = diffInSeconds % MAX_INTERVAL_SECONDS;
        }
      } else {
        durationInSeconds = 1;
      }
      timeout = setTimeout(() => {
        validate();
      }, durationInSeconds * 1000);
    }
  }, [expiry, isLoggingOut, onAboutToExpire, onExpired]);

  return validate;
};
