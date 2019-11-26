import { validateDocumentAction } from "./documentActionValidator";

describe("validateDocumentAction", () => {
  it("should not throw for valid uri", () => {
    expect.assertions(1);
    const input = {
      uri: "https://test.com/doc/123"
    };
    expect(() => validateDocumentAction(input)).not.toThrow();
  });

  it("should fail for invalid uri", () => {
    expect.assertions(1);
    const input = {
      uri: "foo"
    };
    expect(() => validateDocumentAction(input)).toThrow(
      "uri must be a valid URL"
    );
  });

  it("should fail for absent uri", () => {
    expect.assertions(1);
    const input = {};
    expect(() => validateDocumentAction(input)).toThrow(
      "uri is a required field"
    );
  });

  it("should not throw for valid permittedActions", () => {
    expect.assertions(1);
    const input = {
      uri: "https://test.com/doc/123",
      permittedActions: ["VIEW"]
    };
    expect(() => validateDocumentAction(input)).not.toThrow();
  });

  it("should throw for invalid permittedActions", () => {
    expect.assertions(1);
    const input = {
      uri: "https://test.com/doc/123",
      permittedActions: ["QUERY"]
    };
    expect(() => validateDocumentAction(input)).toThrow("must match");
  });

  it("should not throw for redirects", () => {
    expect.assertions(1);
    const input = {
      uri: "https://test.com/doc/123",
      redirect: "https://tradetrust.io"
    };
    expect(() => validateDocumentAction(input)).not.toThrow();
  });

  it("should fail for payload with unknown keys", () => {
    expect.assertions(1);
    const input = {
      uri: "https://test.com/id/123",
      foo: "bar"
    };
    expect(() => validateDocumentAction(input)).toThrow(
      "cannot have keys not specified in the object shape"
    );
  });

  it("should return the validated payload", () => {
    expect.assertions(1);
    const input = {
      uri: "https://test.com/doc/123",
      key: "somepassword",
      permittedActions: ["STORE"],
      redirect: "https://tradetrust.io"
    };
    expect(validateDocumentAction(input)).toStrictEqual({
      uri: "https://test.com/doc/123",
      key: "somepassword",
      permittedActions: ["STORE"],
      redirect: "https://tradetrust.io"
    });
  });
});
