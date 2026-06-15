import React, { ErrorInfo, ReactNode } from 'react';
import { AlertOctagon, RotateCw, Trash2 } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error caught by ErrorBoundary:", error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.href = '/';
  };

  private handleClearCache = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.reload();
    } catch (e) {
      console.error(e);
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div id="error-boundary-screen" className="min-h-screen bg-zinc-950 text-zinc-100 font-sans p-6 flex flex-col items-center justify-center">
          <div className="max-w-xl w-full bg-zinc-900 border border-zinc-805/80 border-zinc-800 rounded-2xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
            
            {/* Top decorative hazard pattern */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-red-500 via-amber-500 to-red-500" />

            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-xl bg-red-950/50 border border-red-900/60 flex items-center justify-center text-red-500 flex-shrink-0 animate-pulse">
                <AlertOctagon className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-zinc-50">Algo salió mal en el aplicativo</h2>
                <p className="text-xs text-zinc-400">Error interno de renderizado detectado en producción.</p>
              </div>
            </div>

            <div className="p-4 bg-zinc-950 rounded-lg border border-zinc-800/80 font-mono text-xs text-red-400 space-y-2 overflow-x-auto max-h-48 mb-6">
              <p className="font-bold text-zinc-200">[{this.state.error?.name || 'Error'}]: {this.state.error?.message || 'Error desconocido'}</p>
              {this.state.error?.stack && (
                <pre className="text-[10px] text-zinc-500 leading-relaxed whitespace-pre-wrap">
                  {this.state.error.stack.split('\n').slice(0, 5).join('\n')}
                </pre>
              )}
            </div>

            <div className="space-y-4">
              <div className="text-xs text-zinc-400 leading-relaxed">
                <p className="font-semibold text-zinc-300">¿Por qué sucedió esto?</p>
                <p className="mt-1">Esto suele ocurrir si la API de producción devuelve campos en un formato inesperado, o si se interrumpió la conexión del servidor remoto en Vercel.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <button
                  id="btn-error-reset"
                  onClick={this.handleReset}
                  className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  Re-intentar e Iniciar
                </button>
                <button
                  id="btn-error-clear"
                  onClick={this.handleClearCache}
                  className="px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98]"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Limpiar Caché y Recargar
                </button>
              </div>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
