import { formatCentsAsDollarsAndCents } from "./currencyFormatter";

describe("formatCentsAsDollarsAndCents", () => {
  it("should format amount of single digit cents properly", () => {
    expect.assertions(2);
    expect(formatCentsAsDollarsAndCents(0)).toStrictEqual("0.00");
    expect(formatCentsAsDollarsAndCents(1)).toStrictEqual("0.01");
  });

  it("should format amount of double digit cents properly", () => {
    expect.assertions(2);
    expect(formatCentsAsDollarsAndCents(10)).toStrictEqual("0.10");
    expect(formatCentsAsDollarsAndCents(99)).toStrictEqual("0.99");
  });

  it("should format amount of more than three digit cents properly", () => {
    expect.assertions(4);
    expect(formatCentsAsDollarsAndCents(100)).toStrictEqual("1.00");
    expect(formatCentsAsDollarsAndCents(1001)).toStrictEqual("10.01");
    expect(formatCentsAsDollarsAndCents(9999)).toStrictEqual("99.99");
    expect(formatCentsAsDollarsAndCents(10000)).toStrictEqual("100.00");
  });
});
