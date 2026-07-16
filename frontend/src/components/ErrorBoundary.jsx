import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error, info) { console.error('DeskFlow crashed:', error, info); }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-surface text-gray-100 p-6">
          <div className="card p-8 max-w-md text-center space-y-3">
            <AlertTriangle className="mx-auto text-red-400" size={36} />
            <h1 className="text-lg font-semibold">Something went wrong</h1>
            <p className="text-sm text-gray-400">DeskFlow hit an unexpected error. Try reloading the page.</p>
            <button className="btn-primary" onClick={() => window.location.reload()}>Reload</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
export default ErrorBoundary;
