// Keeps one broken screen from taking down the whole prototype during a session.
import React from "react";

interface State {
  error: Error | null;
}

export class ScreenErrorBoundary extends React.Component<{ children: React.ReactNode; screen: string }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidUpdate(prev: { screen: string }) {
    if (prev.screen !== this.props.screen && this.state.error) {
      this.setState({ error: null });
    }
  }

  render() {
    if (this.state.error) {
      return (
        <div className="proto-notwired">
          <h2>This screen did not load</h2>
          <p>Move to another step and come back, or press Reset.</p>
          <p style={{ fontSize: 12, marginTop: 14, color: "#8c96b4" }}>{String(this.state.error.message).slice(0, 180)}</p>
        </div>
      );
    }
    return <>{this.props.children}</>;
  }
}
