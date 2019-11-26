import { validateAction, ActionType } from "./validator";

describe("validateAction", () => {
  it("should validate document action", () => {
    expect.assertions(1);
    const input = {
      uri: "https://test.com/doc/123",
      key: "someverylongkey",
      permittedActions: ["VIEW"],
      redirect: "https://tradetrust.io/"
    };
    expect(() => validateAction(ActionType.DOCUMENT, input)).not.toThrow();
  });

  it("should throw on invalid document action", () => {
    expect.assertions(1);
    const input = {
      key: "someverylongkey",
      permittedActions: ["VIEW"],
      redirect: "https://tradetrust.io/"
    };
    expect(() => validateAction(ActionType.DOCUMENT, input)).toThrow(
      "uri is a required field"
    );
  });

  it("should return validated input", () => {
    expect.assertions(1);
    const input = {
      uri: "https://test.com/doc/123",
      key: "someverylongkey",
      permittedActions: ["VIEW"],
      redirect: "https://tradetrust.io/"
    };
    expect(validateAction(ActionType.DOCUMENT, input)).toStrictEqual({
      uri: "https://test.com/doc/123",
      key: "someverylongkey",
      permittedActions: ["VIEW"],
      redirect: "https://tradetrust.io/"
    });
  });
});
