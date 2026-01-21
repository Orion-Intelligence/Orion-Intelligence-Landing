
import React, { useState, useMemo } from 'react';
import { 
  ExternalLink, Globe, Search, Crosshair, 
  Terminal, LockKeyhole, Zap, Bug, Cpu, 
  Scissors, Activity, TriangleAlert, HelpCircle,
  Target, AlertOctagon, Ghost, Bot, Skull, 
  Flame, Sword, Radiation, Network, Moon, 
  Mountain, User, ShieldCheck, Dna, Tornado,
  ChevronRight, Info
} from 'lucide-react';

export interface ThreatActor {
  name: string;
  category: 'Ransomware (RaaS)' | 'Intelligence Aggregator' | 'Defacement / Hacktivism' | 'Unattributed / identity not publicly disclosed';
  description: string;
  url: string;
  imageKey: string;
  tags: string[];
}

const IconMap: Record<string, React.ElementType> = {
  'handala': Ghost,      
  'lock': Skull,        
  'akira': Bot,         
  'centipede': Bug,     
  'hunters': Crosshair,  
  'everest': Mountain,   
  'ciphbit': Cpu,        
  'lunalock': Moon,      
  'safepay': ShieldCheck,
  'warlock': Flame,      
  'frag': Sword,        
  'chaos': Tornado,      
  'runsomewares': Radiation, 
  'worldleaks': Network,   
  'bashe': Zap,          
  '?': Dna              
};

const actors: ThreatActor[] = [
  { name: "Handala Hack", url: "https://handala-hack.to", imageKey: "handala", description: "Hacktivist “hack-and-leak” brand; politically motivated targeting under the Handala symbol.", category: "Defacement / Hacktivism", tags: ["Hacktivism", "Iran-linked"] },
  { name: "LockBit (Tor)", url: "http://lockbit7z2jwcskxpbokpemdxmltipntwlkmidcll2qirbu7ykg46eyd.onion/", imageKey: "lock", description: "Major RaaS double-extortion actor with long-running victim leak operations.", category: "Ransomware (RaaS)", tags: ["RaaS", "LockBit"] },
  { name: "Akira (Tor)", url: "http://akiral2iz6a7getid.onion/", imageKey: "akira", description: "Double-extortion ransomware group active since 2023 with dedicated leak site.", category: "Ransomware (RaaS)", tags: ["Akira", "Tor"] },
  { name: "Rhysida (Tor)", url: "http://rhysidafohrhyy2aszi7bm32tnjat5xri65fopcxkdfxhi4tidsg7cad.onion/", imageKey: "centipede", description: "Double-extortion ransomware group; commonly branded with a centipede motif.", category: "Ransomware (RaaS)", tags: ["Rhysida", "Centipede"] },
  { name: "Hunters International (Tor)", url: "http://hunters55atbdusuladzv7vzv6a423bkh6ksl2uftwrxyuarbzlfh7yd.onion/", imageKey: "hunters", description: "RaaS-style extortion group emerging 2023; tracked across multiple intel vendors.", category: "Ransomware (RaaS)", tags: ["Hunters", "Tor"] },
  { name: "Everest (Tor)", url: "http://ransomocmou6mnbquqz44ewosbkjk3o5qjsl3orawojexfook2j7esad.onion/", imageKey: "everest", description: "Double-extortion ransomware actor active since ~2020 with Tor leak presence.", category: "Ransomware (RaaS)", tags: ["Everest", "Tor"] },
  { name: "CiphBit (Tor)", url: "http://ciphbitqyg26jor7eeo6xieyq7reouctefrompp6ogvhqjba7uo4xdid.onion/", imageKey: "ciphbit", description: "Crypto-ransomware / extortion brand tracked since 2023 with Tor leak links.", category: "Ransomware (RaaS)", tags: ["CiphBit", "Crypto"] },
  { name: "LunaLock (Tor)", url: "http://lunalockcccxzkpfovwzifwxcytgetid.onion/", imageKey: "lunalock", description: "Newer extortion group tracked since Sep-2025, noted for “AI data submission” coercion.", category: "Ransomware (RaaS)", tags: ["LunaLock", "AI"] },
  { name: "SafePay (Tor)", url: "http://safepaypfxntwixwjrlcscft433ggemlhgkkdupi2ynhtcmvdgubmoyd.onion/", imageKey: "safepay", description: "Centralized (non-RaaS style) double-extortion actor reported heavily active in 2025.", category: "Ransomware (RaaS)", tags: ["SafePay", "2025"] },
  { name: "Warlock (Tor)", url: "http://warlockhga5iw3t54ps5iytlilf7hlvxy7kwrkidspn4qoh64s4vsuyd.onion/", imageKey: "warlock", description: "Enterprise ransomware/extortion operation tied in reporting to SharePoint exploitation waves.", category: "Ransomware (RaaS)", tags: ["Warlock", "SharePoint"] },
  { name: "34o4m3f (Tor)", url: "http://34o4m3f26ucyeddzpf53bksy76wd737nf2fytslovwd3viac3by5chad.onion/", imageKey: "frag", description: "Extortion leak portal tracked as “Frag” by WatchGuard.", category: "Ransomware (RaaS)", tags: ["Frag", "Onion"] },
  { name: "Hptqq2o (Tor)", url: "http://hptqq2o2qjva7lcaaq67w36jihzivkaitkexorauw7b2yul2z6zozpqd.onion/", imageKey: "chaos", description: "Extortion leak portal tracked as “CHAOS” by WatchGuard.", category: "Ransomware (RaaS)", tags: ["CHAOS", "Onion"] },
  { name: "Rnsmware (Tor)", url: "http://rnsmwareartse3m4hjsumjf222pnka6gad26cqxqmbjvevhbnym5p6ad.onion/", imageKey: "runsomewares", description: "Extortion leak portal tracked as “Run Some Wares” by WatchGuard.", category: "Ransomware (RaaS)", tags: ["RunSomeWares"] },
  { name: "Worldle (Tor)", url: "http://worldleaksartrjm3c6vasllvgacbi5u3mgzkluehrzhk2jz4taufuid.onion/", imageKey: "worldleaks", description: "“World Leaks” data-broker/extortion brand with lineage from Hunters International.", category: "Ransomware (RaaS)", tags: ["WorldLeaks", "Hunters"] },
  { name: "Basheqt (Tor)", url: "http://basheqtvzqwz4vp6ks5lm2ocq7i6tozqgf6vjcasj4ezmsy4bkpshhyd.onion/", imageKey: "bashe", description: "Bashe/APT73/Eraleig-style extortion branding noted for deceptive/attention-seeking claims in reporting.", category: "Ransomware (RaaS)", tags: ["Bashe", "APT73"] },
  ...[
    "Genesis6ix", "Pdcizqz", "3bnusfu", "Peargxn", "3ev4met", "Gunrabx", "Pearsmob", "47glxku", "5butbkr", "7ukmkdt", 
    "Ijzn3si", "Imncrew", "Arcuufp", "Incblog", "Rnsm777", "J3dp6ok", "Beast6a", "J5o5y2f", "Benzona", "Jvkpexg", 
    "Sarcoma", "Bertblog", "K7kg3jq", "Securo4", "Black3g", "Kawasa2", "Shinypo", "Blogvl7", "Kraken", "Silentb", 
    "Brohood", "Ks5424y", "Tezwss", "Cicada", "Leaksnd", "Tp5cwh6", "Twniiye", "Txtggyn", "Ctyfftr", "Lynxblo", 
    "Vkvsgl7", "Mblogci", "Darklea", "Datalea", "Mydatae", "Dcarryh", "Nerqnac", "Xbkv2qe", "Yrz6bay", "Devmanb", 
    "Nitrogen", "Nleakk6", "Z3wqggt", "Z6wkggh", "Dragonf", "Obscura", 
    "Zfytize", "Ebhmkoo", "Om6q4a6", "Zktnif5", "Fjg4zi4", "Omegalo", "Zohlm7a", "Flock4c", "Orca66h"
  ].map(name => ({
    name: `${name} (Tor)`,
    url: `http://${name.toLowerCase()}...onion/`,
    imageKey: "?",
    description: "Extortion leak portal (Tor); operator identity/branding not publicly disclosed (unattributed).",
    category: "Unattributed / identity not publicly disclosed" as any,
    tags: ["Unattributed", "Onion"]
  }))
];

const ThreatActors: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filteredActors = useMemo(() => {
    return actors.filter(actor => {
      const matchesSearch = actor.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            actor.tags.some(t => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesCategory = activeCategory ? actor.category === activeCategory : true;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, activeCategory]);

  const categories = Array.from(new Set(actors.map(a => a.category)));

  return (
    <div className="pt-20 pb-12 animate-in fade-in slide-in-from-bottom-1 duration-500 ease-out relative">
      {/* Exact Background System from Pricing with Enhanced Solar Rings and Stars */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden w-screen left-1/2 -translate-x-1/2">
        <div className="absolute inset-0 bg-slate-50 dark:bg-slate-950 transition-colors duration-700"></div>
        <div className="absolute inset-0 opacity-40 dark:opacity-100 transition-all duration-1000" 
             style={{ 
               backgroundImage: `
                 radial-gradient(circle at 15% 25%, rgba(59,130,246,0.12), transparent 50%),
                 radial-gradient(circle at 85% 75%, rgba(217,70,239,0.1), transparent 50%),
                 radial-gradient(1.5px 1.5px at 12% 12%, #fff, transparent),
                 radial-gradient(1px 1px at 22% 82%, #fff, transparent),
                 radial-gradient(1.2px 1.2px at 72% 22%, #fff, transparent),
                 radial-gradient(2px 2px at 92% 42%, #fff, transparent),
                 radial-gradient(1.1px 1.1px at 37% 47%, #fff, transparent),
                 radial-gradient(1.3px 1.3px at 67% 17%, #fff, transparent),
                 radial-gradient(1px 1px at 47% 87%, #fff, transparent),
                 radial-gradient(1.5px 1.5px at 17% 67%, #fff, transparent),
                 radial-gradient(1.1px 1.1px at 85% 15%, #fff, transparent),
                 radial-gradient(1.2px 1.2px at 5% 95%, #fff, transparent),
                 radial-gradient(1px 1px at 40% 5%, #fff, transparent),
                 radial-gradient(1px 1px at 60% 95%, #fff, transparent),
                 radial-gradient(1px 1px at 5% 40%, #fff, transparent),
                 radial-gradient(1px 1px at 95% 60%, #fff, transparent),
                 repeating-radial-gradient(circle at 15% 15%, transparent 0, transparent 120px, rgba(59,130,246,0.02) 121px, transparent 122px),
                 repeating-radial-gradient(circle at 85% 85%, transparent 0, transparent 180px, rgba(59,130,246,0.02) 181px, transparent 182px),
                 repeating-radial-gradient(circle at center, transparent 0, transparent 200px, rgba(59,130,246,0.03) 201px, transparent 203px)
               `
             }}>
        </div>
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-blue-500/10 blur-[150px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[1000px] h-[1000px] bg-blue-900/5 blur-[180px] rounded-full"></div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-12 border-b border-slate-200 dark:border-white/5 pb-12 px-4 md:px-0">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20 text-blue-600 dark:text-blue-500 text-[9px] font-black uppercase tracking-[0.3em]">
            <Crosshair className="w-3.5 h-3.5" />
            ADVERSARY_INTELLIGENCE_OS
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">Threat Inventory</h2>
          <p className="text-lg text-slate-500 dark:text-white/40 font-medium leading-relaxed">
            Clinical mapping of {actors.length} investigative entities across the dark intelligence grid.
          </p>
        </div>
      </div>

      <div className="mb-8 px-4 md:px-0">
        <div className="relative group w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/20 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text"
            placeholder="FILTER ENTITIES..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-3 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-white/10 focus:border-blue-600/40 focus:ring-0 w-full"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8 px-4 md:px-0">
        <button 
          onClick={() => setActiveCategory(null)}
          className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${!activeCategory ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white'}`}
        >
          Total ({actors.length})
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white'}`}
          >
            {cat.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4 md:px-0">
        {filteredActors.map((actor, idx) => {
          const ActiveIcon = IconMap[actor.imageKey] || IconMap['?'];
          const isUnknown = actor.imageKey === '?';
          const isDefacement = actor.category === 'Defacement / Hacktivism';
          
          return (
            <div 
              key={idx} 
              onClick={() => window.open(actor.url, '_blank')}
              className="group relative flex flex-col gap-6 px-4 lg:px-6 py-4 lg:py-5 bg-slate-200/80 dark:bg-[#0d0d0f]/60 border border-slate-300/60 dark:border-white/10 rounded-2xl transition-all duration-300 hover:bg-blue-100/40 dark:hover:bg-blue-900/15 hover:border-blue-500/30 dark:hover:border-blue-500/30 cursor-pointer backdrop-blur-3xl shadow-sm dark:shadow-none"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-col flex-1 min-w-0 space-y-1">
                  <h3 className="text-[13px] lg:text-[14px] font-bold text-slate-900 dark:text-white tracking-widest group-hover:text-blue-600 transition-colors truncate font-mono uppercase">
                    {actor.name}
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${
                      actor.category.includes('Ransomware') ? 'text-blue-600 dark:text-blue-400' :
                      isDefacement ? 'text-purple-500' :
                      'text-slate-400'
                    }`}>
                      {actor.category}
                    </span>
                  </div>
                </div>

                <div className={`p-2 lg:p-2.5 rounded-xl border transition-all shrink-0 ${
                  isUnknown 
                    ? 'bg-slate-100/50 dark:bg-white/[0.02] border-slate-200 dark:border-white/10 text-slate-400' 
                    : 'bg-blue-600/10 border-blue-500/20 text-blue-600 dark:text-blue-500 group-hover:scale-110'
                }`}>
                  <ActiveIcon strokeWidth={1.5} className="w-4 h-4 lg:w-4.5 lg:h-4.5" />
                </div>
              </div>

              <div className="space-y-4">
                <p className={`${isDefacement ? 'text-[14.5px]' : 'text-[13px]'} text-slate-500 dark:text-white/60 leading-relaxed font-medium line-clamp-2`}>
                  {actor.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-2 border-t border-slate-100 dark:border-white/5">
                  <div className="flex flex-wrap gap-2">
                    {actor.tags.map(tag => (
                      <span key={tag} className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 text-[8px] font-black text-slate-500 dark:text-white/30 uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredActors.length === 0 && (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
           <div className="p-8 rounded-full bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
              <HelpCircle className="w-12 h-12 text-slate-200 dark:text-white/5" strokeWidth={0.5} />
           </div>
           <div className="space-y-2">
             <h4 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">No Intelligence Matched</h4>
             <p className="text-slate-500 dark:text-white/30 text-sm font-medium">No adversaries found matching your current filter parameters.</p>
           </div>
           <button 
             onClick={() => { setSearchTerm(''); setActiveCategory(null); }}
             className="px-8 py-3 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
           >
             Clear Matrix Filters
           </button>
        </div>
      )}
    </div>
  );
};

export default ThreatActors;
