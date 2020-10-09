import { formatDate, formatDateTime } from "./dateTimeFormatter";

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
