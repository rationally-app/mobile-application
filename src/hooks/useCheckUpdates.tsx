import { Updates } from "expo";
import { AsyncStorage } from "react-native";
import * as Sentry from "sentry-expo";
import { differenceInMinutes } from "date-fns";
import { useContext, useCallback } from "react";
import { ImportantMessageSetterContext } from "../context/importantMessage";

const LAST_UPDATE_KEY = "LAST_UPDATE";
const CHECK_UPDATE_INTERVAL_MINUTES = 60;

type CheckUpdatesResult =
  | "TOO_RECENT_CHECK"
  | "NO_UPDATE"
  | "UPDATE_READY"
  | "UPDATE_ERROR";

export const useCheckUpdates = (): ((
  forceCheck: boolean
) => Promise<CheckUpdatesResult>) => {
  const setMessageContent = useContext(ImportantMessageSetterContext);

  const checkForUpdates = useCallback(
    async (forceCheck = false) => {
      if (__DEV__) {
        await new Promise(res => setTimeout(res, 2000));
        return "NO_UPDATE";
      }
      try {
        const lastUpdate = await AsyncStorage.getItem(LAST_UPDATE_KEY);
        if (
          forceCheck ||
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
            return "UPDATE_READY";
          } else {
            return "NO_UPDATE";
          }
        } else {
          return "TOO_RECENT_CHECK";
        }
      } catch (e) {
        Sentry.addBreadcrumb({
          category: "action",
          message: "Check for updates"
        });
        Sentry.captureException(e);
        return "UPDATE_ERROR";
      }
    },
    [setMessageContent]
  );

  return checkForUpdates;
};
