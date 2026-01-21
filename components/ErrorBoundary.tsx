
import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, Terminal, ArrowLeft, Radio, Database, Info, Activity } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Grid Critical Error:', error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#050507] flex flex-col p-8 md:p-16 lg:p-24 text-slate-400 font-sans relative overflow-hidden selection:bg-red-500/30">
          {/* Subtle Technical Backdrop */}
          <div className="fixed inset-0 pointer-events-none -z-10">
            <div className="absolute inset-0 opacity-[0.02]" 
                 style={{ backgroundImage: 'linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
            </div>
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(220,38,38,0.05),transparent_40%)]"></div>
          </div>

          {/* Top Branding/Status Bar */}
          <div className="relative z-10 flex items-center justify-between mb-24 animate-in fade-in slide-in-from-top-4 duration-700">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-xl">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-[11px] font-black text-white uppercase tracking-[0.4em]">Critical_Grid_Fault</h2>
                <div className="flex items-center gap-2">
                  <div className="w-1 h-1 rounded-full bg-red-600 animate-ping"></div>
                  <span className="text-[8px] font-bold text-red-500/60 uppercase tracking-widest">Environment_Locked</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Layout Grid */}
          <div className="grid lg:grid-cols-12 gap-16 lg:gap-24 items-start max-w-7xl relative z-10">
            <div className="lg:col-span-7 space-y-10 animate-in fade-in slide-in-from-left-6 duration-1000">
              <div className="space-y-8">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-lg bg-red-600/5 border border-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-[0.4em] shadow-sm">
                  <Radio className="w-4 h-4" />
                  Runtime Exception Detected
                </div>
                
                <div className="space-y-6">
                  <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase leading-tight">
                    Investigative Workspace <br /> <span className="text-red-600/80 italic">Clinically Halted</span>
                  </h1>
                  <p className="text-base md:text-lg text-slate-500 leading-relaxed max-w-xl font-medium">
                    A non-recoverable error occurred during intelligence synchronization. Clinical security protocols have locked the workspace.
                  </p>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={this.handleReset}
                  className="group relative px-10 py-5 bg-white text-black rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-slate-50 transition-all active:scale-95 shadow-2xl overflow-hidden"
                >
                  <div className="absolute inset-0 bg-red-600/5 -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                  <ArrowLeft className="w-4 h-4 relative z-10 transition-transform group-hover:-translate-x-1" />
                  <span className="relative z-10">Return to Homepage</span>
                </button>
              </div>
            </div>

            {/* Diagnostic Panel Sidebar */}
            <div className="lg:col-span-5 space-y-6 animate-in fade-in slide-in-from-right-6 duration-1000 delay-200">
              <div className="p-8 rounded-[2.5rem] bg-black border border-white/5 text-left shadow-2xl relative group overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-red-600/40"></div>
                
                <div className="flex items-center gap-3 mb-8 border-b border-white/5 pb-4">
                  <Terminal className="w-4 h-4 text-red-500/40" />
                  <span className="text-[10px] font-black text-white/40 uppercase tracking-widest font-mono">Exception_Report</span>
                </div>
                
                <div className="space-y-6 font-mono">
                  <div className="text-[11px] text-red-500/90 leading-relaxed bg-red-500/5 p-6 rounded-2xl border border-red-500/10 break-all select-all shadow-inner">
                    {this.state.error?.toString() || 'CRITICAL_SYSTEM_ANOMALY'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Minimal Footer */}
          <div className="mt-auto pt-24 border-t border-white/5 flex items-center justify-between opacity-10">
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Global_Defense_Sector</span>
            <span className="text-[10px] font-black uppercase tracking-[0.2em] font-mono">INCIDENT_LOGGED</span>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
