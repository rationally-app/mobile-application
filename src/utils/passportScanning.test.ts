import { extractPassportIdFromEvent } from "./passportScanning";

describe("passportScanning", () => {
  let event: any;

  describe("extractPassportIdFromEvent", () => {
    it("should return passportID if data is a valid JSON, and contains passportId", () => {
      event = {
        data: JSON.stringify({
          passportId: "ABC-12345",
        }),
      };

      expect(extractPassportIdFromEvent(event)).toStrictEqual("ABC-12345");
    });

    it("should return empty string if data is a valid JSON, but does not contain passportId", () => {
      event = {
        data: JSON.stringify({}),
      };

      expect(extractPassportIdFromEvent(event)).toStrictEqual("");

      event = {
        data: JSON.stringify({
          passportId: null,
        }),
      };

      expect(extractPassportIdFromEvent(event)).toStrictEqual("");

      event = {
        data: JSON.stringify({
          passportId: true,
        }),
      };

      expect(extractPassportIdFromEvent(event)).toStrictEqual("");

      event = {
        data: JSON.stringify({
          passportId: 123456,
        }),
      };

      expect(extractPassportIdFromEvent(event)).toStrictEqual("");

      event = {
        data: JSON.stringify({
          passportId: [],
        }),
      };

      expect(extractPassportIdFromEvent(event)).toStrictEqual("");

      event = {
        data: JSON.stringify({
          passportId: {},
        }),
      };

      expect(extractPassportIdFromEvent(event)).toStrictEqual("");

      event = {
        data: JSON.stringify({
          passportId: undefined,
        }),
      };

      expect(extractPassportIdFromEvent(event)).toStrictEqual("");
    });

    it("should return empty string if data is an invalid JSON string", () => {
      event = {
        data: JSON.stringify(null),
      };

      expect(extractPassportIdFromEvent(event)).toStrictEqual("");

      event = {
        data: JSON.stringify(true),
      };

      expect(extractPassportIdFromEvent(event)).toStrictEqual("");

      event = {
        data: JSON.stringify(123456),
      };

      expect(extractPassportIdFromEvent(event)).toStrictEqual("");

      event = {
        data: JSON.stringify("123456"),
      };

      expect(extractPassportIdFromEvent(event)).toStrictEqual("");

      event = {
        data: JSON.stringify([]),
      };

      expect(extractPassportIdFromEvent(event)).toStrictEqual("");

      event = {
        data: JSON.stringify(undefined),
      };

      expect(extractPassportIdFromEvent(event)).toStrictEqual("");
    });
  });
});
