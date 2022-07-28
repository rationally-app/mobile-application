import {
  formatDate,
  formatDateTime,
  formatGovWalletDateToSallyDateFormat,
} from "./dateTimeFormatter";

const testDate = new Date(2020, 7, 25, 13, 9, 0);

describe("formatDateTime", () => {
  it("should return the correct datetime format when a date is passed in", () => {
    expect.assertions(1);
    expect(formatDateTime(testDate)).toBe("25 Aug 2020, 1:09PM");
  });
});

describe("formatDate", () => {
  it("should return the correct date format when a date is passed in", () => {
    expect.assertions(1);
    expect(formatDate(testDate)).toBe("25 Aug 2020");
  });
});

describe("formatGovWalletDateTimeToSallyTimestamp", () => {
  it("should return the correct date format", () => {
    expect.assertions(5);
    expect(
      formatGovWalletDateToSallyDateFormat("2022-07-25T11:57:50.000+08:00")
    ).toBe("25 Jul 2022, 11:57AM");
    expect(
      formatGovWalletDateToSallyDateFormat("2024-02-29T00:00:00.000+08:00")
    ).toBe("29 Feb 2024, 12:00AM");
    expect(
      formatGovWalletDateToSallyDateFormat("2024-02-29T12:00:00.000+08:00")
    ).toBe("29 Feb 2024, 12:00PM");
    expect(
      formatGovWalletDateToSallyDateFormat("2024-02-29T23:59:59.000+08:00")
    ).toBe("29 Feb 2024, 11:59PM");
    expect(
      formatGovWalletDateToSallyDateFormat("2024-02-29T23:59:59.000+00:00")
    ).toBe("1 Mar 2024, 7:59AM");
  });
});
