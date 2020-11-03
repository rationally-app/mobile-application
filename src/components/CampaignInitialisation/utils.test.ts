import { checkVersion } from "./utils";
import "../../common/i18n/i18nMock";

describe("checkVersion", () => {
  describe("when binary versions are different", () => {
    it.each([
      ["3.0.0", "2.0.0"],
      ["2.0.10", "2.0.3"],
      ["4.3.0", "4.0.2"]
    ])(
      "should return OK when binary version (%s) is greater than the minimum binary version (%s)",
      (current, minimum) => {
        expect.assertions(1);
        expect(
          checkVersion({
            currentBinaryVersion: current,
            minBinaryVersion: minimum,
            currentBuildVersion: 0,
            minBuildVersion: 0
          })
        ).toBe("OK");
      }
    );

    it.each([
      ["2.0.0", "3.0.0"],
      ["1.0.10", "1.0.12"],
      ["4.0.3", "4.12.0"]
    ])(
      "should return OUTDATED_BINARY when binary version (%s) is less than the minimum binary version (%s)",
      (current, minimum) => {
        expect.assertions(1);

        expect(
          checkVersion({
            currentBinaryVersion: current,
            minBinaryVersion: minimum,
            currentBuildVersion: 0,
            minBuildVersion: 0
          })
        ).toBe("OUTDATED_BINARY");
      }
    );
  });

  describe("when binary versions are the same", () => {
    it("should return OK when binary and build version are the same as the minimum binary and build version", () => {
      expect.assertions(1);
      expect(
        checkVersion({
          currentBinaryVersion: "2.0.0",
          minBinaryVersion: "2.0.0",
          currentBuildVersion: 3,
          minBuildVersion: 3
        })
      ).toBe("OK");
    });

    it.each([
      [3, 2],
      [10, 9],
      [333, 300]
    ])(
      "should return OK when build version (%s) is greater than the minimum build version (%s)",
      (current, minimum) => {
        expect.assertions(1);
        expect(
          checkVersion({
            currentBinaryVersion: "2.0.0",
            minBinaryVersion: "2.0.0",
            currentBuildVersion: current,
            minBuildVersion: minimum
          })
        ).toBe("OK");
      }
    );

    it.each([
      [0, 3],
      [8, 20],
      [200, 290]
    ])(
      "should return OUTDATED_BUILD when build version (%s) is less than the minimum build version (%s)",
      (current, minimum) => {
        expect.assertions(1);
        expect(
          checkVersion({
            currentBinaryVersion: "2.0.0",
            minBinaryVersion: "2.0.0",
            currentBuildVersion: current,
            minBuildVersion: minimum
          })
        ).toBe("OUTDATED_BUILD");
      }
    );
  });

  describe("when the versions are undefined", () => {
    it("should throw an error when min binary version is undefined", () => {
      expect.assertions(1);
      expect(() =>
        checkVersion({
          currentBinaryVersion: "2.0.0",
          minBinaryVersion: undefined,
          currentBuildVersion: 0,
          minBuildVersion: undefined
        })
      ).toThrow("Campaign config not loaded");
    });

    it("should throw an error when min build version is undefined", () => {
      expect.assertions(1);
      expect(() =>
        checkVersion({
          currentBinaryVersion: "3.0.0",
          minBinaryVersion: "3.0.0",
          currentBuildVersion: 0,
          minBuildVersion: undefined
        })
      ).toThrow("Campaign config not loaded");
    });
  });
});
