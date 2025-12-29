import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (import.meta.env.DEV) {
      console.error('Uncaught error:', error, errorInfo);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-amber-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-lg p-6 max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={32} className="text-red-600" />
            </div>
            
            <h2 className="text-xl font-bold text-slate-800 mb-2">
              เกิดข้อผิดพลาด
            </h2>
            
            <p className="text-slate-500 text-sm mb-4">
              ขออภัย เกิดปัญหาบางอย่าง กรุณาลองใหม่อีกครั้ง
            </p>

            {import.meta.env.DEV && this.state.error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 text-left">
                <p className="text-xs text-red-700 font-mono break-all">
                  {this.state.error.message}
                </p>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={this.handleReset}
                className="flex-1 bg-slate-100 text-slate-700 font-medium py-3 rounded-xl"
              >
                ลองใหม่
              </button>
              <button
                onClick={this.handleReload}
                className="flex-1 bg-brand-600 text-white font-medium py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <RefreshCw size={18} />
                รีเฟรช
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
