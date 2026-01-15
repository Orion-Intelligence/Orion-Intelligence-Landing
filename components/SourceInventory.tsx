
import React, { useState, useMemo } from 'react';
import { 
  Globe, Search, Terminal, Database, ShieldAlert, Lock, 
  ExternalLink, ChevronRight, Fingerprint, AlertTriangle, X
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
    '47glxkuxyayqrvugfumgsblrdagvrah7gttfscgzn56eyss5wg3uvmqd.onion', 'akiral2iz6a7qgd3ayp3l6yub7xx2uep76idk3u2kollpj5z3z636bad.onion',
    'arcuufpr5xxbbkin4mlidt7itmr6znlppk63jbtkeguuhszmc5g7qdyd.onion', 'basheqtvzqwz4vp6ks5lm2ocq7i6tozqgf6vjcasj4ezmsy4bkpshhyd.onion',
    'bertblogsoqmm4ow7nqyh5ik7etsmefdbf25stauecytvwy7tkgizhad.onion', 'black3gnkizshuynieigw6ejgpblb53mpasftzd6pydqpmq2vn2xf6yd.onion',
    'blogvl7tjyjvsfthobttze52w36wwiz34hrfcmorgvdzb6hikucb7aqd.onion', 'business_data_leaks', 'cicadabv7vicyvgz5khl7v2x5yygcgow7ryyy6yppwmxii4eoobdaztqd.onion',
    'csidb', 'darkfeed', 'darkleakyqmv62eweqwy4dnhaijg4m4dkburo73pzuqfdumcntqdokyd.onion',
    'dataleakypypu7uwblm5kttv726l3iripago6p336xjnbstkjwrlnlid.onion', 'ddosecrets', 'ebhmkoohccl45qesdbvrjqtyro2hmhkmh6vkyfyjjzfllm3ix72aqaid.onion',
    'flock4cvoeqm4c62gyohvmncx6ck2e7ugvyqgyxqtrumklhd5ptwzpqd.onion', 'github_doormanbreach', 'gunrabxbig445sjqa535uaymzerj6fp4nwc6ngc2xughf2pedjdhk4ad.onion',
    'handala_hack', 'hptqq2o2qjva7lcaaq67w36jihzivkaitkexorauw7b2yul2z6zozpqd.onion',
    'hunters55atbdusuladzv7vzv6a423bkh6ksl2uftwrxyuarbzlfh7yd.onion', 'ijzn3sicrcy7guixkzjkib4ukbiilwc3xhnmby4mcbccnsd7j2rekvqd.onion',
    'imncrewwfkbjkhr2oylerfm5qtbzfphhmpcfag43xc2k2kfgvluqtlgoid.onion', 'incblog6qu4y4mm4zvw5nrmue6qbwtgjsxpw6b7ixzssu36tsajldoad.onion',
    'intelrepository', 'j3dp6okmaklajrsk6zljl5sfa2vpui7j2w6cwmhmmqhab6frdfbphhid.onion',
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
    <div className="py-12 animate-in fade-in duration-700">
      <div className="flex flex-col lg:flex-row justify-between items-end gap-10 mb-12 border-b border-slate-200 dark:border-white/5 pb-12">
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-blue-600/10 dark:bg-blue-500/10 border border-blue-600/20 dark:border-blue-500/20 text-blue-600 dark:text-blue-500 text-[9px] font-bold uppercase tracking-[0.3em]">
            <Database className="w-3 h-3" />
            Extraction Core Directory
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[1.1]">Source Inventory.</h2>
          <p className="text-lg text-slate-500 dark:text-white/40 font-medium leading-relaxed">
            Clinical mapping of {sourceData.length} extraction nodes across the clearnet, deep web, and automated investigative modules.
          </p>
        </div>
        
        <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-white/20 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text"
              placeholder="FILTER SOURCES..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 pr-6 py-3 bg-slate-100 dark:bg-white/[0.03] border border-slate-200 dark:border-white/10 rounded-xl text-[10px] font-bold text-slate-900 dark:text-white uppercase tracking-widest focus:outline-none focus:border-blue-600/40 w-full lg:w-64 transition-all placeholder:text-slate-400 dark:placeholder:text-white/10"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-8">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${!selectedCategory ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white'}`}
        >
          Total ({formattedSources.length})
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-5 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all border ${selectedCategory === cat ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' : 'bg-slate-100 dark:bg-white/[0.03] border-slate-200 dark:border-white/10 text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* List Header */}
      <div className="hidden lg:grid grid-cols-12 gap-6 px-8 py-4 mb-4 text-[10px] font-black text-slate-400 dark:text-white/20 uppercase tracking-[0.3em] border-b border-slate-200 dark:border-white/5">
        <div className="col-span-1">Modality</div>
        <div className="col-span-4">Source Identity</div>
        <div className="col-span-3">System Identifier</div>
        <div className="col-span-2 text-center">Category</div>
        <div className="col-span-2 text-right">Action</div>
      </div>

      <div className="flex flex-col gap-2">
        {filtered.map((src) => (
          <div 
            key={src.id} 
            onClick={() => handleSourceClick(src)}
            className="group flex flex-col lg:grid lg:grid-cols-12 items-center gap-6 px-8 py-5 bg-white dark:bg-[#0d0d0f] border border-slate-100 dark:border-white/10 hover:border-blue-600/30 dark:hover:border-blue-500/30 rounded-2xl transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-[#111113] shadow-sm dark:shadow-none"
          >
            <div className="col-span-1 flex justify-center lg:justify-start">
               <div className={`p-2.5 rounded-xl border transition-colors ${
                  src.type === 'onion' ? 'bg-purple-600/10 border-purple-600/20 text-purple-600' :
                  src.type === 'website' ? 'bg-green-600/10 border-green-600/20 text-green-600' :
                  'bg-blue-600/10 border-blue-600/20 text-blue-600'
                }`}>
                  {src.type === 'onion' ? <Lock className="w-4 h-4" /> : 
                   src.type === 'website' ? <Globe className="w-4 h-4" /> : 
                   <Terminal className="w-4 h-4" />}
               </div>
            </div>

            <div className="col-span-4 space-y-1 w-full text-center lg:text-left">
              <h3 className="text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors tracking-widest font-mono truncate">
                {src.name}
              </h3>
              <div className="flex items-center justify-center lg:justify-start gap-2">
                <div className={`w-1.5 h-1.5 rounded-full ${src.type === 'onion' ? 'bg-purple-600' : src.type === 'website' ? 'bg-green-600' : 'bg-blue-600'} opacity-40`}></div>
                <span className="text-[10px] font-bold text-slate-400 dark:text-white/20 uppercase tracking-widest">
                  {src.type === 'onion' ? 'Hidden Service' : src.type === 'website' ? 'Clearnet Node' : 'Module'}
                </span>
              </div>
            </div>

            <div className="col-span-3 w-full text-center lg:text-left">
              <code className="text-[10px] text-slate-500 dark:text-white/30 font-mono uppercase tracking-tighter truncate opacity-80 bg-slate-50 dark:bg-white/[0.02] px-3 py-1 rounded-lg border border-slate-100 dark:border-white/5">
                {src.original}
              </code>
            </div>

            <div className="col-span-2 flex justify-center">
              <span className="px-4 py-1 rounded-full bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/5 text-[9px] font-black text-slate-400 dark:text-white/40 uppercase tracking-[0.2em] group-hover:text-blue-600 group-hover:border-blue-600/20 transition-all">
                {src.category}
              </span>
            </div>

            <div className="col-span-2 flex justify-center lg:justify-end">
              <div className="flex items-center gap-3 text-slate-300 dark:text-white/10 group-hover:text-blue-600 transition-colors">
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0">
                  {src.type === 'script' ? 'Inspect Module' : 'Open Remote'}
                </span>
                <div className="p-2 rounded-lg bg-slate-100 dark:bg-white/5 group-hover:bg-blue-600/10 transition-colors">
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {torTarget && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-full max-w-lg bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-white/10 rounded-[2.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden">
            <div className="px-10 py-8 border-b border-slate-100 dark:border-white/5 flex items-center justify-between bg-slate-50 dark:bg-white/[0.02]">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-600/10 dark:bg-purple-500/10 border border-purple-600/20 dark:border-purple-500/20">
                  <ShieldAlert className="w-6 h-6 text-purple-600 dark:text-purple-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight uppercase">Security Advisory</h3>
              </div>
              <button onClick={() => setTorTarget(null)} className="p-2 hover:bg-slate-100 dark:hover:bg-white/5 rounded-full transition-colors text-slate-400 dark:text-white/40 hover:text-slate-900 dark:hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-10 space-y-6">
              <div className="flex items-start gap-4 p-5 bg-purple-600/5 dark:bg-purple-500/5 border border-purple-600/10 dark:border-purple-500/10 rounded-2xl">
                <AlertTriangle className="w-5 h-5 text-purple-600 dark:text-purple-500 shrink-0 mt-0.5" />
                <div className="space-y-2">
                  <p className="text-slate-900 dark:text-white font-bold text-[11px] uppercase tracking-widest">Onion Protocol Detected</p>
                  <p className="text-slate-500 dark:text-white/60 text-sm leading-relaxed">
                    Accessing hidden services requires the Tor network. This link will not resolve in clear-web browsers unless configured with a Tor proxy.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-slate-400 dark:text-white/30 uppercase tracking-[0.3em]">Required Client</h4>
                <div className="p-5 bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 rounded-2xl flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-slate-200 dark:bg-white/5">
                      <Fingerprint className="w-5 h-5 text-slate-500 dark:text-white/40" />
                    </div>
                    <span className="text-sm text-slate-900 dark:text-white font-bold uppercase tracking-widest">Tor Browser v13+</span>
                  </div>
                  <a href="https://www.torproject.org/" target="_blank" rel="noopener noreferrer" className="text-[9px] font-black text-blue-600 hover:underline uppercase tracking-widest">Download</a>
                </div>
              </div>
            </div>

            <div className="px-10 py-8 border-t border-slate-100 dark:border-white/5 bg-slate-50 dark:bg-white/[0.01] flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => { window.open(torTarget, '_blank'); setTorTarget(null); }}
                className="flex-1 px-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-black text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-800 dark:hover:bg-blue-50 transition-all flex items-center justify-center gap-3 active:scale-95 shadow-lg"
              >
                Open Anyway
                <ExternalLink className="w-4 h-4 opacity-40" />
              </button>
              <button 
                onClick={() => setTorTarget(null)}
                className="flex-1 px-8 py-4 bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-900 dark:text-white text-[11px] font-black uppercase tracking-widest rounded-xl transition-all active:scale-95"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="py-32 flex flex-col items-center justify-center text-center space-y-6">
           <div className="p-6 rounded-full bg-slate-100 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5">
              <Terminal className="w-12 h-12 text-slate-300 dark:text-white/10" />
           </div>
           <div className="space-y-2">
             <h4 className="text-xl font-bold text-slate-900 dark:text-white uppercase tracking-widest">No Sources Matched</h4>
             <p className="text-slate-500 dark:text-white/30 text-sm">No items found matching your current search parameters.</p>
           </div>
           <button 
             onClick={() => { setSearchTerm(''); setSelectedCategory(null); }}
             className="px-8 py-3 bg-blue-600 text-white text-[11px] font-bold uppercase tracking-widest rounded-xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/20"
           >
             Clear Filters
           </button>
        </div>
      )}
    </div>
  );
};

export default SourceInventory;
