
import React from 'react';
import { 
  ShieldCheck, ArrowLeft, Key, Lock, Fingerprint, 
  RefreshCw, Globe, AlertTriangle, CheckCircle2,
  Monitor, Smartphone, UserPlus, Info
} from 'lucide-react';

interface RemediationGuideProps {
  query: string;
  onBack: () => void;
}

const RemediationGuide: React.FC<RemediationGuideProps> = ({ query, onBack }) => {
  const cardStyle = "bg-white/40 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-3xl shadow-sm backdrop-blur-md transition-all duration-300";

  return (
    <div className="relative min-h-screen -mt-20 lg:-mt-32 pt-32 pb-32 overflow-visible animate-in fade-in slide-in-from-bottom-1 duration-500 ease-out">
      {/* Galaxy Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden w-screen left-1/2 -translate-x-1/2">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-700"></div>
        <div className="absolute inset-0 opacity-40 dark:opacity-100" 
             style={{ 
               backgroundImage: `
                 radial-gradient(circle at 15% 25%, rgba(59,130,246,0.08), transparent 50%),
                 radial-gradient(circle at 85% 75%, rgba(217,70,239,0.08), transparent 50%),
                 radial-gradient(1.5px 1.5px at 12% 12%, #fff, transparent),
                 radial-gradient(1px 1px at 22% 82%, #fff, transparent),
                 radial-gradient(1.2px 1.2px at 72% 22%, #fff, transparent),
                 radial-gradient(2px 2px at 92% 42%, #fff, transparent),
                 repeating-radial-gradient(circle at center, transparent 0, transparent 200px, rgba(59,130,246,0.02) 201px, transparent 203px)
               `
             }}>
        </div>
      </div>

      <div className="relative z-10 space-y-8 px-6 md:px-12 lg:px-20 max-w-[1200px] mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-6 pb-8 border-b border-slate-200 dark:border-white/5">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-2 text-slate-500 dark:text-white/40 hover:text-blue-600 transition-colors text-[10px] font-black uppercase tracking-[0.2em] group bg-white dark:bg-white/5 px-4 py-2 rounded-full border border-slate-200 dark:border-white/10 shadow-sm self-start"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            Back to Audit
          </button>
          
          <div className="space-y-4">
            <div className="inline-flex items-center gap-3 px-3 py-1 rounded-lg bg-blue-600/10 border border-blue-600/20 text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-[0.3em]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Containment Protocol
            </div>
            <h1 className="text-3xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">Remediation Guide</h1>
            <p className="text-sm md:text-lg text-slate-500 dark:text-white/60 font-medium leading-relaxed max-w-2xl">
              Follow these clinical recovery steps to secure the identifier <code className="text-blue-600 dark:text-blue-400 font-bold">{query}</code> after exposure detection.
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* Main Steps */}
          <div className="lg:col-span-8 space-y-6">
            {[
              { 
                step: "01", 
                icon: Key, 
                title: "Immediate Credential Rotation", 
                desc: "Your plain-text password has likely been compromised. Change your password for this email and any linked accounts immediately. Use a minimum of 16 characters including symbols and avoid recycled phrases.",
                actions: ["Change primary password", "Audit linked recovery accounts", "Update password manager vault"]
              },
              { 
                step: "02", 
                icon: RefreshCw, 
                title: "Session Neutralization", 
                desc: "Stealer logs often contain session cookies that allow 'Pass-the-Cookie' attacks. Force a logout on all devices for your email provider, social accounts, and cloud workspace tools.",
                actions: ["Trigger 'Logout all sessions'", "Clear browser cookies & cache", "Rotate API tokens"]
              },
              { 
                step: "03", 
                icon: Fingerprint, 
                title: "Hardware MFA Implementation", 
                desc: "SMS and app-based 2FA can be bypassed via SIM swapping or phishing. Implement FIDO2 hardware security keys (e.g., YubiKey) as the primary authentication factor.",
                actions: ["Enable WebAuthn/FIDO2", "Delete deprecated SMS 2FA", "Download new backup codes"]
              },
              { 
                step: "04", 
                icon: Monitor, 
                title: "Infection Cleanup", 
                desc: "Stealer logs originate from malware (RedLine, Vidar, Lumma). The host device used during the exposure must be clinicaly audited for persistent threats.",
                actions: ["Perform full EDR/AV scan", "Audit browser extensions", "Check for unauthorized startup items"]
              }
            ].map((item, idx) => (
              <div key={idx} className={`${cardStyle} p-8 md:p-10 flex gap-6 md:gap-8 group`}>
                <div className="flex flex-col items-center gap-4 shrink-0">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-blue-600/5 border border-blue-600/10 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500 shadow-sm">
                    <item.icon className="w-6 h-6 md:w-8 md:h-8" />
                  </div>
                  <span className="text-[10px] font-black text-slate-300 dark:text-white/10 uppercase tracking-widest">{item.step}</span>
                </div>
                <div className="space-y-6 flex-1">
                  <div className="space-y-2">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">{item.title}</h3>
                    <p className="text-sm md:text-base text-slate-500 dark:text-white/50 leading-relaxed font-medium">
                      {item.desc}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {item.actions.map((act, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-bold text-slate-600 dark:text-white/40 uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3 text-green-500" />
                        {act}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sidebar Advisory */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-8 rounded-[2rem] bg-slate-900 dark:bg-black border border-slate-200 dark:border-white/10 shadow-xl space-y-8">
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-600/20 flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-500" />
                </div>
                <h4 className="text-xl font-black text-white uppercase tracking-widest">Critical Alert</h4>
              </div>
              <p className="text-xs font-medium leading-relaxed text-white/60">
                Data exposures in stealer logs are often used for targeted business email compromise (BEC) attacks. If this is a corporate email, inform your IT Security team immediately.
              </p>
              <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
                <div className="flex items-center gap-2 text-[10px] font-black text-blue-400 uppercase tracking-[0.2em]">
                  <Info className="w-3.5 h-3.5" />
                  Clinical Advice
                </div>
                <p className="text-[10px] text-white/30 leading-relaxed font-medium">
                  "Assume all accounts accessed from the infected host are compromised until proven otherwise."
                </p>
              </div>
            </div>

            <div className={`${cardStyle} p-8 space-y-8`}>
              <div className="space-y-1">
                <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest block">Ongoing Protection</span>
                <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Post-recovery</p>
              </div>
              <div className="space-y-6">
                {[
                  { icon: Globe, label: "Dark Web Monitoring", desc: "Keep monitoring for new leaks." },
                  { icon: Smartphone, label: "Device Isolation", desc: "Avoid login on shared PCs." },
                  { icon: UserPlus, label: "Account Recovery", desc: "Setup trusted contacts." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-blue-600/5 flex items-center justify-center shrink-0 border border-blue-600/10">
                      <item.icon className="w-4.5 h-4.5 text-blue-600" />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{item.label}</h5>
                      <p className="text-[9px] text-slate-500 dark:text-white/40 font-medium leading-tight">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemediationGuide;
