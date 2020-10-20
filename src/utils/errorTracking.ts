import * as SentryExpo from "sentry-expo";

const SENTRY_LOG_PREFIX = "[dev-sentry]";

// This dev mock only implements the 4 currently used Sentry functions
let Sentry: Pick<
  typeof SentryExpo,
  "init" | "setRelease" | "addBreadcrumb" | "captureException"
>;

if (__DEV__) {
  Sentry = {
    init: (): void => console.log(`${SENTRY_LOG_PREFIX} initialised`),
    setRelease: (release: string): void =>
      console.log(`${SENTRY_LOG_PREFIX} setRelease: ${release}`),
    addBreadcrumb: (breadcrumb: unknown): void =>
      console.log(
        `${SENTRY_LOG_PREFIX} addBreadcrumb: ${JSON.stringify(breadcrumb)}`
      ),
    captureException: (e: unknown): string => {
      console.warn(`${SENTRY_LOG_PREFIX} captureException: ${e}`);
      return "eventId";
    },
  };
} else {
  Sentry = SentryExpo;
}

export { Sentry };
