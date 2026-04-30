import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props { children: ReactNode; }
interface State { error: Error | null; info: ErrorInfo | null; }

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null, info: null };

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.setState({ error, info });
    console.error("[ErrorBoundary] Error:", error.message);
    console.error("[ErrorBoundary] Component stack:", info.componentStack);
  }

  render() {
    const { error, info } = this.state;
    if (error) {
      return (
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "var(--bg-2)", padding: "2rem" }}>
          <div className="card p-8 max-w-lg w-full text-center">
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⚠️</div>
            <h2 className="page-title" style={{ marginBottom: "0.5rem" }}>Terjadi Kesalahan</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", marginBottom: "1rem" }}>
              {error.message}
            </p>
            {info && (
              <details style={{ textAlign: "left", fontSize: "0.75rem", background: "var(--bg-3)", borderRadius: "8px", padding: "0.75rem", marginBottom: "1.5rem", maxHeight: "10rem", overflow: "auto" }}>
                <summary style={{ cursor: "pointer", fontWeight: 600, marginBottom: "0.5rem" }}>Detail error</summary>
                <pre style={{ whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{info.componentStack}</pre>
              </details>
            )}
            <button
              className="btn-primary"
              onClick={() => this.setState({ error: null, info: null })}
            >
              Coba Lagi
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
