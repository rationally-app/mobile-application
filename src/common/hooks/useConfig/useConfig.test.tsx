import { renderHook, act } from "@testing-library/react-hooks";
import { useConfig } from "./index";
import { AsyncStorage } from "react-native";
import { NetworkTypes } from "../../../types";

jest.mock("react-native", () => ({
  AsyncStorage: {
    setItem: jest.fn(),
    getItem: jest.fn()
  }
}));

const mockGetItem = AsyncStorage.getItem as jest.Mock;
const mockSetItem = AsyncStorage.setItem as jest.Mock;

describe("useConfig", () => {
  beforeEach(() => {
    mockGetItem.mockReset();
    mockSetItem.mockReset();
    mockGetItem.mockResolvedValue(JSON.stringify({ network: "mainnet" }));
  });
  it("should load saved config automatically", async () => {
    expect.assertions(2);
    const { result, waitForNextUpdate } = renderHook(() => useConfig());
    await waitForNextUpdate();
    expect(result.current.loaded).toBe(true);
    expect(result.current.config).toStrictEqual({ network: "mainnet" });
  });
  it("should persist updated config", async () => {
    expect.assertions(2);
    const { result, waitForNextUpdate } = renderHook(() => useConfig());
    await waitForNextUpdate();
    act(() => {
      result.current.setValue("network", NetworkTypes.ropsten);
    });
    expect(result.current.config).toStrictEqual({ network: "ropsten" });
    expect(mockSetItem).toHaveBeenCalledWith(
      "CONFIG",
      JSON.stringify({ network: "ropsten" })
    );
  });
});
