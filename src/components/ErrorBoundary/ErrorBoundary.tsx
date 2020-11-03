import React, { Component, ReactNode } from "react";
import { Sentry } from "../../utils/errorTracking";
import { ErrorBoundaryContent } from "./ErrorBoundaryContent";
import { formatDateTime } from "../../utils/dateTimeFormatter";

type State = { hasError: boolean; errorMessage?: string };

export class ErrorBoundary extends Component<unknown, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorMessage: error.name };
  }

  componentDidCatch(error: Error): void {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "ErrorBoundary"
    });
    Sentry.captureException(error);
  }

  render(): ReactNode {
    const error = `(${this.state.errorMessage} ${formatDateTime(Date.now())})`;

    return this.state.hasError ? (
      <ErrorBoundaryContent
        error={this.state.errorMessage ? error : undefined}
      />
    ) : (
      this.props.children
    );
  }
}
