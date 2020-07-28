import { Updates } from "expo";
import { AsyncStorage } from "react-native";
import { Sentry } from "../utils/errorTracking";
import { differenceInMinutes } from "date-fns";
import { useContext, useCallback } from "react";
import { ImportantMessageSetterContext } from "../context/importantMessage";

const LAST_UPDATE_KEY = "LAST_UPDATE";
const CHECK_UPDATE_INTERVAL_MINUTES = 60;

export const useCheckUpdates = (): (() => void) => {
  const setMessageContent = useContext(ImportantMessageSetterContext);

  const checkForUpdates = useCallback(async () => {
    if (__DEV__) {
      return;
    }
    try {
      const lastUpdate = await AsyncStorage.getItem(LAST_UPDATE_KEY);
      if (
        !lastUpdate ||
        differenceInMinutes(new Date(), Number(lastUpdate)) >
          CHECK_UPDATE_INTERVAL_MINUTES
      ) {
        const update = await Updates.checkForUpdateAsync();
        if (update.isAvailable) {
          await Promise.all([
            AsyncStorage.setItem(LAST_UPDATE_KEY, `${new Date().getTime()}`),
            Updates.fetchUpdateAsync()
          ]);

          // Update message only if there's no other important message
          // i.e. token expiry is of higher priority
          setMessageContent(msg =>
            msg
              ? msg
              : {
                  title: "Update available",
                  description:
                    "Simply tap on update to apply the latest updates!",
                  action: {
                    label: "Update",
                    callback: () => Updates.reloadFromCache()
                  },
                  featherIconName: "gift"
                }
          );
        }
      }
    } catch (e) {
      Sentry.addBreadcrumb({
        category: "action",
        message: "Check for updates"
      });
      Sentry.captureException(e);
    }
  }, [setMessageContent]);

  return checkForUpdates;
};
