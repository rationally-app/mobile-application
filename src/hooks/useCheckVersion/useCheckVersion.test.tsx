import React, { FunctionComponent } from "react";
import { renderHook } from "@testing-library/react-hooks";
import { CampaignConfigContext } from "../../context/campaignConfig";
import { useCheckVersion } from "./useCheckVersion";
import * as config from "../../config";

jest.mock("../../config", () => ({
  get APP_BINARY_VERSION() {
    return "1.0.0";
  },
  get APP_BUILD_VERSION() {
    return 0;
  }
}));

const wrapper = (
  minAppBinaryVersion: string,
  minAppBuildVersion: number
): FunctionComponent => ({ children }) => (
  <CampaignConfigContext.Provider
    value={{
      features: {
        minAppBinaryVersion: minAppBinaryVersion,
        minAppBuildVersion: minAppBuildVersion
      },
      setCampaignConfig: () => null,
      clearCampaignConfig: () => null,
      configHashes: {}
    }}
  >
    {children}
  </CampaignConfigContext.Provider>
);

describe("useCheckVersion", () => {
  let appBinaryVersionSpy: jest.SpyInstance;
  let appBuildVersionSpy: jest.SpyInstance;

  beforeAll(() => {
    appBinaryVersionSpy = jest.spyOn(config, "APP_BINARY_VERSION", "get");
    appBuildVersionSpy = jest.spyOn(config, "APP_BUILD_VERSION", "get");
  });

  describe("when binary versions are different", () => {
    it.each([
      ["3.0.0", "2.0.0"],
      ["2.0.10", "2.0.3"],
      ["4.3.0", "4.0.2"]
    ])(
      "should return OK when binary version (%s) is greater than the minimum binary version (%s)",
      (current, minimum) => {
        expect.assertions(1);

        appBinaryVersionSpy.mockReturnValueOnce(current);
        const { result } = renderHook(() => useCheckVersion(), {
          wrapper: wrapper(minimum, 0)
        });
        expect(result.current()).toBe("OK");
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

        appBinaryVersionSpy.mockReturnValueOnce(current);
        const { result } = renderHook(() => useCheckVersion(), {
          wrapper: wrapper(minimum, 0)
        });
        expect(result.current()).toBe("OUTDATED_BINARY");
      }
    );
  });

  describe("when binary versions are the same", () => {
    let fixedBinaryVersion: string;

    beforeAll(() => {
      fixedBinaryVersion = "2.0.0";
    });

    beforeEach(() => {
      appBinaryVersionSpy.mockReturnValueOnce(fixedBinaryVersion);
    });

    it("should return OK when binary and build version are the same as the minimum binary and build version", () => {
      expect.assertions(1);

      appBuildVersionSpy.mockReturnValueOnce(2);
      const { result } = renderHook(() => useCheckVersion(), {
        wrapper: wrapper(fixedBinaryVersion, 2)
      });
      expect(result.current()).toBe("OK");
    });

    it.each([
      [3, 2],
      [10, 9],
      [333, 300]
    ])(
      "should return OK when build version (%s) is greater than the minimum build version (%s)",
      (current, minimum) => {
        expect.assertions(1);

        appBuildVersionSpy.mockReturnValueOnce(current);
        const { result } = renderHook(() => useCheckVersion(), {
          wrapper: wrapper(fixedBinaryVersion, minimum)
        });
        expect(result.current()).toBe("OK");
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

        appBuildVersionSpy.mockReturnValueOnce(current);
        const { result } = renderHook(() => useCheckVersion(), {
          wrapper: wrapper(fixedBinaryVersion, minimum)
        });
        expect(result.current()).toBe("OUTDATED_BUILD");
      }
    );
  });
  describe("when the versions are undefined", () => {
    it("should throw an error when app binary version is undefined", () => {
      expect.assertions(1);

      appBinaryVersionSpy.mockReturnValueOnce(undefined);
      const { result } = renderHook(() => useCheckVersion(), {
        wrapper: wrapper("1.0.0", 0)
      });
      expect(() => result.current()).toThrow(
        "Current app version is not configured properly"
      );
    });

    it("should throw an error when app build version is undefined", () => {
      expect.assertions(1);

      appBuildVersionSpy.mockReturnValueOnce(undefined);
      const { result } = renderHook(() => useCheckVersion(), {
        wrapper: wrapper("1.0.0", 0)
      });
      expect(() => result.current()).toThrow(
        "Current build version is not configured properly"
      );
    });

    it("should throw an error when min binary version is undefined", () => {
      expect.assertions(1);

      const { result } = renderHook(() => useCheckVersion(), {
        wrapper: wrapper(undefined as any, 0)
      });
      expect(() => result.current()).toThrow("Campaign config not loaded");
    });

    it("should throw an error when min build version is undefined", () => {
      expect.assertions(1);

      const { result } = renderHook(() => useCheckVersion(), {
        wrapper: wrapper("1.0.0", undefined as any)
      });
      expect(() => result.current()).toThrow("Campaign config not loaded");
    });
  });
});
