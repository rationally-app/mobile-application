import React, { Component, ReactNode } from "react";
import { Sentry } from "../../utils/errorTracking";
import { format } from "date-fns";
import { ErrorBoundaryContent } from "./ErrorBoundaryContent";

type State = {
  hasError: boolean;
  errorMessage?: string;
  operatorToken?: string;
};

export class BoundaryError extends Error {
  constructor(error: Error, operatorToken?: string) {
    super(error.message);
    this.name = error.name;
    if (operatorToken) this.props.operatorToken = operatorToken;
  }
  props = {
    operatorToken: ""
  };
}
export class ErrorBoundary extends Component<unknown, State> {
  state: State = { hasError: false };
  static getDerivedStateFromError(error: BoundaryError): State {
    return {
      hasError: true,
      errorMessage: error.name,
      operatorToken: error.props.operatorToken
    };
  }

  componentDidCatch(error: Error): void {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "ErrorBoundary"
    });
    Sentry.captureException(error);
  }

  render(): ReactNode {
    const error = `(${this.state.errorMessage} ${format(
      Date.now(),
      "h:mma, d MMM yyyy"
    )})`;
    return this.state.hasError ? (
      <ErrorBoundaryContent
        error={this.state.errorMessage ? error : undefined}
        operatorToken={
          this.state.operatorToken ? this.state.operatorToken : undefined
        }
      />
    ) : (
      this.props.children
    );
  }
}
