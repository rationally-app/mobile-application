import { fold } from "fp-ts/lib/Either";
import { Type } from "io-ts";
import { reporter } from "io-ts-reporters";

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

export class ResponseError extends Error {
  code: number;
  constructor(message: string, code: number) {
    super(message);
    this.name = "ResponseError";
    this.code = code;
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
    if (json.code) {
      throw new ResponseError(json.message, json.code);
    } else {
      throw new Error(json.message ?? "Fetch failed");
    }
  }

  const decoded = validator.decode(json);
  return fold(
    () => {
      throw new ValidationError(reporter(decoded).join(" "));
    },
    (value: T) => value
  )(decoded);
}
