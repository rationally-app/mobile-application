import { formatCentsAsDollarsAndCents } from "./currencyFormatter";

describe("formatCentsAsDollarsAndCents", () => {
  it("should format amount of single digit cents properly", () => {
    expect.assertions(2);
    expect(formatCentsAsDollarsAndCents(0)).toBe("0.00");
    expect(formatCentsAsDollarsAndCents(1)).toBe("0.01");
  });

  it("should format amount of double digit cents properly", () => {
    expect.assertions(2);
    expect(formatCentsAsDollarsAndCents(10)).toBe("0.10");
    expect(formatCentsAsDollarsAndCents(99)).toBe("0.99");
  });

  it("should format amount of more than three digit cents properly", () => {
    expect.assertions(4);
    expect(formatCentsAsDollarsAndCents(100)).toBe("1.00");
    expect(formatCentsAsDollarsAndCents(1001)).toBe("10.01");
    expect(formatCentsAsDollarsAndCents(9999)).toBe("99.99");
    expect(formatCentsAsDollarsAndCents(10000)).toBe("100.00");
  });
});
