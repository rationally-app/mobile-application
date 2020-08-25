import { formatDateTime } from "./dateTimeFormatter";

const testDate = new Date(2020, 7, 25, 13, 9, 0);

describe("dateTimeFormatter", () => {
  it("should return the correct datetime format when a date is passed in", () => {
    expect.assertions(1);
    expect(formatDateTime(testDate)).toBe("25 Aug 2020, 1:09PM");
  });
});
