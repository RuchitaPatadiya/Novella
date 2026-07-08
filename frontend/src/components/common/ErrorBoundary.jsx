import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // Styled premium fallback UI matching Novella styling guidelines
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="max-w-md space-y-6 animate-fadeIn">
            <div className="w-12 h-12 bg-red-50 text-red-700 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-200">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="font-display font-light text-2xl text-ink uppercase tracking-wider m-0">
              An unexpected error occurred
            </h2>
            <p className="font-body font-light text-xs text-muted leading-relaxed m-0">
              Something went wrong while rendering this page. Our technical engineering team has been notified.
            </p>
            {this.state.error?.message && (
              <pre className="bg-surface border border-border p-4 rounded-[2px] text-[0.7rem] text-left font-mono overflow-auto max-h-40 leading-relaxed text-red-800">
                {this.state.error.message}
              </pre>
            )}
            <div className="pt-2">
              <button
                onClick={() => window.location.reload()}
                className="bg-ink text-cream-muted font-body font-medium text-[0.65rem] tracking-[0.2em] uppercase px-8 py-3.5 transition-all duration-300 hover:bg-gold hover:text-dark cursor-pointer rounded-[2px] border-0"
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
