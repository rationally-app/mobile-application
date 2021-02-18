class ErrorWithCode extends Error {
  constructor(message?: string) {
    const trueProto = new.target.prototype;
    super(message);
    this.name = "ErrorWithCode";
    Object.setPrototypeOf(this, trueProto); // https://stackoverflow.com/a/60250733
  }

  public get code(): string {
    // Code for logging, converts error name to TRAIN_CASE
    // e.g. ErrorWithCode -> ERROR_WITH_CODE
    return this.name.replace(/([a-z0-9])([A-Z])/g, "$1_$2").toUpperCase();
  }
}

class PhoneNumberTooShortError extends ErrorWithCode {
  constructor(message?: string) {
    super(message);
    this.name = "PhoneNumberTooShortError";
  }
}

class PhoneNumberTooLongError extends ErrorWithCode {
  constructor(message?: string) {
    super(message);
    this.name = "PhoneNumberTooLongError";
  }
}

class CountryCodeInvalidError extends ErrorWithCode {
  constructor(message?: string) {
    super(message);
    this.name = "CountryCodeInvalidError";
  }
}

class PhoneNumberUnrecognisedError extends ErrorWithCode {
  constructor(message?: string) {
    super(message);
    this.name = "PhoneNumberUnrecognisedError";
  }
}

class PhoneNumberInvalidForRegionError extends ErrorWithCode {
  constructor(message?: string) {
    super(message);
    this.name = "PhoneNumberInvalidForRegionError";
  }
}

export default {
  PhoneNumberTooShortError,
  PhoneNumberTooLongError,
  CountryCodeInvalidError,
  PhoneNumberUnrecognisedError,
  PhoneNumberInvalidForRegionError,
};
