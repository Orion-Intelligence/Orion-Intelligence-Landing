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
  ShieldCheck,
  EyeOff,
  ExternalLink,
  BookOpen,
  Share2,
  Smartphone,
  Cpu,
  Workflow,
  Network,
  Globe,
  Radio,
  Key,
  Fingerprint,
  Mail,
  Phone,
  Anchor,
  CircleCheck,
  Server,
  FileSearch,
  Search,
  Download,
  Maximize2,
  Crosshair,
  ShieldQuestion,
  Layers
} from 'lucide-react';
import Navbar from './components/Navbar';
import IntelligenceProbe from './components/IntelligenceProbe';
import LegalModals from './components/LegalModals';
import ThreatActors from './components/ThreatActors';
import ApiDocumentation from './components/ApiDocumentation';
import SourceInventory from './components/SourceInventory';

const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<'privacy' | 'access' | 'compliance' | null>(null);
  const [view, setView] = useState<'home' | 'adversaries' | 'api-docs' | 'sources'>('home');
  const [footerLogoError, setFooterLogoError] = useState(false);
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
        ) : view === 'sources' ? (
          <div className="pt-32 px-6 lg:px-12 max-w-[1400px] mx-auto min-h-screen">
            <SourceInventory />
          </div>
        ) : (
          <>
            {/* Hero Section - Full Height with Stats Integrated */}
            <section className="relative min-h-screen flex flex-col px-6 lg:px-12 overflow-hidden border-b border-white/5">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[2000px] h-full bg-blue-500/[0.04] blur-[150px] rounded-full pointer-events-none"></div>
              
              <div className="max-w-[1400px] mx-auto relative w-full flex-1 flex flex-col items-center justify-center text-center">
                <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/[0.03] border border-white/10 text-blue-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-10 animate-in fade-in slide-in-from-top-4 duration-1000">
                  <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                  GOVERNANCE STANDARD V4.2.0
                </div>
                
                <h1 className="hero-heading text-5xl md:text-7xl lg:text-[5.5rem] font-extrabold text-white mb-10 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-100 max-w-6xl text-balance">
                  Unified Investigative <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40">Intelligence OS.</span>
                </h1>
                
                <p className="text-lg md:text-xl text-white/50 leading-relaxed font-medium mb-12 max-w-4xl animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
                  A role-aware analytical ecosystem for global enterprise defense. Orion unifies automated scrapers, ransomware tracking, and STIX 2.1 workflows into a clinical workspace.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300 mb-16">
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

              {/* Integrated Stats Row at bottom of Hero */}
              <div className="max-w-[1400px] mx-auto w-full pb-12 flex flex-wrap items-center justify-between gap-8 font-mono border-t border-white/5 pt-10 animate-in fade-in duration-1000 delay-500">
                {[
                  { label: 'Ingested Records', val: '14.2B+', color: 'text-blue-500' },
                  { label: 'Active Monitored Groups', val: '240+', color: 'text-white' },
                  { label: 'Daily Data Throughput', val: '1.4TB', color: 'text-white' },
                  { label: 'Telemetry Uptime', val: '99.98%', color: 'text-green-500' }
                ].map((stat, i) => (
                  <div key={i} className="flex flex-col gap-1">
                    <span className="text-[10px] text-white/20 uppercase tracking-[0.2em] font-bold">{stat.label}</span>
                    <span className={`text-xl font-black tracking-tight ${stat.color}`}>{stat.val}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Strategic Modular Core Section - Slightly lighter background to break monotony */}
            <section id="core" className="px-6 lg:px-12 py-32 bg-[#080808] relative">
              <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-end gap-16 mb-24">
                  <div className="max-w-2xl space-y-8">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                      <h2 className="text-[12px] font-bold text-white/40 uppercase tracking-[0.4em]">Strategic Modular Core</h2>
                    </div>
                    <h3 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1]">Enterprise <br />Investigative Chassis.</h3>
                  </div>
                  <div className="max-w-md space-y-6 border-l border-white/5 pl-10">
                    <p className="text-lg text-white/40 leading-relaxed font-medium">High-fidelity infrastructure for sovereign intelligence operations and organizational threat discovery.</p>
                    <div className="flex items-center gap-4 text-blue-500 font-bold text-[10px] uppercase tracking-widest">
                      <Layers className="w-4 h-4" />
                      Interoperable V4 Stack
                    </div>
                  </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { id: '01', icon: Cpu, title: 'Extraction Engine', desc: 'Heuristic normalization of indicators enriched with automated tactical tagging.', footer: 'Active Ingestion' },
                    { id: '02', icon: Workflow, title: 'Case Workflow', desc: 'Unified investigative folders with blockchain-verified data integrity for teams.', footer: 'Clinical Audit' },
                    { id: '03', icon: Network, title: 'Surface Mapping', desc: 'Real-time infrastructure correlation linked with underground historicals.', footer: 'Global Grid' },
                    { id: '04', icon: Smartphone, title: 'Secure Mobility', desc: 'Privacy-hardened interface with integrated onion-routing for field analysts.', footer: 'End-to-End' },
                    { id: '05', icon: Share2, title: 'STIX 2.1 Ready', desc: 'Full interoperability with global SOC pipelines via standardized JSON exports.', footer: 'TAXII Supported' },
                    { id: '06', icon: ShieldQuestion, title: 'Protected Intake', desc: 'Anonymized whistleblower portal for sensitive organizational reporting.', footer: 'Privacy Tier 1' },
                    { id: '07', icon: Database, title: 'Semantic Search', desc: 'Deep indexing across IRC archives, paste sites, and ransomware blogs.', footer: '14.2B Records' },
                    { id: '08', icon: ShieldCheck, title: 'Isolation Vault', desc: 'Hardware-level multi-tenant separation with cryptographic user isolation.', footer: 'Zero Trust' }
                  ].map((f, i) => (
                    <div key={i} className="group relative bg-[#020202] border border-white/5 rounded-2xl p-8 flex flex-col h-full transition-all duration-500 hover:bg-[#0c0c0c] hover:-translate-y-1 hover:border-blue-500/20 shadow-lg">
                      <div className="flex items-start justify-between mb-10">
                        <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/[0.02] border border-white/5 group-hover:bg-blue-600/10 group-hover:border-blue-500/30 transition-all">
                          <f.icon className="w-5 h-5 text-white/20 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <span className="text-[10px] font-black text-white/5 group-hover:text-white/20 transition-colors uppercase tracking-[0.3em] font-mono">ID: {f.id}</span>
                      </div>
                      <div className="space-y-4 mb-10 flex-grow">
                        <h4 className="text-xl font-bold text-white tracking-tight group-hover:text-blue-400 transition-colors">{f.title}</h4>
                        <p className="text-sm text-white/40 leading-relaxed font-medium">{f.desc}</p>
                      </div>
                      <div className="pt-6 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{f.footer}</span>
                        <ArrowRight className="w-4 h-4 text-white/10 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Whistleblowing Section - Updated with bluish background */}
            <section className="px-6 lg:px-12 py-32 discovery-gradient relative overflow-hidden border-y border-white/5">
               <div className="max-w-[1400px] mx-auto">
                 <div className="glass-card rounded-[3rem] p-12 lg:p-24 border border-white/5 relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8">
                      <a href="https://orionleaks.com/" target="_blank" rel="noopener noreferrer" className="text-[10px] font-mono text-white/20 hover:text-blue-500 transition-colors uppercase tracking-[0.4em]">orionleaks.com :: access_portal</a>
                   </div>
                   <div className="grid lg:grid-cols-2 gap-20 items-center">
                     <div className="space-y-10">
                        <div className="inline-flex items-center gap-4 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.3em]">
                          <Lock className="w-4 h-4" />
                          TLP:RED SECURE CHANNEL
                        </div>
                        <h2 className="text-5xl font-extrabold text-white tracking-tight leading-[1.1]">
                          Clinical Intake for <br />
                          <span className="text-white/40">High-Stakes Reports.</span>
                        </h2>
                        <p className="text-lg text-white/40 leading-relaxed max-w-xl text-balance">
                          Orion includes a fully integrated secure whistleblowing module designed to safely collect sensitive disclosures while protecting the identity of the submitter. 
                          Organizations receive internal or external reports through an encrypted submission channel built on a hardened <strong>GlobaLeaks</strong> core for maximum anonymity.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                           {[
                             { icon: Fingerprint, title: 'Identity Shielding', desc: 'Hardware-level scrubbing of IP, browser fingerprint, and metadata.' },
                             { icon: Key, title: 'PGP Orchestration', desc: 'End-to-end clinical encryption for all submitted attachments.' },
                             { icon: Anchor, title: 'Role Isolation', desc: 'Reports are routed only to verified organizational auditors.' },
                             { icon: Radio, title: 'Tor-Native Intake', desc: 'Seamless GlobaLeaks integration via authenticated onion nodes.' }
                           ].map((feat, i) => (
                             <div key={i} className="space-y-3">
                               <div className="flex items-center gap-3">
                                 <feat.icon className="w-4 h-4 text-blue-500" />
                                 <span className="text-[11px] font-black text-white uppercase tracking-widest">{feat.title}</span>
                               </div>
                               <p className="text-[10px] text-white/30 leading-relaxed uppercase tracking-tight font-medium">{feat.desc}</p>
                             </div>
                           ))}
                        </div>
                     </div>
                     <div className="relative">
                        <div className="aspect-square bg-white/[0.01] border border-white/5 rounded-[2rem] flex items-center justify-center relative group">
                           <div className="absolute inset-0 bg-blue-500/5 blur-[100px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
                           <ShieldAlert className="w-48 h-48 text-white/[0.01] group-hover:text-blue-500/10 transition-colors duration-1000" />
                           <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                              <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center mb-8 shadow-[0_0_50px_rgba(59,130,246,0.5)]">
                                <Lock className="w-8 h-8 text-white" />
                              </div>
                              <h4 className="text-xl font-bold text-white mb-4 uppercase tracking-widest">Initialize Drop</h4>
                              <p className="text-[10px] text-white/30 font-mono mb-8 uppercase tracking-widest">INTEGRATED_GLOBALEAKS_V1.4</p>
                              <a href="https://orionleaks.com/" target="_blank" rel="noopener noreferrer" className="px-8 py-3 bg-white text-black font-black text-[10px] uppercase tracking-[0.2em] rounded-xl hover:bg-blue-50 transition-all active:scale-95 block">
                                Enter Intake Environment
                              </a>
                           </div>
                        </div>
                     </div>
                   </div>
                 </div>
               </div>
            </section>

            {/* Probe Section - Dark slate bg */}
            <section id="probe" className="px-6 lg:px-12 py-32 overflow-hidden relative bg-[#050505] border-y border-white/5">
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-500/[0.02] blur-[150px] pointer-events-none rounded-full"></div>
              <div className="max-w-[1400px] mx-auto relative z-10">
                <div className="text-center mb-20 max-w-4xl mx-auto space-y-6">
                   <div className="inline-flex items-center gap-4 text-blue-500 font-bold text-[10px] uppercase tracking-[0.5em]">
                     <Terminal className="w-4 h-4" />
                     Investigation Console
                   </div>
                   <h3 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">Interrogate the Spectrum.</h3>
                   <p className="text-lg text-white/20 max-w-3xl mx-auto leading-relaxed">
                     Enter a domain, hash, or persona identifier to initiate a clinical probe across monitored leak repositories and infrastructure logs.
                   </p>
                </div>
                <IntelligenceProbe />
              </div>
            </section>

            {/* Zero-Trust Administrative Controls Section - Slightly offset gray */}
            <section className="px-6 lg:px-12 py-32 bg-[#0a0a0a]">
              <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col lg:flex-row justify-between items-end gap-16 mb-24">
                  <div className="max-w-2xl space-y-8">
                    <div className="flex items-center gap-4">
                      <div className="px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2">
                        <CircleCheck className="w-3 h-3" />
                        ISO/SOC2 ALIGNED
                      </div>
                      <h2 className="text-[12px] font-bold text-white/40 uppercase tracking-[0.4em]">Administrative Governance</h2>
                    </div>
                    <h3 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight leading-tight">Zero-Trust <br />Control Plane.</h3>
                  </div>
                  <div className="max-w-md space-y-6 border-l border-white/5 pl-10">
                    <p className="text-lg text-white/40 leading-relaxed font-medium text-balance">
                      Whether performing persona reconstruction or auditing cases across a global team, Orion enforces clinical governance at every node.
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                   {[
                     { icon: Fingerprint, title: 'FIDO2/U2F Support', desc: 'Hardware-backed identity verification for all investigative accounts.' },
                     { icon: FileSearch, title: 'Audit Readiness', desc: 'Complete audit logging for enterprise-wide compliance and clinical reporting.' },
                     { icon: Server, title: 'Multi-tenant isolation', desc: 'Hardware-level virtualization ensuring strict separation of discovery streams.' }
                   ].map((item, i) => (
                     <div key={i} className="glass-card p-10 rounded-3xl border border-white/5 group hover:border-blue-500/20 transition-all">
                        <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center mb-8 border border-blue-500/20 group-hover:scale-110 transition-transform">
                           <item.icon className="w-5 h-5 text-blue-500" />
                        </div>
                        <h4 className="text-lg font-bold text-white mb-4 uppercase tracking-widest">{item.title}</h4>
                        <p className="text-sm text-white/40 leading-relaxed font-medium">{item.desc}</p>
                     </div>
                   ))}
                </div>
              </div>
            </section>

            {/* Final Section: Operational Liaison */}
            <section className="px-6 lg:px-12 py-40 discovery-gradient group overflow-hidden relative border-t border-white/10">
              <div className="max-w-[1400px] mx-auto flex flex-col items-center text-center relative z-10">
                 <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold uppercase tracking-[0.25em] mb-12">
                   <Zap className="w-4 h-4 fill-blue-500" />
                   ORION_GRID: NOMINAL
                 </div>
                 
                 <div className="space-y-6 mb-20">
                    <h2 className="text-5xl md:text-7xl lg:text-7xl font-extrabold text-white tracking-tight leading-tight">
                      <span className="text-transparent bg-clip-text bg-gradient-to-b from-white to-white/20 whitespace-nowrap">Operational Liaison.</span>
                    </h2>
                    <p className="text-xl text-white/40 leading-relaxed font-medium max-w-3xl mx-auto text-balance">
                      Discover how Orion Intelligence can strengthen your security posture and protect your organization from evolving threats. Get in touch today to start your journey toward smarter defense.
                    </p>
                 </div>

                 {/* Contact Details Grid */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 w-full max-w-6xl mb-24 text-left">
                    <div className="space-y-6 group/item">
                       <div className="flex items-center gap-3 text-[10px] font-black text-white/60 uppercase tracking-[0.2em] border-b border-white/5 pb-2 group-hover/item:border-blue-500/40 transition-colors">
                          <Globe className="w-3 h-3 text-blue-500" />
                          Lahore HQ
                       </div>
                       <p className="text-xs text-white/40 leading-relaxed font-medium">
                         75 H2 Wapda Town <br />
                         Lahore, Pakistan
                       </p>
                    </div>
                    <div className="space-y-6 group/item">
                       <div className="flex items-center gap-3 text-[10px] font-black text-white/60 uppercase tracking-[0.2em] border-b border-white/5 pb-2 group-hover/item:border-blue-500/40 transition-colors">
                          <Anchor className="w-3 h-3 text-blue-500" />
                          Sydney Hub
                       </div>
                       <p className="text-xs text-white/40 leading-relaxed font-medium">
                         PO Box 65 Minto <br />
                         Sydney, Australia, 2566
                       </p>
                    </div>
                    <div className="space-y-6 group/item">
                       <div className="flex items-center gap-3 text-[10px] font-black text-white/60 uppercase tracking-[0.2em] border-b border-white/5 pb-2 group-hover/item:border-blue-500/40 transition-colors">
                          <Phone className="w-3 h-3 text-blue-500" />
                          Call Us
                       </div>
                       <p className="text-xs text-white/40 leading-relaxed font-medium">
                         (+92) 332 4935230
                       </p>
                    </div>
                    <div className="space-y-6 group/item">
                       <div className="flex items-center gap-3 text-[10px] font-black text-white/60 uppercase tracking-[0.2em] border-b border-white/5 pb-2 group-hover/item:border-blue-500/40 transition-colors">
                          <Mail className="w-3 h-3 text-blue-500" />
                          Email
                       </div>
                       <p className="text-xs text-white/40 leading-relaxed font-medium">
                         msmannan00@gmail.com
                       </p>
                    </div>
                 </div>
                 
                 <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer" className="px-12 py-6 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold text-[14px] uppercase tracking-[0.15em] flex items-center gap-8 transition-all active:scale-95 shadow-[0_20px_80px_rgba(59,130,246,0.3)] border-t border-white/20 group-hover:scale-105">
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
                <div className="w-12 h-12 relative flex items-center justify-center rounded-xl overflow-hidden border border-white/10 shadow-lg bg-black">
                  {!footerLogoError ? (
                    <img 
                      src="public_html/logo.png" 
                      alt="Orion" 
                      className="w-full h-full object-cover scale-110" 
                      onError={() => setFooterLogoError(true)}
                    />
                  ) : (
                    <div className="text-blue-500 font-bold text-2xl">O</div>
                  )}
                </div>
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
                <li><button onClick={() => setView('adversaries')} className="hover:text-blue-500 transition-all flex items-center gap-2">Threat Grid <Ghost className="w-3 h-3" /></button></li>
                <li><button onClick={() => setView('sources')} className="hover:text-blue-500 transition-all flex items-center gap-2">Sources <BookOpen className="w-3 h-3" /></button></li>
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