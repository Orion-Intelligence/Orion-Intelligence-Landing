import React, { useState } from 'react';
import { 
  ArrowRight, 
  Database, 
  Ghost,
  ShieldAlert,
  Lock,
  Zap,
  Command,
  Terminal,
  ActivitySquare,
  ShieldCheck,
  EyeOff,
  ExternalLink,
  BookOpen,
  Share2,
  ShieldQuestion,
  Smartphone,
  Cpu,
  Workflow,
  Network,
  Code2,
  AlertTriangle,
  Eye,
  UserCheck,
  Layers2
} from 'lucide-react';
import Navbar from './components/Navbar';
import IntelligenceFeed from './components/IntelligenceFeed';
import IntelligenceProbe from './components/IntelligenceProbe';
import LegalModals from './components/LegalModals';
import ThreatActors from './components/ThreatActors';
import ApiDocumentation from './components/ApiDocumentation';

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'access' | 'compliance' | null>(null);
  const [view, setView] = useState<'home' | 'adversaries' | 'api-docs'>('home');
  const CALENDLY_URL = "https://calendly.com/msmannan/30min";

  return (
    <div className="min-h-screen mesh-gradient selection:bg-blue-500/30">
      <div className="grain"></div>
      <Navbar onNavigate={setView} currentView={view} />
      
      <LegalModals 
        isOpen={!!activeModal} 
        onClose={() => setActiveModal(null)} 
        type={activeModal || 'privacy'} 
      />

      <main className="relative z-10">
        {view === 'adversaries' ? (
          <div className="pt-32 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen">
            <ThreatActors />
          </div>
        ) : view === 'api-docs' ? (
          <div className="pt-20 min-h-screen">
            <ApiDocumentation />
          </div>
        ) : (
          <>
            {/* Hero Section */}
            <section className="relative pt-56 pb-32 px-6 lg:px-12 overflow-hidden">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[2000px] h-[900px] bg-blue-500/[0.04] blur-[150px] rounded-full pointer-events-none"></div>
              
              <div className="max-w-[1400px] mx-auto relative">
                <div className="flex flex-col items-center text-center">
                  <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                    GOVERNANCE STANDARD V4.2.0
                  </div>
                  
                  <h1 className="hero-heading text-5xl md:text-7xl lg:text-[5rem] font-extrabold text-white mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 max-w-6xl text-balance">
                    Unified Investigative <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">Intelligence OS.</span>
                  </h1>
                  
                  <p className="text-lg md:text-xl text-white/50 leading-relaxed font-medium mb-12 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                    A role-aware analytical ecosystem for global enterprise defense. Orion unifies automated scrapers, ransomware tracking, and STIX 2.1 workflows into a clinical workspace.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
                    <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="group px-10 py-4 bg-white text-black font-bold text-[13px] uppercase tracking-[0.12em] rounded-xl hover:bg-blue-50 transition-all flex items-center gap-4 shadow-[0_20px_60px_rgba(255,255,255,0.1)] active:scale-95">
                      Book Operational Demo
                      <Command className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                    </a>
                    <button 
                      onClick={() => setView('adversaries')}
                      className="px-10 py-4 bg-white/[0.04] border border-white/10 text-white font-bold text-[13px] uppercase tracking-[0.12em] rounded-xl hover:bg-white/10 transition-all active:scale-95 flex items-center gap-3"
                    >
                      <Ghost className="w-4 h-4" />
                      Adversary Inventory
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Core Section */}
            <section id="core" className="px-6 lg:px-12 py-32 bg-[#020202] relative">
              <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-end gap-16 mb-24">
                  <div className="max-w-2xl space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <h2 className="text-[12px] font-bold text-white/40 uppercase tracking-[0.4em]">Strategic Modular Core</h2>
                    </div>
                    <h3 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">Enterprise <br />Investigative Chassis.</h3>
                  </div>
                  <div className="max-w-md space-y-6 border-l border-white/5 pl-10">
                    <p className="text-lg text-white/40 leading-relaxed font-medium">
                      High-fidelity infrastructure for sovereign intelligence operations and organizational threat discovery.
                    </p>
                    <div className="flex items-center gap-4 text-blue-500 font-bold text-[10px] uppercase tracking-widest">
                      <Layers2 className="w-4 h-4" />
                      Interoperable V4 Stack
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { icon: Cpu, title: 'Extraction Engine', desc: 'Heuristic normalization of indicators enriched with automated tactical tagging.', id: '01', tag: 'Active Ingestion' },
                    { icon: Workflow, title: 'Case Workflow', desc: 'Unified investigative folders with blockchain-verified data integrity for teams.', id: '02', tag: 'Clinical Audit' },
                    { icon: Network, title: 'Surface Mapping', desc: 'Real-time infrastructure correlation linked with underground historicals.', id: '03', tag: 'Global Grid' },
                    { icon: Smartphone, title: 'Secure Mobility', desc: 'Privacy-hardened interface with integrated onion-routing for field analysts.', id: '04', tag: 'End-to-End' },
                    { icon: Share2, title: 'STIX 2.1 Ready', desc: 'Full interoperability with global SOC pipelines via standardized JSON exports.', id: '05', tag: 'TAXII Supported' },
                    { icon: ShieldQuestion, title: 'Protected Intake', desc: 'Anonymized whistleblower portal for sensitive organizational reporting.', id: '06', tag: 'Privacy Tier 1' },
                    { icon: Database, title: 'Semantic Search', desc: 'Deep indexing across IRC archives, paste sites, and ransomware blogs.', id: '07', tag: '14.2B Records' },
                    { icon: ShieldCheck, title: 'Isolation Vault', desc: 'Hardware-level multi-tenant separation with cryptographic user isolation.', id: '08', tag: 'Zero Trust' }
                  ].map((item, i) => (
                    <div key={i} className="group relative bg-[#080808] border border-white/5 rounded-2xl p-8 flex flex-col h-full transition-all duration-500 hover:bg-[#0c0c0c] hover:-translate-y-1 hover:border-blue-500/20 shadow-lg">
                      <div className="flex items-start justify-between mb-10">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5 group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all">
                          {/* @ts-ignore */}
                          <item.icon className="w-5 h-5 text-white/20 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <span className="text-[10px] font-black text-white/5 group-hover:text-white/20 transition-colors uppercase tracking-[0.3em] font-mono">ID: {item.id}</span>
                      </div>

                      <div className="space-y-4 mb-10 flex-grow">
                        <h4 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">{item.title}</h4>
                        <p className="text-sm text-white/40 leading-relaxed font-medium">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                         <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{item.tag}</span>
                         <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Probe Section */}
            <section id="probe" className="px-6 lg:px-12 py-24 overflow-hidden relative">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-500/[0.02] blur-[150px] pointer-events-none rounded-full"></div>
              <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="text-center mb-16 max-w-4xl mx-auto space-y-6">
                   <div className="inline-flex items-center gap-4 text-blue-500 font-bold text-[10px] uppercase tracking-[0.5em]">
                     <Terminal className="w-4 h-4" />
                     Investigation Console
                   </div>
                   <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Interrogate the Full Spectrum.</h3>
                   <p className="text-lg text-white/20 max-w-3xl mx-auto leading-relaxed">
                     Enter a domain, hash, or persona identifier to initiate a probe across monitored ransomware leak repositories and infrastructure logs.
                   </p>
                </div>
                <IntelligenceProbe />
              </div>
            </section>

            {/* Final CTA Section */}
            <section className="px-6 lg:px-12 py-32 discovery-gradient group overflow-hidden relative border-t border-white/10">
              <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center relative z-10">
                 <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-[0.25em] mb-10">
                   <Zap className="w-4 h-4 fill-blue-500" />
                   ORION_GRID: NOMINAL
                 </div>
                 
                 <h2 className="text-5xl md:text-7xl lg:text-7xl font-extrabold text-white tracking-tight mb-12">
                   Strategic Defense <br />
                   <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20">begins here.</span>
                 </h2>
                 
                 <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="px-12 py-5 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-[14px] uppercase tracking-[0.15em] flex items-center gap-8 transition-all active:scale-95 shadow-[0_20px_80px_rgba(59,130,246,0.3)] border-t border-white/20">
                   Book Strategic Onboarding
                   <ArrowRight className="w-5 h-5 group-hover:translate-x-3 transition-transform" />
                 </a>
              </div>
            </section>
          </>
        )}
      </main>

      <footer className="px-6 lg:px-12 py-20 bg-[#010101] border-t border-white/10 relative z-10">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid md:grid-cols-6 gap-16 mb-20">
            <div className="col-span-1 md:col-span-3 space-y-8">
              <div className="flex items-center gap-4 cursor-pointer" onClick={() => setView('home')}>
                <img src="logo.png" alt="Orion" className="w-10 h-10" />
                <span className="text-2xl font-bold text-white tracking-[0.3em] uppercase">ORION</span>
              </div>
              <p className="text-white/70 max-w-sm text-lg leading-relaxed font-medium">
                The premier workspace for enterprise defenders and researchers. Clinical data, zero noise.
              </p>
            </div>
            
            <div className="space-y-8">
              <h5 className="text-[12px] font-bold text-white uppercase tracking-[0.3em] opacity-90">Platform</h5>
              <ul className="space-y-4 text-[12px] text-white/60 uppercase tracking-[0.1em] font-bold">
                <li><a href="https://try.orionintelligence.org/" className="hover:text-blue-500 transition-colors flex items-center gap-2">Live Portal <ExternalLink className="w-3 h-3" /></a></li>
                <li><a href="https://github.com/Orion-Intelligence/Orion-Intelligence" className="hover:text-blue-500 transition-colors flex items-center gap-2">Sources <Share2 className="w-3 h-3" /></a></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h5 className="text-[12px] font-bold text-white uppercase tracking-[0.3em] opacity-90">Intelligence</h5>
              <ul className="space-y-4 text-[12px] text-white/60 uppercase tracking-[0.1em] font-bold">
                <li><button onClick={() => setView('adversaries')} className="hover:text-blue-500 transition-colors flex items-center gap-2">Threat Grid <Ghost className="w-3 h-3" /></button></li>
                <li><a href="https://orion-search.readthedocs.io/en/latest/app_docs/introduction_to_platform.html" className="hover:text-blue-500 transition-colors flex items-center gap-2">Docs <BookOpen className="w-3 h-3" /></a></li>
              </ul>
            </div>

            <div className="space-y-8">
              <h5 className="text-[12px] font-bold text-white uppercase tracking-[0.3em] opacity-90">Compliance</h5>
              <ul className="space-y-4 text-[12px] text-white/60 uppercase tracking-[0.1em] font-bold">
                <li><button onClick={() => setActiveModal('privacy')} className="hover:text-blue-500 transition-colors">Privacy</button></li>
                <li><button onClick={() => setActiveModal('compliance')} className="hover:text-blue-500 transition-colors">Audit Ready</button></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-10 text-[12px] font-bold uppercase tracking-[0.2em]">
            <div className="flex items-center gap-10 text-white/80">
               <span>© 2025 Orion Intelligence Group</span>
               <span className="hidden md:inline font-mono text-blue-400">14.2B RECORDS</span>
            </div>
            <div className="flex gap-10 items-center">
               <span className="flex items-center gap-3 text-white tracking-widest font-extrabold">
                 <div className="w-2.5 h-2.5 bg-green-500 rounded-full shadow-[0_0_12px_rgba(34,197,94,0.8)] animate-pulse"></div>
                 GRID: ONLINE
               </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;