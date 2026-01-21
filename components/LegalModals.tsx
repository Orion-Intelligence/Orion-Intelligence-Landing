
import React from 'react';
import { X, Shield, Lock, ScrollText, CheckCircle2 } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'access' | 'compliance';
}

const LegalModals: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  const content = {
    privacy: {
      title: "Data Privacy Protocol",
      icon: Shield,
      body: (
        <div className="space-y-6">
          <section>
            <h3 className="text-slate-900 dark:text-white font-bold mb-2 uppercase tracking-widest text-[11px]">Zero-Knowledge Collection</h3>
            <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed font-medium">Orion Intelligence adheres to strict PII stripping protocols. All ingested data is normalized and scrubbed of non-essential identifiers unless explicitly required for investigative verification.</p>
          </section>
          <section>
            <h3 className="text-slate-900 dark:text-white font-bold mb-2 uppercase tracking-widest text-[11px]">Encryption at Rest</h3>
            <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed font-medium">All intelligence nodes utilize AES-256 encryption. Access keys are managed via hardware security modules (HSM) with no centralized persistence of client-specific decryption headers.</p>
          </section>
          <section>
            <h3 className="text-slate-900 dark:text-white font-bold mb-2 uppercase tracking-widest text-[11px]">Audit Logging</h3>
            <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed font-medium">Every query initiated through the Orion OSINT V4 environment is immutably logged for compliance auditing, ensuring transparent oversight of investigative activities.</p>
          </section>
        </div>
      )
    },
    access: {
      title: "Governance & Access Policy",
      icon: Lock,
      body: (
        <div className="space-y-6">
          <section>
            <h3 className="text-slate-900 dark:text-white font-bold mb-2 uppercase tracking-widest text-[11px]">Multi-Tenant Isolation</h3>
            <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed font-medium">Organizational data is siloed at the infrastructure layer. Cross-tenant leakage is prevented through hardware-level virtualization and strict network access control lists (ACLs).</p>
          </section>
          <section>
            <h3 className="text-slate-900 dark:text-white font-bold mb-2 uppercase tracking-widest text-[11px]">Mandatory 2FA</h3>
            <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed font-medium">All administrative and investigative accounts require hardware-backed FIDO2/U2F or TOTP multi-factor authentication for environment entry.</p>
          </section>
          <section>
            <h3 className="text-slate-900 dark:text-white font-bold mb-2 uppercase tracking-widest text-[11px]">Role-Based Controls (RBAC)</h3>
            <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed font-medium">Granular permission sets define access to specific modules (e.g., Case Management vs. Raw Dark Web Scraping) to prevent unauthorized intelligence exposure.</p>
          </section>
        </div>
      )
    },
    compliance: {
      title: "Compliance & Standards",
      icon: ScrollText,
      body: (
        <div className="space-y-6">
          <section>
            <h3 className="text-slate-900 dark:text-white font-bold mb-2 uppercase tracking-widest text-[11px]">Intelligence Standards</h3>
            <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed font-medium">Orion is fully compliant with STIX 2.1 and TAXII 2.1 protocols, enabling seamless interoperability with global ISACs and enterprise SIEM/SOAR platforms.</p>
          </section>
          <section>
            <h3 className="text-slate-900 dark:text-white font-bold mb-2 uppercase tracking-widest text-[11px]">Operational Frameworks</h3>
            <p className="text-slate-600 dark:text-white/60 text-sm leading-relaxed font-medium">Our infrastructure aligns with ISO 27001 and SOC2 Type II controls. We utilize MITRE ATT&CK® tagging for all identified threat actor movements and IOCs.</p>
          </section>
          <section>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-[10px] text-green-600 dark:text-green-500 font-bold uppercase tracking-tighter">
                <CheckCircle2 className="w-4 h-4" /> GDPR Compliant
              </div>
              <div className="flex items-center gap-2 text-[10px] text-green-600 dark:text-green-500 font-bold uppercase tracking-tighter">
                <CheckCircle2 className="w-4 h-4" /> HIPAA Ready
              </div>
            </div>
          </section>
        </div>
      )
    }
  };

  const active = content[type];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-2xl bg-white dark:bg-[#131315] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
        <div className="px-10 py-8 border-b border-slate-200 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20">
              <active.icon className="w-6 h-6 text-blue-600 dark:text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">{active.title}</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-10 max-h-[70vh] overflow-y-auto no-scrollbar">
          {active.body}
        </div>
        <div className="px-10 py-6 border-t border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] flex justify-end">
          <button onClick={onClose} className="px-8 py-3 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-900 dark:text-white text-[11px] font-bold uppercase tracking-widest rounded-xl transition-all shadow-sm">
            Close Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModals;
