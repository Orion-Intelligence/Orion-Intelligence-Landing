
import React, { useState, useMemo } from 'react';
import { 
  ExternalLink, Globe, Search, Crosshair, 
  Terminal, LockKeyhole, Zap, Bug, Cpu, 
  Scissors, Activity, TriangleAlert, HelpCircle,
  Target, AlertOctagon, Ghost, Bot, Skull, 
  Flame, Sword, Radiation, Network, Moon, 
  Mountain, User, ShieldCheck, Dna, Tornado
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
  'handala': Ghost,      // The Wraith
  'lock': Skull,        // The Reaper
  'akira': Bot,         // The Android
  'centipede': Bug,     // The Insectoid
  'hunters': Crosshair,  // The Marksman
  'everest': Mountain,   // The Titan
  'ciphbit': Cpu,        // The Cyborg
  'lunalock': Moon,      // The Nightshade
  'safepay': ShieldCheck,// The Paladin
  'warlock': Flame,      // The Pyromancer
  'frag': Sword,        // The Duelist
  'chaos': Tornado,      // The Storm
  'runsomewares': Radiation, // The Toxicant
  'worldleaks': Network,   // The Hivemind
  'bashe': Zap,          // The Volt
  '?': Dna              // The Genesis
};

const actors: ThreatActor[] = [
  // Hacktivism
  { name: "Handala Hack", url: "https://handala-hack.to", imageKey: "handala", description: "Hacktivist “hack-and-leak” brand; politically motivated targeting under the Handala symbol.", category: "Defacement / Hacktivism", tags: ["Hacktivism", "Iran-linked"] },
  
  // RaaS
  { name: "LockBit (Tor)", url: "http://lockbit7z2jwcskxpbokpemdxmltipntwlkmidcll2qirbu7ykg46eyd.onion/", imageKey: "lock", description: "Major RaaS double-extortion actor with long-running victim leak operations.", category: "Ransomware (RaaS)", tags: ["RaaS", "LockBit"] },
  { name: "Akira (Tor)", url: "http://akiral2iz6a7qgd3ayp3l6yub7xx2uep76idk3u2kollpj5z3z636bad.onion/", imageKey: "akira", description: "Double-extortion ransomware group active since 2023 with dedicated leak site.", category: "Ransomware (RaaS)", tags: ["Akira", "Tor"] },
  { name: "Rhysida (Tor)", url: "http://rhysidafohrhyy2aszi7bm32tnjat5xri65fopcxkdfxhi4tidsg7cad.onion/", imageKey: "centipede", description: "Double-extortion ransomware group; commonly branded with a centipede motif.", category: "Ransomware (RaaS)", tags: ["Rhysida", "Centipede"] },
  { name: "Hunters International (Tor)", url: "http://hunters55atbdusuladzv7vzv6a423bkh6ksl2uftwrxyuarbzlfh7yd.onion/", imageKey: "hunters", description: "RaaS-style extortion group emerging 2023; tracked across multiple intel vendors.", category: "Ransomware (RaaS)", tags: ["Hunters", "Tor"] },
  { name: "Everest (Tor)", url: "http://ransomocmou6mnbquqz44ewosbkjk3o5qjsl3orawojexfook2j7esad.onion/", imageKey: "everest", description: "Double-extortion ransomware actor active since ~2020 with Tor leak presence.", category: "Ransomware (RaaS)", tags: ["Everest", "Tor"] },
  { name: "CiphBit (Tor)", url: "http://ciphbitqyg26jor7eeo6xieyq7reouctefrompp6ogvhqjba7uo4xdid.onion/", imageKey: "ciphbit", description: "Crypto-ransomware / extortion brand tracked since 2023 with Tor leak links.", category: "Ransomware (RaaS)", tags: ["CiphBit", "Crypto"] },
  { name: "LunaLock (Tor)", url: "http://lunalockcccxzkpfovwzifwxcytqkiuak6wzybnniqwxcmpsetpbetid.onion/", imageKey: "lunalock", description: "Newer extortion group tracked since Sep-2025, noted for “AI data submission” coercion.", category: "Ransomware (RaaS)", tags: ["LunaLock", "AI"] },
  { name: "SafePay (Tor)", url: "http://safepaypfxntwixwjrlcscft433ggemlhgkkdupi2ynhtcmvdgubmoyd.onion/", imageKey: "safepay", description: "Centralized (non-RaaS style) double-extortion actor reported heavily active in 2025.", category: "Ransomware (RaaS)", tags: ["SafePay", "2025"] },
  { name: "Warlock (Tor)", url: "http://warlockhga5iw3t54ps5iytlilf7hlvxy7kwrkidspn4qoh64s4vsuyd.onion/", imageKey: "warlock", description: "Enterprise ransomware/extortion operation tied in reporting to SharePoint exploitation waves.", category: "Ransomware (RaaS)", tags: ["Warlock", "SharePoint"] },
  
  // Tracked Portals
  { name: "34o4m3f (Tor)", url: "http://34o4m3f26ucyeddzpf53bksy76wd737nf2fytslovwd3viac3by5chad.onion/", imageKey: "frag", description: "Extortion leak portal tracked as “Frag” by WatchGuard.", category: "Ransomware (RaaS)", tags: ["Frag", "Onion"] },
  { name: "Hptqq2o (Tor)", url: "http://hptqq2o2qjva7lcaaq67w36jihzivkaitkexorauw7b2yul2z6zozpqd.onion/", imageKey: "chaos", description: "Extortion leak portal tracked as “CHAOS” by WatchGuard.", category: "Ransomware (RaaS)", tags: ["CHAOS", "Onion"] },
  { name: "Rnsmware (Tor)", url: "http://rnsmwareartse3m4hjsumjf222pnka6gad26cqxqmbjvevhbnym5p6ad.onion/", imageKey: "runsomewares", description: "Extortion leak portal tracked as “Run Some Wares” by WatchGuard.", category: "Ransomware (RaaS)", tags: ["RunSomeWares"] },
  { name: "Worldle (Tor)", url: "http://worldleaksartrjm3c6vasllvgacbi5u3mgzkluehrzhk2jz4taufuid.onion/", imageKey: "worldleaks", description: "“World Leaks” data-broker/extortion brand with lineage from Hunters International.", category: "Ransomware (RaaS)", tags: ["WorldLeaks", "Hunters"] },
  { name: "Basheqt (Tor)", url: "http://basheqtvzqwz4vp6ks5lm2ocq7i6tozqgf6vjcasj4ezmsy4bkpshhyd.onion/", imageKey: "bashe", description: "Bashe/APT73/Eraleig-style extortion branding noted for deceptive/attention-seeking claims in reporting.", category: "Ransomware (RaaS)", tags: ["Bashe", "APT73"] },

  // Unattributed
  ...[
    "Genesis6ix", "Pdcizqz", "3bnusfu", "Peargxn", "3ev4met", "Gunrabx", "Pearsmob", "47glxku", "5butbkr", "7ukmkdt", 
    "Ijzn3si", "Imncrew", "Arcuufp", "Incblog", "Rnsm777", "J3dp6ok", "Beast6a", "J5o5y2f", "Benzona", "Jvkpexg", 
    "Sarcoma", "Bertblog", "K7kg3jq", "Securo4", "Black3g", "Kawasa2", "Shinypo", "Blogvl7", "Kraken", "Silentb", 
    "Brohood", "Ks5424y", "Tezwss", "Cicada", "Leaksnd", "Tp5cwh6", "Twniiye", "Txtggyn", "Ctyfftr", "Lynxblo", 
    "Vkvsgl7", "Mblogci", "Darklea", "Datalea", "Mydatae", "Dcarryh", "Nerqnac", "Xbkv2qe", "Yrz6bay", "Devmanb", 
    "Nitrogen", "Yzcpwxu", "Direwol", "Nleakk6", "Z3wqggt", "Dounczg", "Nsalewd", "Z6wkggh", "Dragonf", "Obscura", 
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
    <div className="py-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-12 border-b border-slate-200 dark:border-white/5 pb-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20 text-blue-600 dark:text-blue-500 text-[9px] font-bold uppercase tracking-[0.3em]">
            <Crosshair className="w-3 h-3" />
            Adversary Knowledge Base
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none">Threat Inventory.</h2>
          <p className="text-lg text-slate-500 dark:text-white/40 font-medium">
            Clinical identification of {actors.length} clusters using stylized entity tokens.
          </p>
        </div>
        
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/20" />
            <input 
              type="text"
              placeholder="SEARCH ACTOR..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-blue-600/40 w-full lg:w-64 transition-all"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-12">
        <button 
          onClick={() => setActiveCategory(null)}
          className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${!activeCategory ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white'}`}
        >
          Total
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${activeCategory === cat ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white'}`}
          >
            {cat.split(' ')[0]}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredActors.map((actor, idx) => {
          const ActiveIcon = IconMap[actor.imageKey] || IconMap['?'];
          const isUnknown = actor.imageKey === '?';
          
          return (
            <div key={idx} className="bg-white dark:bg-[#0d0d0f] group rounded-2xl border border-slate-200 dark:border-white/10 hover:border-blue-600/40 dark:hover:border-blue-500/40 transition-all flex flex-row items-start gap-4 p-4 relative overflow-hidden shadow-sm hover:shadow-lg">
              
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.01] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

              {/* Entity Token - Compact Portrait Aesthetic */}
              <div className="shrink-0 relative">
                <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 shadow-sm ${
                  isUnknown 
                    ? 'bg-slate-50 dark:bg-white/[0.01] border-slate-100 dark:border-white/5' 
                    : 'bg-gradient-to-br from-slate-100 to-slate-200 dark:from-[#151517] dark:to-[#08080a] border-slate-300 dark:border-white/10 group-hover:border-blue-500/30'
                }`}>
                  <div className="relative">
                    {/* Background "Aura" for character representation */}
                    {!isUnknown && (
                       <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    )}
                    <ActiveIcon 
                      className={`w-6 h-6 md:w-7 md:h-7 transition-all duration-300 relative z-10 ${
                        isUnknown 
                          ? 'text-slate-300 dark:text-white/5' 
                          : 'text-slate-700 dark:text-white/80 group-hover:text-blue-500'
                      }`} 
                      strokeWidth={1.5}
                      style={{
                        filter: isUnknown 
                          ? 'none' 
                          : 'drop-shadow(1px 1px 0px rgba(0,0,0,0.3)) drop-shadow(2px 2px 0px rgba(0,0,0,0.1))'
                      }}
                    />
                  </div>
                </div>
                {!isUnknown && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-blue-600 border border-white dark:border-[#0d0d0f] flex items-center justify-center shadow-lg">
                    <div className="w-1 h-1 bg-white rounded-full"></div>
                  </div>
                )}
              </div>

              {/* Tactical Content Area */}
              <div className="flex-grow flex flex-col min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <h3 className="text-[13px] md:text-sm font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight truncate">
                    {actor.name}
                  </h3>
                  <div className={`shrink-0 px-2 py-0.5 rounded-full text-[6px] md:text-[7px] font-black uppercase tracking-widest border border-current opacity-60 ${
                    actor.category === 'Ransomware (RaaS)' ? 'text-red-600' :
                    actor.category === 'Defacement / Hacktivism' ? 'text-purple-600' :
                    'text-slate-400'
                  }`}>
                    {actor.category.includes('RaaS') ? 'RaaS' : actor.category.includes('Hack') ? 'Hack' : 'Anon'}
                  </div>
                </div>
                
                <p className="text-[10px] md:text-[11px] text-slate-500 dark:text-white/30 leading-snug mb-2 font-medium line-clamp-2">
                  {actor.description}
                </p>

                <div className="flex flex-wrap items-center gap-2 mt-auto">
                  <div className="flex flex-wrap gap-1 flex-1">
                    {actor.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-1.5 py-0.5 rounded-md bg-slate-50 dark:bg-white/[0.02] text-[7px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest border border-slate-100 dark:border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <a 
                    href={actor.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center gap-1 px-2 py-1 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-md group/link transition-all"
                  >
                    <Globe className="w-2.5 h-2.5 text-slate-300 dark:text-white/10 group-hover/link:text-blue-600" />
                    <span className="text-[8px] font-mono font-bold text-slate-400 dark:text-white/20 group-hover/link:text-slate-900 dark:group-hover/link:text-white truncate max-w-[70px]">
                      {actor.url.replace('http://', '').replace('https://', '').substring(0, 10)}...
                    </span>
                    <ExternalLink className="w-2 h-2 text-slate-300 dark:text-white/10 group-hover/link:text-blue-600" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredActors.length === 0 && (
        <div className="py-24 flex flex-col items-center justify-center text-center space-y-4">
           <div className="p-8 rounded-full bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
              <HelpCircle className="w-12 h-12 text-slate-200 dark:text-white/5" strokeWidth={0.5} />
           </div>
           <div className="space-y-1">
             <h4 className="text-lg font-bold text-slate-900 dark:text-white uppercase tracking-widest">No Adversaries Found</h4>
             <button 
               onClick={() => { setSearchTerm(''); setActiveCategory(null); }}
               className="mt-4 px-6 py-2 bg-blue-600 text-white text-[10px] font-black uppercase tracking-widest rounded-lg hover:bg-blue-500 transition-all shadow-lg active:scale-95"
             >
               Reset Filters
             </button>
           </div>
        </div>
      )}
    </div>
  );
};

export default ThreatActors;
