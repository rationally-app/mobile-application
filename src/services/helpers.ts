import { fold } from "fp-ts/lib/Either";
import { Type } from "io-ts";
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

export async function fetchWithValidator<T, O, I>(
  validator: Type<T, O, I>,
  requestInfo: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const response = await fetch(requestInfo, init);

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

async function timeout<T>(
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

export async function fetchWithValidatorWithTimeOut<T, O, I>(
  validator: Type<T, O, I>,
  requestInfo: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const response = await timeout<Response>(
    process.env.API_CALL_TIMEOUT,
    fetch(requestInfo, init),
    "Request timed out. Please check your internet connection and try again later."
  );
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
