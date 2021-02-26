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

export async function fetchWithValidator<T, O, I>(
  validator: Type<T, O, I>,
  requestInfo: RequestInfo,
  init?: RequestInit
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(requestInfo, init);
  } catch (e) {
    throw new NetworkError(e.message);
  }

  const json = await response.json();
  if (!response.ok) {
    if (json.message === "Invalid authentication token provided")
      throw new SessionError(json.message);
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
