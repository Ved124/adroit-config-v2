import React from 'react';

// Catches render-time errors anywhere below it so a single bad component can't
// blank the whole screen in front of a customer. Offers "Try Again" (re-render
// the same route) and "Restart Configuration" (clear saved config + go home),
// since most errors here stem from a stale/partial localStorage config.
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary] Caught render error:', error, info?.componentStack);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  handleRestart = () => {
    try {
      localStorage.clear();
    } catch (e) {}
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-brand-light px-6">
          <div className="max-w-md w-full text-center bg-white border border-grayn-200 rounded-2xl shadow-lg p-8">
            <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-red-50 flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12" y2="16" />
              </svg>
            </div>
            <h1 className="text-lg font-semibold text-brand-dark mb-1">Something went wrong</h1>
            <p className="text-sm text-grayn-600 mb-6">
              This screen hit an unexpected error. Your progress may be saved — try again, or restart the configuration.
            </p>
            <div className="flex flex-col gap-2">
              <button
                onClick={this.handleRetry}
                className="w-full py-2.5 rounded-lg bg-brand-blue text-white font-medium hover:bg-brand-dark transition"
              >
                Try Again
              </button>
              <button
                onClick={this.handleRestart}
                className="w-full py-2.5 rounded-lg border border-grayn-300 text-grayn-700 font-medium hover:bg-grayn-50 transition"
              >
                🔄 Restart Configuration
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
