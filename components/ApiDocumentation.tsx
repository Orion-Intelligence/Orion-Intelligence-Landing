import React, { useState } from 'react';
import { Terminal, Code2, Database, Shield, Globe, Search, Command, ChevronRight, Copy, Check, Info, FileJson, Zap, Network, MessageSquare, Share2, Scan, FileText, Smartphone, LayoutGrid, ListFilter, Bug, ShieldAlert, Newspaper, Users, UserCheck } from 'lucide-react';

interface Endpoint {
  id: string;
  name: string;
  method: 'GET' | 'POST';
  path: string;
  description: string;
  params?: string;
  response?: string;
  example: string;
  category: 'Core' | 'Search' | 'Intelligence' | 'Dynamic' | 'Asset' | 'Dossier';
}

const endpoints: Endpoint[] = [
  // --- CORE SYSTEMS ---
  {
    id: 'insight',
    category: 'Core',
    name: 'System Insights',
    method: 'GET',
    path: '/api/system/insight',
    description: 'Retrieve system-wide analytics and high-level intelligence metrics across all monitored sources. Includes document volume, freshness indicators, and graph-style aggregations of top teams and locations.',
    example: `{
  "insights": {
    "general": {
      "document_count": { "key": "Document Count", "value": 14200000000, "change_weekly": "0%", "change_daily": "0%" },
      "url_document_count": { "key": "URL/Document", "value": 451 }
    }
  },
  "latestDocument": { "leak_model": [...], "exploit_model": [], "generic_model": [...] },
  "graph_insight": [true, [{ "aggregation_name": "Top Teams (Leak)", "index": "leak_model", "buckets": [{"key": "BROTHERHOOD", "count": 3}] }]]
}`
  },
  {
    id: 'directory',
    category: 'Core',
    name: 'Source Directory',
    method: 'GET',
    path: '/api/system/directory',
    description: 'Retrieve the complete list of monitored and crawled sources across Clearnet, Onion, and I2P. Supports deep filtering by network layer, index classification, and content type.',
    params: `?page=1&network=onion&index=leak&content_type=hacking&daterange=2025-12-03,2025-12-18`,
    example: `{
  "total": 12345,
  "results": [{
    "url": "http://exampleonionforumabcdef.onion/",
    "content_type": ["forums", "hacking"],
    "index_type": "general",
    "network_type": "onion",
    "name": "Darknet Forum Alpha"
  }]
}`
  },
  {
    id: 'dumps',
    category: 'Core',
    name: 'Dump Catalog',
    method: 'GET',
    path: '/api/system/dumps',
    description: 'Retrieve the complete catalog of breach dumps collected from Telegram channels and monitored websites. Useful for identifying fresh breach drops and unparsed dumps for manual analysis.',
    params: `?page=1&source=telegram&status=parsed&q=enterprise&daterange=2025-01-01,2025-01-15`,
    example: `{
  "total_count": 152,
  "page": 1,
  "mDumpCallbackLinks": [{
    "leak_url": "https://t.me/example_leaks/1234",
    "source": "telegram",
    "group": "threat_group_alpha",
    "parsed_status": "parsed",
    "created_at": "2025-12-03T21:15:23Z"
  }]
}`
  },

  // --- SEARCH ENGINES ---
  {
    id: 'consolidated',
    category: 'Search',
    name: 'Consolidated (Grouped)',
    method: 'POST',
    path: '/api/search/consolidated',
    description: 'Search across all report types (breach/leak, exploit, strategic, chat, social) and return a section-grouped result set. Ideal for driving overview dashboards.',
    params: `{
  "q": "okta",
  "page": 1,
  "network": "all",
  "matchtype": "or",
  "entity_filter": {
    "m_company_name": ["Okta"],
    "m_country": ["US"]
  }
}`,
    example: `{
  "breach": { "total": 2, "results": [...] },
  "exploit": { "total": 1, "results": [...] },
  "social": { "total": 1, "results": [...] }
}`
  },
  {
    id: 'ranked',
    category: 'Search',
    name: 'Unified Ranked Search',
    method: 'POST',
    path: '/api/search/consolidated/ranked',
    description: 'Search the entire database and return a single globally relevance-ranked list of reports without grouping. Optimized for high-speed clinical entity discovery.',
    params: `{ "q": "cyber", "page": 1, "network": "onion" }`,
    example: `{
  "total": 25,
  "results": [{
    "index": "leak_model",
    "score": 12.34,
    "m_title": "Okta customer data leak",
    "m_company_name": "Okta Inc."
  }]
}`
  },
  {
    id: 'breach_search',
    category: 'Search',
    name: 'Breach Search',
    method: 'POST',
    path: '/api/search/breach',
    description: 'Search breach/leak reports aggregated from ransomware blogs, extortion sites, and leak forums. Supports clinical filtering by industry, country, and team.',
    params: `{
  "q": "energy sector",
  "network": "onion",
  "entity_filter": { "m_industry": ["Electricity, Oil & Gas"], "m_country": ["Germany"] }
}`,
    example: `{
  "Result": [{
    "m_title": "Announcement",
    "m_team": "BROTHERHOOD",
    "m_industry": "Agricultural Sector",
    "m_country": ["Germany"]
  }],
  "Page_Count": 1
}`
  },
  {
    id: 'exploit_search',
    category: 'Search',
    name: 'Exploit/CVE Search',
    method: 'POST',
    path: '/api/search/exploit',
    description: 'Search vulnerability intelligence using CVE identifiers, vendors, or affected products. Includes POC links and technical modules.',
    params: `{
  "q": "CVE-2024-12345",
  "entity_filter": { "m_vendor": ["ExampleCorp"], "m_product": ["ExampleServer"] }
}`,
    example: `{
  "total": 87,
  "results": [{
    "m_title": "CVE-2024-12345 RCE in Server",
    "m_exploit_type": ["remote_code_execution"],
    "m_source": "rapid7"
  }]
}`
  },
  {
    id: 'defacement_search',
    category: 'Search',
    name: 'Defacement Search',
    method: 'POST',
    path: '/api/search/defacement',
    description: 'Search defacement reports by keyword, handle, or crew. Useful for tracking hacktivist activity and phishing campaign infrastructure.',
    params: `{ "q": "Hacked by", "attacker": "mthcht", "network": "onion" }`,
    example: `{
  "results": [{
    "m_title": "Hacked by mthcht",
    "m_team": "Alpha Wolf",
    "m_ioc_type": "phishing"
  }]
}`
  },
  {
    id: 'telegram_search',
    category: 'Search',
    name: 'Telegram Search',
    method: 'POST',
    path: '/api/search/telegram',
    description: 'Execute keyword and IOC-aware search over Telegram chat collections (channels, groups, and supergroups) ingested by Orion.',
    params: `{ "q": "ransomware leak", "platform": "telegram", "daterange": "2025-12-01,2025-12-08" }`,
    example: `{
  "results": [{
    "m_channel_name": "Ransomware News",
    "m_content": "New victim announced...",
    "m_message_sharable_link": "https://t.me/..."
  }]
}`
  },
  {
    id: 'stealerlogs',
    category: 'Search',
    name: 'Stealer Logs',
    method: 'POST',
    path: '/api/search/stealerlogs',
    description: 'Search normalized credential records from infostealer logs. Supports full wildcard/substring search over raw credentials and domains.',
    params: `{ "q": "gmail.com", "type": "c", "fullsearch": true }`,
    example: `{
  "Result": [{
    "email": ["uzzalsen2530@gmail.com"],
    "password": "...",
    "domain": ["epicgames.com"]
  }]
}`
  },

  // --- DYNAMIC INTEL ---
  {
    id: 'dynamic_email',
    category: 'Intelligence',
    name: 'Email Exposure Probe',
    method: 'POST',
    path: '/api/dynamic/user/email',
    description: 'Real-time lookup for user identifiers discovered in active dark-web data. Fetches results from external APIs (latency may increase).',
    params: `{ "text": { "email": "investigator@domain.com", "username": "alias_77" } }`,
    example: `{
  "result": [{
    "m_title": "Records Found",
    "m_important_content": "Records were found in a data breach.",
    "m_dumplink": ["Canva", "Breach Compilation"]
  }]
}`
  },
  {
    id: 'dynamic_social',
    category: 'Intelligence',
    name: 'Social Identifier Probe',
    method: 'POST',
    path: '/api/dynamic/social',
    description: 'Perform a dynamic search for social media identifiers to uncover impersonated or exposed dark-net associated accounts.',
    params: `{ "text": { "username": "bitcoin" } }`,
    example: `{
  "result": [{
    "m_title": "User bitcoin found on twitter.com",
    "m_url": "https://twitter.com/bitcoin",
    "m_content_type": ["stolen"]
  }]
}`
  },
  {
    id: 'dynamic_cracked',
    category: 'Intelligence',
    name: 'Cracked App Audit',
    method: 'POST',
    path: '/api/dynamic/cracked',
    description: 'Discover cracked or repackaged mobile application artifacts from high-risk repositories using Google Play Store URLs.',
    params: `{ "text": { "playstore": "https://play.google.com/store/apps/details?id=com.vpn.id" } }`,
    example: `{
  "result": [{
    "m_app_name": "SuperVPN Pro v3.0.3.apk",
    "m_package_id": "com.vpn.id",
    "m_mod_features": "Premium Unlocked"
  }]
}`
  },

  // --- ASSET DISCOVERY ---
  {
    id: 'domain_scan',
    category: 'Asset',
    name: 'Multi-mode Domain Scan',
    method: 'POST',
    path: '/api/discovery/scan',
    description: 'Scan a target domain using Orion scanning engines: Basic (Headers), Advanced (Ports), SEO, or Repo (Exposed Files).',
    params: `{ "domain": "bbc.com", "scanType": "advanced" }`,
    example: `{
  "result": {
    "meta": { "Host": "bbc.com", "Scanned_on_date": "Dec 07, 2025" },
    "grade": "D",
    "threats": { "Headers": [...], "CORS": [...] }
  }
}`
  },

  // --- DOSSIERS & REPORTS ---
  {
    id: 'stix_export',
    category: 'Dossier',
    name: 'STIX 2.1 Export',
    method: 'POST',
    path: '/api/export/stix',
    description: 'Convert any clinical Orion document into a STIX 2.1 standardized investigative bundle containing markings and SCO observables.',
    params: `{ "doc_id": "hash_id", "lang": "en" }`,
    example: `{
  "type": "bundle",
  "spec_version": "2.1",
  "objects": [{ "type": "indicator", "pattern": "[domain-name:value IN ('example.onion')]" }]
}`
  },
  {
    id: 'breach_report',
    category: 'Dossier',
    name: 'Breach Dossier Detail',
    method: 'GET',
    path: '/api/report/breach/{doc_id}',
    description: 'Retrieve detailed report for a specific breach, including full textual content, victim company metadata, and scraper identification.',
    example: `{
  "m_title": "Columbus Healthcare",
  "m_company_name": "Columbus Regional Healthcare",
  "m_screenshot": "6999315431645..."
}`
  },
  {
    id: 'exploit_report',
    category: 'Dossier',
    name: 'Exploit Intelligence',
    method: 'GET',
    path: '/api/report/exploit/{doc_id}',
    description: 'Retrieve technical intelligence for a specific exploit or vulnerability, including code snippets and affected platforms.',
    example: `{
  "m_title": "Windows Registry Persistence",
  "m_code_snippet": ["msf > use exploit/..."],
  "m_platform": ["Windows"]
}`
  },
  {
    id: 'news_report',
    category: 'Dossier',
    name: 'News Intel Report',
    method: 'GET',
    path: '/api/report/news/{doc_id}',
    description: 'Retrieve normalized article text and threat-related insights from external news feeds and high-signal technical blogs.',
    example: `{
  "m_title": "Turning Intel Into Action",
  "m_organization": ["Filigran", "MITRE"],
  "m_important_content": "Cybersecurity transformation through TID..."
}`
  },
  {
    id: 'screenshot',
    category: 'Dossier',
    name: 'Screenshot Access',
    method: 'GET',
    path: '/api/report/breach/screenshot/{filename}',
    description: 'Access the raw WebP screenshot bytes associated with a specific breach or defacement report.',
    example: `HTTP/1.1 200 OK\nContent-Type: image/webp\n[BINARY_DATA]`
  }
];

const ApiDocumentation: React.FC = () => {
  const [activeId, setActiveId] = useState(endpoints[0].id);
  const [copied, setCopied] = useState<string | null>(null);

  const activeEndpoint = endpoints.find(e => e.id === activeId) || endpoints[0];

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const categories = [
    { name: 'Core', icon: Database, label: 'Core Infrastructure' },
    { name: 'Search', icon: LayoutGrid, label: 'Investigation Engines' },
    { name: 'Intelligence', icon: Zap, label: 'Dynamic Probes' },
    { name: 'Asset', icon: Scan, label: 'Infrastructure Discovery' },
    { name: 'Dossier', icon: FileText, label: 'Reports & Export' }
  ];

  return (
    <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-80px)] lg:overflow-hidden animate-in fade-in duration-700">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-80 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-black/20 overflow-y-auto no-scrollbar flex flex-col">
        <div className="p-8 border-b border-slate-200 dark:border-white/5 bg-white/[0.01]">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-500 mb-2">
            <Code2 className="w-5 h-5" />
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Protocol V4.2.0</span>
          </div>
          <p className="text-[9px] text-slate-400 dark:text-white/30 uppercase tracking-widest font-black">Orion Intelligence Core</p>
        </div>

        <nav className="flex-1 p-6 space-y-10 lg:pb-20">
          {categories.map(cat => (
            <div key={cat.name} className="space-y-4">
              <div className="flex items-center gap-3 px-2">
                <cat.icon className="w-3.5 h-3.5 text-slate-300 dark:text-white/20" />
                <h4 className="text-[9px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-[0.2em]">{cat.label}</h4>
              </div>
              <div className="space-y-1">
                {endpoints.filter(e => e.category === cat.name).map(e => (
                  <button
                    key={e.id}
                    onClick={() => setActiveId(e.id)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-between group ${
                      activeId === e.id ? 'bg-blue-600/10 dark:bg-blue-600/10 text-blue-600 dark:text-white border border-blue-600/20 dark:border-blue-500/20 shadow-lg shadow-blue-500/5' : 'text-slate-500 dark:text-white/40 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.02] border border-transparent'
                    }`}
                  >
                    <span className="truncate">{e.name}</span>
                    <ChevronRight className={`w-3 h-3 shrink-0 transition-transform ${activeId === e.id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'}`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="hidden lg:block p-6 border-t border-slate-200 dark:border-white/5 bg-white/[0.01]">
           <div className="flex items-center gap-3 p-4 rounded-xl bg-blue-600/5 dark:bg-blue-500/5 border border-blue-600/10 dark:border-blue-500/10">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
              <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-none">GRID STATUS: PRODUCTION</span>
           </div>
        </div>
      </aside>

      {/* Main Documentation Area */}
      <main className="flex-1 overflow-y-auto bg-white dark:bg-[#0a0a0c] p-6 lg:p-20 no-scrollbar">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="mb-12 lg:mb-16 space-y-6 lg:space-y-8">
            <div className="flex flex-wrap items-center gap-3 lg:gap-4">
              <span className={`px-3 lg:px-4 py-1.5 rounded-lg text-[9px] lg:text-[10px] font-black uppercase tracking-widest border shadow-lg ${
                activeEndpoint.method === 'GET' ? 'bg-blue-600/10 text-blue-600 border-blue-600/20' : 'bg-green-600/10 text-green-600 border-green-600/20'
              }`}>
                {activeEndpoint.method}
              </span>
              <code className="text-[10px] lg:text-xs font-mono text-slate-700 dark:text-white/80 bg-slate-100 dark:bg-white/5 px-4 lg:px-5 py-2 rounded-xl border border-slate-200 dark:border-white/10 shadow-inner truncate max-w-full">
                {activeEndpoint.path}
              </code>
            </div>
            <div className="space-y-4">
              <h1 className="text-3xl lg:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">{activeEndpoint.name}</h1>
              <p className="text-base lg:text-xl text-slate-500 dark:text-white/40 leading-relaxed font-medium max-w-4xl">
                {activeEndpoint.description}
              </p>
            </div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
            {/* Left Panel: Request Details */}
            <div className="space-y-8 lg:space-y-12">
              <section className="space-y-4 lg:space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl">
                    <Info className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                  </div>
                  <h3 className="text-[10px] lg:text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">Clinical Authorization</h3>
                </div>
                <div className="p-6 lg:p-8 rounded-3xl bg-slate-50 dark:bg-white/[0.02] border border-slate-200 dark:border-white/5 space-y-6 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <p className="text-sm text-slate-600 dark:text-white/40 leading-relaxed font-medium">
                    Requests require an <code className="text-blue-600 dark:text-blue-400 bg-blue-600/10 dark:bg-blue-500/10 px-2 py-0.5 rounded">X-Orion-Key</code> header. Development keys are restricted to clinical use only.
                  </p>
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-slate-300 dark:text-white/20 uppercase tracking-widest block">Shell Interface</span>
                    <div className="font-mono text-[10px] lg:text-[11px] text-blue-700 dark:text-blue-400/80 bg-slate-100 dark:bg-black/60 p-5 rounded-2xl border border-slate-200 dark:border-white/5 leading-relaxed overflow-x-auto no-scrollbar shadow-inner">
                      curl -X {activeEndpoint.method} \<br />
                      &nbsp;&nbsp;-H "X-Orion-Key: $ORION_API_KEY" \<br />
                      &nbsp;&nbsp;{activeEndpoint.path}
                    </div>
                  </div>
                </div>
              </section>

              {activeEndpoint.params && (
                <section className="space-y-4 lg:space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl">
                      <Terminal className="w-4 h-4 text-blue-600 dark:text-blue-500" />
                    </div>
                    <h3 className="text-[10px] lg:text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">Investigation Parameters</h3>
                  </div>
                  <div className="relative group">
                    <div className="absolute -inset-1 bg-gradient-to-br from-blue-600/20 dark:from-blue-500/20 to-transparent rounded-[2rem] blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <button 
                      onClick={() => handleCopy(activeEndpoint.params!, 'params')}
                      className="absolute top-4 lg:top-6 right-4 lg:right-6 p-2 rounded-xl bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-500 dark:text-white/20 hover:text-slate-900 dark:hover:text-white transition-all z-10 border border-slate-300 dark:border-white/5"
                    >
                      {copied === 'params' ? <Check className="w-3 h-3 text-green-600 dark:text-green-500" /> : <Copy className="w-3 h-3" />}
                    </button>
                    <pre className="relative p-6 lg:p-10 rounded-[2rem] bg-slate-100 dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/10 text-[10px] lg:text-[11px] font-mono text-blue-700 dark:text-blue-300/90 overflow-x-auto no-scrollbar leading-[1.8] shadow-2xl dark:shadow-none">
                      {activeEndpoint.params}
                    </pre>
                  </div>
                </section>
              )}

              {/* Extraction Feature Notice */}
              <section className="p-6 lg:p-8 rounded-3xl bg-green-600/5 dark:bg-green-500/5 border border-green-600/10 dark:border-green-500/10 space-y-4">
                <div className="flex items-center gap-3 text-green-600 dark:text-green-500">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Heuristic Extraction Active</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-white/30 leading-relaxed font-medium">
                  Responses may include automatically extracted Indicators of Compromise (IOCs). Only fields with active data are returned (e.g. `m_cve`, `m_ip`, `m_yara_rule`).
                </p>
              </section>
            </div>

            {/* Right Panel: Example Response */}
            <div className="space-y-6 lg:space-y-8 sticky top-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-xl">
                  <FileJson className="w-4 h-4 text-green-600 dark:text-green-500" />
                </div>
                <h3 className="text-[10px] lg:text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.25em]">Response Schema</h3>
              </div>
              
              <div className="relative group">
                <div className="absolute inset-0 bg-blue-600/5 dark:bg-blue-500/5 blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                <button 
                  onClick={() => handleCopy(activeEndpoint.example, 'example')}
                  className="absolute top-4 lg:top-6 right-4 lg:right-6 p-2 rounded-xl bg-slate-200 dark:bg-white/5 hover:bg-slate-300 dark:hover:bg-white/10 text-slate-500 dark:text-white/20 hover:text-slate-900 dark:hover:text-white transition-all z-10 border border-slate-300 dark:border-white/5"
                >
                  {copied === 'example' ? <Check className="w-3 h-3 text-green-600 dark:text-green-500" /> : <Copy className="w-3 h-3" />}
                </button>
                <div className="relative p-[1px] bg-gradient-to-br from-slate-200 dark:from-white/10 via-slate-100 dark:via-white/5 to-transparent rounded-[2.5rem] shadow-2xl">
                  <div className="p-6 lg:p-10 rounded-[2.45rem] bg-slate-50 dark:bg-[#0c0c0e] border border-slate-200 dark:border-white/5">
                    <pre className="text-[10px] lg:text-[11px] font-mono text-slate-700 dark:text-white/70 overflow-x-auto no-scrollbar leading-loose">
                      {activeEndpoint.example}
                    </pre>
                  </div>
                </div>
              </div>

              <div className="p-6 lg:p-8 rounded-3xl bg-blue-600/[0.03] dark:bg-blue-500/[0.03] border border-blue-600/10 dark:border-blue-500/10 flex items-start gap-6">
                <Shield className="w-6 h-6 text-blue-600 dark:text-blue-500 shrink-0" />
                <div className="space-y-2">
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest">Clinical Governance</span>
                  <p className="text-[10px] lg:text-[11px] text-slate-500 dark:text-white/40 leading-relaxed font-medium">
                    Data returned by the API is cross-referenced with 14.2B records. TLP:AMBER protocols apply to all non-public clinical identifiers discovered.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ApiDocumentation;