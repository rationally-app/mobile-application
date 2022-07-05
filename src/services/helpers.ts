import { fold } from "fp-ts/lib/Either";
import { Type } from "io-ts";
import { reporter } from "io-ts-reporters";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class SessionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SessionError";
  }
}

export class NetworkError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NetworkError";
  }
}

export class ErrorWithCodes extends Error {
  statusCode: number;
  errorCode?: string;

  constructor(message: string, statusCode = 500, errorCode?: string) {
    super(message);
    this.name = "ErrorWithCodes";
    this.statusCode = statusCode;
    this.errorCode = errorCode;
  }
}

const timeoutAfter = (seconds: number): Promise<Error> => {
  return new Promise((resolve, _reject) => {
    setTimeout(() => {
      resolve(new Error(`request timed-out after ${seconds} seconds`));
    }, seconds * 1000);
  });
};

export async function fetchWithValidator<T, O, I>(
  validator: Type<T, O, I>,
  requestInfo: RequestInfo,
  init?: RequestInit,
  includeCodes = false
): Promise<T> {
  let response: Response;
  /*
   * AbortController() is supported globally for Jest with Node v15 and Jest v27 and above.
   * Thus, logic is added to check if AbortController is valid for Jest testing purpose only.
   * TODO: Remove the logic check when node and jest version is compatible.
   */
  try {
    const controller = typeof AbortController
      ? {
          signal: undefined,
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          abort: () => {},
        }
      : new AbortController();
    response = await Promise.race<Response>([
      fetch(requestInfo, { ...init, signal: controller.signal }),
      timeoutAfter(10).then((timeoutError) => {
        controller.abort();
        throw timeoutError;
      }),
    ]);
  } catch (e) {
    throw new NetworkError(e.message);
  }

  const json = await response.json();
  const statusCode = response.status;

  if (!response.ok) {
    const message = json.message ?? "Fetch failed";

    if (json.message === "Invalid authentication token provided") {
      throw new SessionError(json.message);
    }

    if (includeCodes && (json.errorCode || statusCode)) {
      throw new ErrorWithCodes(message, statusCode, json.errorCode);
    }

    throw new Error(message);
  }

  const decoded = validator.decode(json);
  return fold(
    () => {
      throw new ValidationError(reporter(decoded).join(" "));
    },
    (value: T) => value
  )(decoded);
}
