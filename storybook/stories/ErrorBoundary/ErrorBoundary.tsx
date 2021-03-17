import React from "react";
import { storiesOf } from "@storybook/react-native";
import { ErrorBoundaryContent } from "../../../src/components/ErrorBoundary/ErrorBoundaryContent";

storiesOf("ErrorBoundary", module).add("ErrorBoundary", () => (
  <ErrorBoundaryContent errorName={`LoginError`} />
));
