import React from "react";
import { render } from "@testing-library/react-native";
import { VerifiedLabel } from "./VerifiedLabel";

describe("VerifiedLabel", () => {
  it("should show Verified when isVerified is true", async () => {
    expect.assertions(1);
    const { queryByText } = render(
      <VerifiedLabel isVerified={true} lastVerification={1} />
    );
    expect(queryByText("Verified")).not.toBeNull();
  });

  it("should show Invalid when isVerified is false and lastVerification is set", async () => {
    expect.assertions(1);
    const { queryByText } = render(
      <VerifiedLabel isVerified={false} lastVerification={1} />
    );
    expect(queryByText("Invalid")).not.toBeNull();
  });

  it("should show Unknown when isVerified is false and lastVerification is falsey", async () => {
    expect.assertions(1);
    const { queryByText } = render(<VerifiedLabel isVerified={false} />);
    expect(queryByText("Unknown")).not.toBeNull();
  });
});
