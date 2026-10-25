import React from 'react';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('RuralBiz AI ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    if (this.props.onReset) {
      this.props.onReset();
    } else {
      window.location.reload();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24
        }}>
          <div className="card" style={{
            maxWidth: 520,
            width: '100%',
            textAlign: 'center',
            padding: '36px 24px',
            border: '2px solid #FCA5A5',
            background: '#FFF'
          }}>
            <div style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: '#FEE2E2',
              color: '#DC2626',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px auto'
            }}>
              <AlertCircle size={30} />
            </div>
            <h2 style={{ fontSize: '1.4rem', color: '#1E293B', marginBottom: 8 }}>
              Temporary Rendering Notice
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#64748B', lineHeight: 1.6, marginBottom: 20 }}>
              The application encountered a visual rendering error. Your entered inputs and account data have been preserved in your session.
            </p>
            {this.state.error?.message && (
              <div style={{
                background: '#F8FAFC',
                padding: '8px 12px',
                borderRadius: 8,
                fontSize: '0.78rem',
                color: '#475569',
                fontFamily: 'monospace',
                marginBottom: 20,
                wordBreak: 'break-word'
              }}>
                {this.state.error.message}
              </div>
            )}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={this.handleReset}
                className="btn-primary"
                style={{ padding: '9px 18px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <RefreshCw size={15} />
                <span>Retry Screen</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.href = '/';
                }}
                className="btn-secondary"
                style={{ padding: '9px 18px', fontSize: '0.88rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}
              >
                <Home size={15} />
                <span>Return to Home</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
