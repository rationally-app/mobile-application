import { extractPassportIdFromEvent } from "./passportScanning";

describe("passportScanning", () => {
  let event: any;

  describe("extractPassportIdFromEvent", () => {
    describe("cases with valid event data", () => {
      it("should return passportID", () => {
        expect.assertions(1);

        event = {
          data: JSON.stringify({
            passportId: "ABC-12345",
          }),
        };

        expect(extractPassportIdFromEvent(event)).toBe("ABC-12345");
      });
    });

    describe("cases with invalid event data", () => {
      describe("cases with passportId of invalid types", () => {
        it("should return empty string if passportId is null", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify({
              passportId: null,
            }),
          };

          expect(extractPassportIdFromEvent(event)).toBe("");
        });

        it("should return empty string if passportId is a boolean", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify({
              passportId: true,
            }),
          };

          expect(extractPassportIdFromEvent(event)).toBe("");
        });

        it("should return empty string if passportId is a number", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify({
              passportId: 123456789,
            }),
          };

          expect(extractPassportIdFromEvent(event)).toBe("");
        });

        it("should return empty string if passportId is an array", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify({
              passportId: [],
            }),
          };

          expect(extractPassportIdFromEvent(event)).toBe("");
        });

        it("should return empty string if passportId is an empty object", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify({
              passportId: {},
            }),
          };

          expect(extractPassportIdFromEvent(event)).toBe("");
        });

        it("should return empty string if passportId is a non-empty object", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify({
              passportId: {
                value: "ABC-12345",
              },
            }),
          };

          expect(extractPassportIdFromEvent(event)).toBe("");
        });

        it("should return empty string if passportId is undefined", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify({
              passportId: undefined,
            }),
          };

          expect(extractPassportIdFromEvent(event)).toBe("");
        });
      });

      describe("cases without passportId", () => {
        it("should return empty string if data is null", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify(null),
          };

          expect(extractPassportIdFromEvent(event)).toBe("");
        });

        it("should return empty string if data is an empty object", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify({}),
          };

          expect(extractPassportIdFromEvent(event)).toBe("");
        });

        it("should return empty string if data is an object without 'passportId' property", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify({
              property: "value",
            }),
          };

          expect(extractPassportIdFromEvent(event)).toBe("");
        });

        it("should return empty string if data is a string", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify("123"),
          };

          expect(extractPassportIdFromEvent(event)).toBe("");
        });

        it("should return empty string if data is a boolean", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify(true),
          };

          expect(extractPassportIdFromEvent(event)).toBe("");
        });

        it("should return empty string if data is number", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify(123456789),
          };

          expect(extractPassportIdFromEvent(event)).toBe("");
        });

        it("should return empty string if data is array", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify([]),
          };

          expect(extractPassportIdFromEvent(event)).toBe("");
        });

        it("should return empty string if data is undefined", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify(undefined),
          };

          expect(extractPassportIdFromEvent(event)).toBe("");
        });
      });
    });
  });
});
