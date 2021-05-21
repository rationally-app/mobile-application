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

        expect(extractPassportIdFromEvent(event)).toStrictEqual("ABC-12345");
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

          expect(extractPassportIdFromEvent(event)).toStrictEqual("");
        });

        it("should return empty string if passportId is boolean", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify({
              passportId: true,
            }),
          };

          expect(extractPassportIdFromEvent(event)).toStrictEqual("");
        });

        it("should return empty string if passportId is number", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify({
              passportId: 123456789,
            }),
          };

          expect(extractPassportIdFromEvent(event)).toStrictEqual("");
        });

        it("should return empty string if passportId is array", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify({
              passportId: [],
            }),
          };

          expect(extractPassportIdFromEvent(event)).toStrictEqual("");
        });

        it("should return empty string if passportId is object", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify({
              passportId: {},
            }),
          };

          expect(extractPassportIdFromEvent(event)).toStrictEqual("");
        });

        it("should return empty string if passportId is undefined", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify({
              passportId: undefined,
            }),
          };

          expect(extractPassportIdFromEvent(event)).toStrictEqual("");
        });
      });

      describe("cases without passportId", () => {
        it("should return empty string if it does not contain passportId", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify({}),
          };

          expect(extractPassportIdFromEvent(event)).toStrictEqual("");
        });
        it("should return empty string if data is boolean", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify(true),
          };

          expect(extractPassportIdFromEvent(event)).toStrictEqual("");
        });

        it("should return empty string if data is number", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify(123456789),
          };

          expect(extractPassportIdFromEvent(event)).toStrictEqual("");
        });

        it("should return empty string if data is array", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify([]),
          };

          expect(extractPassportIdFromEvent(event)).toStrictEqual("");
        });

        it("should return empty string if data is undefined", () => {
          expect.assertions(1);
          event = {
            data: JSON.stringify(undefined),
          };

          expect(extractPassportIdFromEvent(event)).toStrictEqual("");
        });
      });
    });
  });
});
