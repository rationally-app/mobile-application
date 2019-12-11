import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import { DocumentListItem } from "./DocumentListItem";

describe("DocumentListItem", () => {
  it("should show the title when is valid", () => {
    expect.assertions(2);
    const { queryByText, queryByTestId } = render(
      <DocumentListItem
        title="My Degree"
        isVerified={true}
        lastVerification={1}
        onPress={(): void => {}}
      />
    );
    expect(queryByText("My Degree")).not.toBeNull();
    expect(queryByTestId("verified-label")).toBeNull();
  });

  it("should show the title and verified label when is invalid", () => {
    expect.assertions(2);
    const { queryByText, queryByTestId } = render(
      <DocumentListItem
        title="My Degree"
        isVerified={false}
        lastVerification={1}
        onPress={(): void => {}}
      />
    );
    expect(queryByText("My Degree")).not.toBeNull();
    expect(queryByTestId("verified-label")).not.toBeNull();
  });

  it("should fire onPress props when pressed", () => {
    expect.assertions(1);
    const onPress = jest.fn();
    const { getByText } = render(
      <DocumentListItem
        title="My Degree"
        isVerified={true}
        lastVerification={1}
        onPress={onPress}
      />
    );
    fireEvent.press(getByText("My Degree"));
    expect(onPress).toHaveBeenCalledTimes(1);
  });
});
