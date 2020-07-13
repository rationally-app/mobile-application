import { fold } from "fp-ts/lib/Either";
import { Type } from "io-ts";
import { reporter } from "io-ts-reporters";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
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

async function timeout<Response>(ms: number, promise: any): Promise<Response> {
  return new Promise<Response>(async (resolve, reject) => {
    setTimeout(() => {
      reject(new Error("Request timed out. Please try again."));
    }, ms);
    resolve(await promise);
  });
}

export async function fetchWithValidatorWithTimeOut<T, O, I>(
  validator: Type<T, O, I>,
  requestInfo: RequestInfo,
  init?: RequestInit
): Promise<T> {
  const response = await timeout<Response>(5000, fetch(requestInfo, init));
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
