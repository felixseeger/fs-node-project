import React, { Component, type ReactNode } from 'react';
import { surface, border, radius, text, font, sp } from '../../nodes/nodeTokens';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  nodeType?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches rendering errors, specifically chunk load errors during React.lazy() node loads.
 */
export class NodeErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // We log the error but avoid crashing the parent Canvas
    console.error(`[NodeErrorBoundary] Failed to render node ${this.props.nodeType || 'Unknown'}:`, error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            background: surface.sunken,
            border: `1px solid #ef444450`,
            borderRadius: radius.xl,
            width: 320,
            padding: sp[4],
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: sp[3],
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            textAlign: 'center',
          }}
        >
          <div style={{ color: '#ef4444', marginBottom: sp[2] }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
          </div>
          
          <h3 style={{ ...font.lg, fontWeight: 600, color: text.primary, margin: 0 }}>
            {this.props.nodeType ? `${this.props.nodeType} Failed` : 'Failed to Load Node'}
          </h3>
          
          <p style={{ ...font.sm, color: text.secondary, margin: 0 }}>
            A network error occurred while loading this component chunk.
          </p>

          <button
            onClick={this.handleRetry}
            style={{
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: radius.md,
              padding: '6px 16px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: 12,
              marginTop: sp[2],
            }}
          >
            Retry Loading
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
