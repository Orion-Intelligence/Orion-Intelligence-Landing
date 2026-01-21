import React, { useState, useMemo } from 'react';
import { 
  Globe, Search, Terminal, Database, ShieldAlert, Lock, 
  ExternalLink, ChevronRight, Fingerprint, AlertTriangle, X, HelpCircle
} from 'lucide-react';

type SourceType = 'onion' | 'website' | 'script';

interface IntelligenceSource {
  raw: string;
  category: string;
}

const sourceData: IntelligenceSource[] = [
  // NEWS (Clearnet)
  ...['bleepingcomputer', 'csocybercrime', 'hackread', 'infosecuritymagazine', 'krebsonsecurity', 'postswigger', 'schneier', 'securityweek', 'thehackernews', 'therecord'].map(s => ({ raw: s, category: 'News' })),
  // SOCIAL (Clearnet)
  ...['b1nd', 'crackingx', 'hacksnation', 'xreactor', 'reddit', 'twitter'].map(s => ({ raw: s, category: 'Social' })),
  // DEFACEMENT (Clearnet/Scripts)
  ...['github_mthcht_awesome_lists', 'github_openfish', 'phishunt', 'zone_xsec', 'tweetfeed.py'].map(s => ({ raw: s, category: 'Defacement' })),
  // EXPLOIT (Clearnet)
  ...['0dayfans', 'anyrun_malwaretrends', 'cisa', 'cxsecurity', 'cybergcca', 'exploitdb', 'github_trickest_cve', 'inthewild', 'kb_cert', 'rapid7', 'sploitus', 'talosintelligence'].map(s => ({ raw: s, category: 'Exploit' })),
  // API (Mixed)
  ...['breachdbsztfykg2fdaq2gnqnxfsbj5d35byz3yzj73hazydk4vq72qd.onion', 'pcgame_mod.py', 'pagespeed_seo_check.py', 'apk_mod.py', 'pakdbwftdzn3xwslrzewbtsju63wep2xn37klmhqjuynp554vhjtdiad.onion', 'username_checker.py'].map(s => ({ raw: s, category: 'API' })),
  // TRACKING (Clearnet)
  ...['acn', 'cert', 'certeu', 'certgovua', 'csocybercrime_tracking', 'cyber', 'cybernewsksa', 'idsirtii', 'incibe', 'msb', 'ncsc', 'ncsc_swed', 'ncscuk', 'nsm', 'nukibgovcz', 'public_tableau', 'thaicert'].map(s => ({ raw: s, category: 'Tracking' })),
  // LEAKS (Onion)
  ...[
    '3ev4metjirohtdpshsqlkrqcmxq6zu3d7obrdhglpy5jpbr7whmlfgqd.onion', '5butbkrljkaorg5maepuca25oma7eiwo6a2rlhvkblb4v6mf3ki2ovid.onion',
    '7ukmkdtyxdkdivtjad57klqnd3kdsmq6tp45rrsxqnu76zzv3jvitlqd.onion', '34o4m3f26ucyeddzpf53bksy76wd737nf2fytslovwd3viac3by5chad.onion',
    '47glxkuxyayqrvugfumgsblrdagvrah7gttfscgzn56eyss5wg3uvmqd.onion', 'akiral2iz6a7getid.onion',
    'arcuufpr5xxbbkin4mlidt7itmr6znlppk63jbtkeguuhszmc5g7qdyd.onion', 'basheqtvzqwz4vp6ks5lm2ocq7i6tozqgf6vjcasj4ezmsy4bkpshhyd.onion',
    'bertblogsoqmm4ow7nqyh5ik7etsmefdbf25stauecytvwy7tkgizhad.onion', 'black3gnkizshuynieigw6ejgpblb53mpasftzd6pydqpmq2vn2xf6yd.onion',
    'blogvl7tjyjvsfthobttze52w36wwiz34hrfcmorgvdzb6hikucb7aqd.onion', 'business_data_leaks', 'cicadabv7vicyvgz5khl7v2x5yygcgow7ryyy6yppwmxii4eoobdaztqd.onion',
    'csidb', 'darkfeed', 'darkleakyqmv62eweqwy4dnhaijg4m4dkburo73pzuqfdumcntqdokyd.onion',
    'dataleakypypu7uwblm5kttv726l3iripago6p336xjnbstkjwrlnlid.onion', 'bottom_up_leaks', 'ebhmkoohccl45qesdbvrjqtyro2hmhkmh6vkyfyjjzfllm3ix72aqaid.onion',
    'flock4cvoeqm4c62gyohvmncx6ck2e7ugvyqgyxqtrumklhd5ptwzpqd.onion', 'github_doormanbreach', 'gunrabxbig445sjqa535uaymzerj6fp4nwc6ngc2xughf2pedjdhk4ad.onion',
    'handala_hack', 'hptqq2o2qjva7lcaaq67w36jihzivkaitkexorauw7b2yul2z6zozpqd.onion',
    'hunters55atbdusuladzv7vzv6a423bkh6ksl2uftwrxyuarbzlfh7yd.onion', 'ijzn3sicrcy7guixkzjkib4ukbiilwc3xhnmby4mcbccnsd7j2rekvqd.onion',
    'imncrewwfkbjkhr2oylerfm5qtbzfphhmpcfag43xc2k2kfgvluqtlgoid.onion', 'incblog6qu4y4mm4zvw5nrmue6qbwtgjsxpw6b7ixzssu36tsajldoad.onion',
    'intelrepository', 'j3dp6okmaklajrsk6zljl5fa2vpui7j2w6cwmhmmqhab6frdfbphhid.onion',
    'j5o5y2feotmhvr7cbcp2j2ewayv5mn5zenl3joqwx67gtfchhezjznad.onion', 'k7kg3jqxang3wh7hnmaiokchk7qoebupfgoik6rha6mjpzwupwtj25yd.onion',
    'kawasa2qo7345dt7ogxmx7qmn6z2hnwaoi3h5aeosupozkddqwp6lqqd.onion', 'krakenccj3wr23452a4ibkbkuph4d6soyx2xgjoogtuamc3m7u7wemad.onion',
    'ks5424y3wpr5zlug5c7i6svvxweinhbdcqcfnptkfcutrncfazzgz5id.onion', 'leak_lookup', 'leaksndi6i6m2ji6ozulqe4imlrqn6wrgjlhxe25vremvr3aymm4aaid.onion',
    'lockbit7z2jwcskxpbokpemdxmltipntwlkmidcll2qirbu7ykg46eyd.onion', 'lynxblogco7r37jt7p5wrmfxzqze7ghxw6rihzkqc455qluacwotciyd.onion',
    'mblogci3rudehaagbryjznltdp33ojwzkq6hn2pckvjq33rycmzczpid.onion', 'monitor_mozilla', 'mydatae2d63il5oaxxangwnid5loq2qmtsol2ozr6vtb7yfm5ypzo6id.onion',
    'nerqnacjmdy3obvevyol7qhazkwkv57dwqvye5v46k5bcujtfa6sduad.onion', 'netleaks', 'nitrogenczslprh3xyw6lh5xyjvmsz7ciljoqxxknd7uymkfetfhgvqd.onion',
    'nsalewdnfclsowcal6kn5csm4ryqmfpijznxwictukhrgvz2vbmjjjyd.onion', 'om6q4a6cyipxvt7ioudxt24cw4oqu4yodmqzl25mqd2hgllymrgu4aqd.onion',
    'omegalock5zxwbhswbisc42o2q2i54vdulyvtqqbudqousisjgc7j7yd.onion', 'orca66hwnpciepupe5626k2ib6dds6zizjwuuashz67usjps2wehz4id.onion',
    'pdcizqzjitsgfcgqeyhuee5u6uki6zy5slzioinlhx6xjnsw25irdgqd.onion', 'ransom', 'ransomed', 'ransomlook',
    'ransomocmou6mnbquqz44ewosbkjk3o5qjsl3orawojexfook2j7esad.onion', 'ransomware_live',
    'rhysidafohrhyy2aszi7bm32tnjat5xri65fopcxkdfxhi4tidsg7cad.onion', 'rnsm777cdsjrsdlbs4v5qoeppu3px6sb2igmh53jzrx7ipcrbjz5b2ad.onion',
    'rnsmwareartse3m4hjsumjf222pnka6gad26cqxqmbjvevhbnym5p6ad.onion', 'sarcomawmawlhov7o5mdhz4eszxxlkyaoiyiy2b5iwxnds2dmb4jakad.onion',
    'silentbgdghp3zeldwpumnwabglreql7jcffhx5vqkvtf2lshc4n5zid.onion', 'tp5cwh6d2b5hekcg6jlhoe6mawa7dlwiv47epvnfmzuaaur2dnaa3uid.onion',
    'twniiyed6mydtbe64i5mdl56nihl7atfaqtpww6gqyaiohgc75apzpad.onion', 'txtggyng5euqkyzl2knbejwpm4rlq575jn2egqldu27osbqytrj6ruyd.onion',
    'vkvsgl7lhipjirmz6j5ubp3w3bwvxgcdbpi3fsbqngfynetqtw4w5hyd.onion', 'weyhro27ruifvuqkk3hxzcrtxv2lsalntxgkv6q2j3znkhdqudz54rqd.onion',
    'worldleaksartrjm3c6vasllvgacbi5u3mgzkluehrzhk2jz4taufuid.onion', 'xbkv2qey6u3gd3qxcojynrt4h5sgrhkar6whuo74wo63hijnn677jnyd.onion',
    'yrz6bayqwhleymbeviter7ejccxm64sv2ppgqgderzgdhutozcbbhpqd.onion', 'z3wqggtxft7id3ibr7srivv5gjof5fwg76slewnzwwakjuf3nlhukdid.onion',
    'z6wkgghtoawog5noty5nxulmmt2zs7c3yvwr22v4czbffdoly2kl4uad.onion', 'zohlm7ahjwegcedoz7lrdrti7bvpofymcayotp744qhx6gjmxbuo2yid.onion'
  ].map(s => ({ raw: s, category: 'Leak' })),
];

interface FormattedSource {
  id: string;
  original: string;
  name: string;
  type: SourceType;
  category: string;
  url: string;
}

const SourceInventory: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [torTarget, setTorTarget] = useState<string | null>(null);

  const formattedSources = useMemo(() => {
    return sourceData.map((src, idx) => {
      let type: SourceType = 'website';
      let name = src.raw.replace(/^_+/, '');
      let url = '#';

      if (src.raw.endsWith('.onion')) {
        type = 'onion';
        const onionId = src.raw.replace('.onion', '');
        name = onionId.length > 20 ? `${onionId.substring(0, 12)}...${onionId.substring(onionId.length - 8)}.onion` : `${onionId}.onion`;
        url = `http://${src.raw}`;
      } else if (src.raw.endsWith('.py')) {
        type = 'script';
        name = src.raw.replace('.py', '').replace(/^_+/, '');
        url = '#'; 
      } else {
        type = 'website';
        const domainMap: Record<string, string> = {
          bleepingcomputer: 'bleepingcomputer.com',
          hackread: 'hackread.com',
          reddit: 'reddit.com',
          twitter: 'twitter.com',
          securityweek: 'securityweek.com',
          exploitdb: 'exploit-db.com',
          rapid7: 'rapid7.com',
          thehackernews: 'thehackernews.com',
          therecord: 'therecord.media',
          krebsonsecurity: 'krebsonsecurity.com',
          schneier: 'schneier.com',
          cisa: 'cisa.gov',
          ransomware_live: 'ransomware.live'
        };
        const domain = domainMap[name] || `${name}.com`;
        url = `https://${domain}`;
      }

      return {
        id: `${name}-${idx}`,
        original: src.raw,
        name,
        type,
        category: src.category,
        url
      };
    });
  }, []);

  const filtered = formattedSources.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || s.original.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? s.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  const categories = Array.from(new Set(sourceData.map(s => s.category)));

  const handleSourceClick = (src: FormattedSource) => {
    if (src.type === 'onion') {
      setTorTarget(src.url);
    } else if (src.url !== '#') {
      window.open(src.url, '_blank');
    }
  };

  return (
    <div className="pt-20 pb-12 animate-in fade-in slide-in-from-bottom-1 duration-500 ease-out px-0 relative">
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden w-screen left-1/2 -translate-x-1/2">
        <div className="absolute inset-0 bg-slate-50 dark:bg-[#08080a] transition-colors duration-700"></div>
        
        {/* Galaxy Layer - Lightened and enriched with more stars and rings */}
        <div className="absolute inset-0 opacity-70 dark:opacity-100 transition-all duration-1000" 
             style={{ 
               backgroundImage: `
                 radial-gradient(circle at 15% 25%, rgba(59,130,246,0.12), transparent 50%),
                 radial-gradient(circle at 85% 75%, rgba(217,70,239,0.1), transparent 50%),
                 radial-gradient(1.2px 1.2px at 8% 15%, #fff, transparent),
                 radial-gradient(1px 1px at 15% 45%, #fff, transparent),
                 radial-gradient(1.1px 1.1px at 25% 75%, #fff, transparent),
                 radial-gradient(1.3px 1.3px at 35% 25%, #fff, transparent),
                 radial-gradient(1px 1px at 45% 85%, #fff, transparent),
                 radial-gradient(1.5px 1.5px at 55% 35%, #fff, transparent),
                 radial-gradient(1px 1px at 65% 15%, #fff, transparent),
                 radial-gradient(1.2px 1.2px at 75% 65%, #fff, transparent),
                 radial-gradient(1.4px 1.4px at 85% 45%, #fff, transparent),
                 radial-gradient(1px 1px at 95% 85%, #fff, transparent),
                 radial-gradient(1.3px 1.3px at 10% 90%, #fff, transparent),
                 radial-gradient(1.1px 1.1px at 40% 10%, #fff, transparent),
                 radial-gradient(1.5px 1.5px at 70% 20%, #fff, transparent),
                 radial-gradient(1px 1px at 90% 10%, #fff, transparent),
                 radial-gradient(1.4px 1.4px at 30% 50%, #fff, transparent),
                 radial-gradient(1.2px 1.2px at 60% 80%, #fff, transparent),
                 repeating-radial-gradient(circle at 25% 35%, transparent 0, transparent 100px, rgba(59,130,246,0.04) 101px, transparent 103px),
                 repeating-radial-gradient(circle at 75% 65%, transparent 0, transparent 200px, rgba(59,130,246,0.03) 201px, transparent 203px),
                 repeating-radial-gradient(circle at 50% 50%, transparent 0, transparent 300px, rgba(59,130,246,0.02) 301px, transparent 304px),
                 repeating-radial-gradient(circle at center, transparent 0, transparent 450px, rgba(59,130,246,0.015) 451px, transparent 455px),
                 repeating-radial-gradient(circle at 15% 85%, transparent 0, transparent 150px, rgba(59,130,246,0.02) 151px, transparent 153px)
               `
             }}>
        </div>
        <div className="absolute top-0 right-0 w-[950px] h-[950px] bg-blue-500/12 blur-[170px] rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-[1150px] h-[1150px] bg-blue-900/8 blur-[200px] rounded-full"></div>
      </div>

      <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-12 border-b border-slate-200 dark:border-white/5 pb-12 px-4 md:px-0">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20 text-blue-600 dark:text-blue-500 text-[9px] font-black uppercase tracking-[0.3em]">
            <Database className="w-3 h-3" />
            EXTRACTION_CORE_DIRECTORY
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">Source Inventory</h2>
          <p className="text-lg text-slate-500 dark:text-white/40 font-medium leading-relaxed">
            Clinical mapping of {sourceData.length} extraction nodes across the clearnet, deep web, and automated investigative modules.
          </p>
        </div>
      </div>

      <div className="mb-8 px-4 md:px-0">
        <div className="relative group w-full lg:max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/20 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text"
            placeholder="FILTER SOURCES..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-3 bg-white/60 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-white/10 focus:border-blue-600/40 focus:ring-0 w-full backdrop-blur-md"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8 px-4 md:px-0">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${!selectedCategory ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/60 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white backdrop-blur-md'}`}
        >
          Total ({sourceData.length})
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${selectedCategory === cat ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-white/60 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white backdrop-blur-md'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-4 md:px-0">
        {filtered.map((src) => (
          <div 
            key={src.id} 
            onClick={() => handleSourceClick(src)}
            className="group relative flex flex-col gap-4 px-4 lg:px-6 py-4 lg:py-5 bg-white/70 dark:bg-[#0d0d0f]/60 border border-slate-200 dark:border-white/10 rounded-2xl transition-all duration-300 hover:bg-blue-50/50 dark:hover:bg-blue-900/15 hover:border-blue-500/30 dark:hover:border-blue-500/30 cursor-pointer backdrop-blur-3xl shadow-sm dark:shadow-none"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col flex-1 min-w-0 space-y-1">
                <h3 className="text-[12px] lg:text-[13px] font-bold text-slate-900 dark:text-white tracking-widest group-hover:text-blue-600 transition-colors truncate font-mono uppercase">
                  {src.name}
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-[8px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.2em]">{src.category}</span>
                  <div className={`px-2 py-0.5 rounded-lg text-[7px] font-black uppercase tracking-widest border ${
                    src.type === 'onion' ? 'bg-purple-600/10 border-purple-600/20 text-purple-600' :
                    src.type === 'script' ? 'bg-blue-600/10 border-blue-600/20 text-blue-600' :
                    'bg-green-600/10 border-green-600/20 text-green-600'
                  }`}>
                    {src.type}
                  </div>
                </div>
              </div>
              <div className={`p-2 rounded-lg border transition-all ${
                src.type === 'onion' ? 'bg-purple-600/5 border-purple-600/10 text-purple-600' :
                src.type === 'script' ? 'bg-blue-600/5 border-blue-600/10 text-blue-600' :
                'bg-green-600/5 border-green-600/10 text-green-600'
              } group-hover:scale-110`}>
                {src.type === 'onion' ? <Lock className="w-3.5 h-3.5" /> : 
                 src.type === 'script' ? <Terminal className="w-3.5 h-3.5" /> : 
                 <Globe className="w-3.5 h-3.5" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in duration-500">
           <div className="p-8 rounded-full bg-white/60 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 shadow-sm backdrop-blur-md">
              <HelpCircle className="w-12 h-12 text-slate-200 dark:text-white/5" strokeWidth={0.5} />
           </div>
           <div className="space-y-2">
             <h4 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-[0.2em]">No Sources Matched</h4>
             <p className="text-slate-500 dark:text-white/30 text-sm font-medium">No intelligence nodes found matching your current filter parameters.</p>
           </div>
           <button 
             onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
             className="px-8 py-3 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
           >
             Clear Filters
           </button>
        </div>
      )}

      {torTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white dark:bg-[#0a0a0c] border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden">
            <div className="px-8 py-6 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-purple-600" />
                <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight uppercase">Network Warning</h3>
              </div>
              <button onClick={() => setTorTarget(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-3">
                <p className="text-[12px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Tor Protocol Required</p>
                <p className="text-sm text-slate-600 dark:text-white/40 leading-relaxed font-medium">
                  The target node <code className="text-purple-600 font-bold">{torTarget}</code> is only accessible via the Tor network. 
                </p>
              </div>
              <div className="p-4 rounded-xl bg-purple-600/5 border border-purple-600/10 text-[10px] text-purple-600 font-bold uppercase tracking-widest flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Operational Security: Ensure you are using a clinical, hardened browser instance before proceeding.</span>
              </div>
            </div>
            <div className="px-8 py-6 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] flex justify-end gap-3">
              <button onClick={() => setTorTarget(null)} className="px-6 py-2.5 bg-slate-200 dark:bg-white/5 text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest rounded-xl">Close</button>
              <button onClick={() => { window.open(torTarget!, '_blank'); setTorTarget(null); }} className="px-6 py-2.5 bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl shadow-lg shadow-purple-600/20">Launch Instance</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceInventory;