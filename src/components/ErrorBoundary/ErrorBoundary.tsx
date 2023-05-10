import React, { Component, ReactNode } from "react";
import { Sentry } from "../../utils/errorTracking";
import { ErrorBoundaryContent } from "./ErrorBoundaryContent";

type State = { hasError: boolean; errorName?: string };

export class ErrorBoundary extends Component<
  { children?: ReactNode | undefined },
  State
> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, errorName: error.name };
  }

  componentDidCatch(error: Error): void {
    Sentry.addBreadcrumb({
      category: "navigation",
      message: "ErrorBoundary",
    });
    Sentry.captureException(error);
  }

  render(): ReactNode {
    return this.state.hasError ? (
      <ErrorBoundaryContent errorName={this.state.errorName} />
    ) : (
      this.props.children
    );
  }
}
