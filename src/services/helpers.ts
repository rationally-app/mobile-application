import { fold } from "fp-ts/lib/Either";
import { Type, number } from "io-ts";
import { reporter } from "io-ts-reporters";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class TimeoutError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TimeoutError";
  }
}

async function processTimeout<T>(
  ms: number,
  promise: Promise<T>,
  errorMessage?: string
): Promise<T> {
  return new Promise<T>(async (resolve, reject) => {
    setTimeout(() => {
      reject(new TimeoutError(errorMessage || "Request timed out"));
    }, ms);
    resolve(await promise);
  });
}

export async function fetchWithValidator<T, O, I>(
  validator: Type<T, O, I>,
  requestInfo: RequestInfo,
  init?: RequestInit,
  timeout: boolean | number = false
): Promise<T> {
  let response;
  if (timeout) {
    const timeoutVal =
      typeof timeout === "number" ? timeout : process.env.API_CALL_TIMEOUT;
    response = await processTimeout<Response>(
      timeoutVal,
      fetch(requestInfo, init),
      "Request timed out. Please check your internet connection and try again later."
    );
  } else {
    response = await fetch(requestInfo, init);
  }

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? "Fetch failed");
  }

  const decoded = validator.decode(json);
  return fold(
    () => {
      throw new ValidationError(reporter(decoded).join(" "));
    },
    (value: T) => value
  )(decoded);
}
