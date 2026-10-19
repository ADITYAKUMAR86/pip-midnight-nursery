import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#fff8f1] text-[#5c4033] text-center">
          <div className="max-w-md p-8 rounded-3xl border border-[#f3dce3] bg-[#fff8f1] shadow-lg space-y-4">
            <h2 className="font-heading text-2xl font-bold text-[#a34063]">
              The Nursery is Resting
            </h2>
            <p className="text-sm text-[#5c4033]">
              A quiet starlight breeze blew by. Let’s tuck Pip back in.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="px-6 py-2.5 rounded-full bg-[#a34063] text-[#fff8f1] text-xs font-bold shadow-md hover:bg-[#5c4033] transition-colors"
            >
              Reopen Nursery
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
