import React from "react";
import { render } from "@testing-library/react-native";
import { QrCode } from "./index";

describe("QrCode", () => {
  it("should not display anything if both qrCode and qrCodeLoading is false", () => {
    expect.assertions(1);
    const { container } = render(<QrCode />);
    expect(container.children).toHaveLength(0);
  });

  it("should render qrCode when available", () => {
    expect.assertions(1);
    const { queryByTestId } = render(<QrCode qrCode="TEST" />);
    expect(queryByTestId("qr-code")).not.toBeNull();
  });

  it("should render loading when qrCodeLoading is true", () => {
    expect.assertions(1);
    const { queryByTestId } = render(<QrCode qrCodeLoading={true} />);
    expect(queryByTestId("qr-code-loading")).not.toBeNull();
  });
});
