import { IdentifierInput } from "../types";
import { getIdentifierInputDisplay } from "./getIdentifierInputDisplay";

describe("getIdentifierInputDisplay", () => {
  it("should return single identifier value if only 1 identifier input", () => {
    expect.assertions(1);
    const mockIdentifierInput: IdentifierInput = {
      label: "label",
      value: "value",
    };
    expect(getIdentifierInputDisplay([mockIdentifierInput])).toBe(
      mockIdentifierInput.value
    );
  });

  it("should return range display if >1 identifier inputs", () => {
    expect.assertions(1);
    const mockIdentifierInputs: IdentifierInput[] = [
      {
        label: "label1",
        value: "value1",
      },
      {
        label: "label2",
        value: "value2",
      },
      {
        label: "label3",
        value: "value3",
      },
    ];
    expect(getIdentifierInputDisplay(mockIdentifierInputs)).toBe(
      "value1\nvalue2\nvalue3"
    );
  });

  it("should return empty string if identifierInputs is empty", () => {
    expect.assertions(1);
    expect(getIdentifierInputDisplay([])).toBe("");
  });

  it("should not return empty identifier values", () => {
    expect.assertions(3);
    const mockIdentifierInputs: IdentifierInput[] = [
      {
        label: "label1",
        value: "",
      },
      {
        label: "label2",
        value: "",
      },
      {
        label: "label3",
        value: "",
      },
    ];

    expect(getIdentifierInputDisplay(mockIdentifierInputs)).toBe("");

    expect(
      getIdentifierInputDisplay([
        ...mockIdentifierInputs,
        { label: "label4", value: "value4" },
      ])
    ).toBe("value4");

    expect(
      getIdentifierInputDisplay([
        ...mockIdentifierInputs,
        { label: "label4", value: "value4" },
        { label: "label5", value: "value5" },
        { label: "label6", value: "" },
      ])
    ).toBe("value4\nvalue5");
  });
});
