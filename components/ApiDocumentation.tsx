
import React, { useState } from 'react';
import { Terminal, Database, Shield, Globe, Search, Command, ChevronRight, Copy, Check, Info, FileJson, Zap, Network, MessageSquare, Share2, Scan, FileText, Smartphone, LayoutGrid, ListFilter, Bug, ShieldAlert, Newspaper, Users, UserCheck } from 'lucide-react';

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
    id: 'login',
    category: 'Core',
    name: 'Login and Session Cookie',
    method: 'POST',
    path: '/api/token',
    description: 'Authenticates a user with OAuth2 form fields and returns the session payload. When 2FA is not required, the backend also sets the httpOnly access cookie. Protected routes accept Authorization: Bearer tokens or the access cookie.',
    params: `Content-Type: application/x-www-form-urlencoded

username=analyst@orionintelligence.org
password=********`,
    example: `{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "twofa_required": false,
  "user": {
    "email": "analyst@orionintelligence.org",
    "role": "analyst"
  }
}`
  },
  {
    id: 'auth_flow',
    category: 'Core',
    name: 'Auth Flow Helpers',
    method: 'POST',
    path: '/api/token/refresh | /api/token/2fa/verify | /api/logout',
    description: 'Session helpers from auth_routes.py. Refresh keeps browser sessions alive, 2FA verification completes a pending login, and logout clears the session cookie.',
    params: `POST /api/token/refresh
POST /api/token/2fa/verify
POST /api/logout`,
    example: `{
  "access_token": "eyJ...",
  "token_type": "bearer",
  "twofa_required": false
}`
  },
  {
    id: 'insight',
    category: 'Core',
    name: 'System Insights',
    method: 'GET',
    path: '/api/insight',
    description: 'Returns system analytics, latest documents, country insights, and source-level intelligence metrics for the Orion workspace. This route is documented in backend/routes/docs/docs.py.',
    example: `{
  "insights": {
    "general": {
      "document_count": {
        "key": "Document Count",
        "value": 57,
        "change_weekly": "0%",
        "change_daily": "0%"
      }
    }
  },
  "latestDocument": {
    "leak_model": [],
    "exploit_model": [],
    "chat_model": []
  },
  "country_insight": []
}`
  },
  {
    id: 'directory',
    category: 'Core',
    name: 'Source Directory',
    method: 'GET',
    path: '/api/directory',
    description: 'Returns monitored sources across clearnet, onion, and i2p networks. Supports filters for network layer, index type, content type, text search, and date range.',
    params: `?page=1&network=onion&index=leak&content_type=hacking&daterange=2025-12-03,2025-12-18`,
    example: `{
  "total": 12345,
  "page": 1,
  "results": [{
    "url": "http://exampleonionforumabcdef.onion/",
    "content_type": ["forums", "hacking"],
    "index_type": "general",
    "network_type": "onion",
    "name": "Example Darknet Forum"
  }]
}`
  },
  {
    id: 'dumps',
    category: 'Core',
    name: 'Dump Catalog',
    method: 'GET',
    path: '/api/dumps',
    description: 'Returns breach dump records collected from Telegram channels and monitored websites. Supports source, group, parsed status, date range, and text search filters.',
    params: `?page=1&source=telegram&status=parsed&q=enterprise&daterange=2025-01-01,2025-01-15`,
    example: `{
  "total_count": 152,
  "page": 1,
  "mDumpCallbackLinks": [{
    "leak_url": "https://t.me/example_leaks/1234",
    "source": "telegram",
    "group": "example_leak_group",
    "parsed_status": "parsed",
    "created_at": "2025-12-03T21:15:23Z"
  }]
}`
  },
  {
    id: 'route_coverage',
    category: 'Core',
    name: 'Audited Route Coverage',
    method: 'GET',
    path: '/api/*',
    description: 'This documentation was updated from the Orion backend route decorators and docs helper files. Audited sources include admin_routes.py, ai_routes.py, api_micros.py, api_routes.py, auth_routes.py, case_routes.py, crawl_routes.py, geo_fencing_routes.py, public_api_routes.py, social_routes.py, tenant_routes.py, test_routes.py, docs/docs.py, and helper/route_test_helper.py.',
    example: `{
  "total_audited_routes": 235,
  "files": {
    "api_routes.py": 57,
    "auth_routes.py": 12,
    "ai_routes.py": 8,
    "case_routes.py": 13,
    "crawl_routes.py": 30,
    "geo_fencing_routes.py": 16,
    "public_api_routes.py": 9,
    "social_routes.py": 13,
    "tenant_routes.py": 30,
    "admin_routes.py": 6,
    "api_micros.py": 1,
    "test_routes.py": 40
  }
}`
  },

  // --- SEARCH ENGINES ---
  {
    id: 'consolidated',
    category: 'Search',
    name: 'Consolidated Search',
    method: 'POST',
    path: '/api/search/consolidated',
    description: 'Searches multiple report collections and returns grouped results across breach, strategic, exploit, social, chat, and related intelligence sources.',
    params: `{
  "q": "okta",
  "page": 1,
  "network": "all",
  "matchtype": "or",
  "entity_filter": {
    "m_company_name": ["Okta"]
  }
}`,
    example: `{
  "breach": { "total": 2, "results": [] },
  "exploit": { "total": 1, "results": [] },
  "social": { "total": 1, "results": [] }
}`
  },
  {
    id: 'ranked',
    category: 'Search',
    name: 'Strategic Ranked Search',
    method: 'POST',
    path: '/api/search/strategic',
    description: 'Searches strategic intelligence reports and returns ranked results from the general intelligence indexes. Demo or free-token sessions are constrained by backend safe-search behavior.',
    params: `{ "q": "cyber", "page": 1, "network": "onion", "category": "all" }`,
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
    id: 'vertical_search',
    category: 'Search',
    name: 'Vertical Report Search',
    method: 'POST',
    path: '/api/search/{strategic|breach|social|exploit|defacement}',
    description: 'Runs a focused search against one report family. Available verticals are strategic, breach, social, exploit, and defacement. Detail routes follow /api/search/{type}/{doc_id}.',
    params: `POST /api/search/breach

{
  "q": "energy sector",
  "page": 1,
  "network": "onion",
  "entity_filter": {
    "m_country": ["Germany"]
  }
}`,
    example: `{
  "Result": [{
    "m_title": "Victim announcement",
    "m_team": "Example Group",
    "m_country": ["Germany"]
  }],
  "Page_Count": 1
}`
  },
  {
    id: 'consolidated_ioc',
    category: 'Search',
    name: 'IOC Consolidated Search',
    method: 'POST',
    path: '/api/search/consolidated/ioc',
    description: 'Searches consolidated intelligence through IOC-oriented fields and returns matching records across supported Orion collections.',
    params: `{
  "q": "orionintelligence.org",
  "page": 1,
  "network": "all",
  "matchtype": "or"
}`,
    example: `{
  "results": [{
    "m_title": "Infrastructure mention",
    "m_url": "https://try.orionintelligence.org/reports/infrastructure-mention",
    "m_iocs": ["orionintelligence.org"]
  }],
  "total": 1
}`
  },
  {
    id: 'stealerlogs',
    category: 'Search',
    name: 'Public Email Exposure Check',
    method: 'GET',
    path: '/api/search/stealerlogs',
    description: 'Public endpoint from public_api_routes.py. Checks whether an email address appears in monitored stealer-log data and returns a summarized exposure score for the homepage audit flow.',
    params: `?q=analyst@orionintelligence.org`,
    example: `{
  "breach_found": true,
  "total_exposures": 7,
  "unique_channels": 3,
  "unique_types": 4,
  "primary_channel": "telegram",
  "primary_type": "credential",
  "risk_score": 82,
  "severity": "high"
}`
  },
  {
    id: 'stix_export',
    category: 'Search',
    name: 'STIX Export and Conversion',
    method: 'GET',
    path: '/api/search/{type}/stix/{doc_id}',
    description: 'Exports supported Orion documents as STIX 2.1. Supported document types include breach, strategic, defacement, exploit, social, chat, and news. Conversion helpers are available at /api/stix/convert/{kind} and /api/stix/convert/{kind}/batch.',
    params: `GET /api/search/breach/stix/{doc_id}?lang=en

POST /api/stix/convert/{kind}
POST /api/stix/convert/{kind}/batch`,
    example: `{
  "type": "bundle",
  "spec_version": "2.1",
  "objects": [{
    "type": "indicator",
    "pattern": "[domain-name:value = 'orionintelligence.org']"
  }]
}`
  },

  // --- DYNAMIC INTEL ---
  {
    id: 'dynamic_user',
    category: 'Intelligence',
    name: 'Dynamic Entity Scans',
    method: 'POST',
    path: '/api/dynamic/{user|cracked|software|social|wanted|national-identity}',
    description: 'Runs live checks for user exposure, cracked/software credentials, social identifiers, wanted-person records, and national identity lookups. The backend records search audit events and applies scan limits.',
    params: `POST /api/dynamic/user

{
  "text": {
    "email": "analyst@orionintelligence.org",
    "username": "orion_analyst"
  }
}`,
    example: `{
  "result": [{
    "m_title": "Records Found",
    "m_important_content": "Records were found in a breach source.",
    "m_dumplink": ["Credential breach source"]
  }]
}`
  },
  {
    id: 'ai_routes',
    category: 'Intelligence',
    name: 'AI and Nexus Chat',
    method: 'POST',
    path: '/api/nexus/chat',
    description: 'Provides AI-assisted report chat, workspace chat, text analysis, and optional AI parsing and summarization. Feature gates are enforced for AI parse and summarize routes.',
    params: `POST /api/nexus/chat

{
  "message": "Summarize this report and list affected entities.",
  "context": {
    "doc_id": "report-id"
  }
}`,
    example: `{
  "result": {
    "response": "Summary and entity list..."
  },
  "status": "done"
}`
  },
  {
    id: 'social_routes',
    category: 'Intelligence',
    name: 'Social Reconnaissance',
    method: 'POST',
    path: '/api/social/{recon|phone/recon|profile|online/images|recon/image|followers|following|posts|entity|metadata}',
    description: 'Runs social profile, image, phone, follower, following, post, entity, and metadata collection workflows from social_routes.py. Session tab routes support persisted graph workspaces.',
    params: `POST /api/social/recon

{
  "username": "example_alias",
  "platform": "x"
}`,
    example: `{
  "result": {
    "profiles": [],
    "confidence": "medium"
  }
}`
  },
  {
    id: 'satellite_routes',
    category: 'Intelligence',
    name: 'Geo, Map, and Satellite Intelligence',
    method: 'POST',
    path: '/api/satellite/*',
    description: 'Provides map entity streaming, threat lens search, geocoding, facilities lookup, Sentinel imagery, anomaly comparison, and live aircraft or ship tracking from geo_fencing_routes.py.',
    params: `POST /api/satellite/geocode

{
  "query": "Lahore, Pakistan"
}`,
    example: `{
  "lat": 31.5204,
  "lon": 74.3587,
  "label": "Lahore, Pakistan"
}`
  },

  // --- ASSET DISCOVERY ---
  {
    id: 'urlscan',
    category: 'Asset',
    name: 'Domain and Infrastructure Scans',
    method: 'POST',
    path: '/api/urlscan/{domain|subdomains|dns|wayback|ip}',
    description: 'Scans domains, subdomains, DNS records, Wayback data, and IP addresses for exposure and infrastructure context. These routes apply active-user checks and scan limits.',
    params: `POST /api/urlscan/domain

{
  "domain": "orionintelligence.org",
  "scanType": "advanced"
}`,
    example: `{
  "result": {
    "meta": {
      "Host": "orionintelligence.org",
      "Scanned_on_date": "2026-06-03"
    },
    "grade": "B",
    "threats": {
      "Headers": [],
      "CORS": []
    }
  }
}`
  },
  {
    id: 'netintel',
    category: 'Asset',
    name: 'Network Intelligence',
    method: 'POST',
    path: '/api/netintel/{resolve_ip|ipscanner|url_vulnerability_scan|iot_detect|camera_detect_ranges}',
    description: 'Resolves IP metadata, performs deeper IP scans, checks URL vulnerabilities, and runs IoT or camera exposure detection. IoT and camera range detection routes live in geo_fencing_routes.py.',
    params: `POST /api/netintel/resolve_ip

{
  "ip": "8.8.8.8"
}`,
    example: `{
  "ip": "8.8.8.8",
  "asn": "AS15169",
  "country": "US",
  "provider": "Google"
}`
  },
  {
    id: 'crawler_indexing',
    category: 'Asset',
    name: 'Crawler and Indexing Routes',
    method: 'POST',
    path: '/api/index/{leak|news|tracking|exploit|defacement|generic|chat|social|swarm|sanctions|entity|dump|stealerlog}',
    description: 'Ingests crawler output and feeder data into Orion indexes, including leak, news, tracking, exploit, chat, social, dump, and stealer-log records. Feeder script management routes are under /api/profile/feeder/*.',
    params: `POST /api/index/leak

{
  "m_title": "Victim announcement",
  "m_url": "https://source.example/report",
  "m_content": "Collected source content"
}`,
    example: `{
  "status": "success",
  "indexed": 1
}`
  },

  // --- DOSSIERS & REPORTS ---
  {
    id: 'cases',
    category: 'Dossier',
    name: 'Case Management',
    method: 'GET',
    path: '/api/profile/cases',
    description: 'Creates and manages investigation cases, case sharing, assigned analysts, and artifact files. Artifact upload, view, download, and delete routes are scoped under /api/profile/cases/{case_id}/artifacts/{artifact_id}/file.',
    params: `GET /api/profile/cases

POST /api/profile/cases
{
  "title": "Executive exposure review",
  "description": "Investigate leaked credentials and related infrastructure."
}`,
    example: `{
  "cases": [{
    "case_id": "CASE-00042",
    "title": "Executive exposure review",
    "status": "open",
    "artifacts": []
  }]
}`
  },
  {
    id: 'tenant_admin',
    category: 'Dossier',
    name: 'Tenant and Admin Routes',
    method: 'GET',
    path: '/api/get/tenant | /api/update/tenants | /api/users | /admin/api/*',
    description: 'Tenant routes manage organization settings, users, chat shares, tenant images, user images, audit logs, alerts, and role-aware workspace controls. Admin routes support system row-action checks, user status edits, public config updates, and system images.',
    params: `POST /api/get/tenant
POST /api/update/tenants
POST /api/users
POST /api/tenant/create/user
POST /api/audit/logs
GET /api/profile/alerts
GET /admin/api/db_system_model/row-action
POST /admin/api/db_user_account/edit/{id}`,
    example: `{
  "tenant": {
    "id": "tenant-id",
    "name": "Example Enterprise"
  },
  "users": [],
  "invitations": []
}`
  },
  {
    id: 'public_api',
    category: 'Dossier',
    name: 'Public API Routes',
    method: 'GET',
    path: '/api/public/*',
    description: 'Public routes expose selected safe surfaces such as public case-share access and email exposure checks. These routes avoid returning full protected workspace records.',
    params: `GET /api/public/case-shares/{share_id}
GET /api/search/stealerlogs?q=analyst@orionintelligence.org`,
    example: `{
  "share": {
    "case_id": "CASE-00042",
    "title": "Shared investigation"
  },
  "access": "public-share"
}`
  },
  {
    id: 'test_helper',
    category: 'Dossier',
    name: 'Test and Mock Routes',
    method: 'GET',
    path: '/api/test/*',
    description: 'test_routes.py and helper/route_test_helper.py provide mock and pending responses for scanner, social, geo, and workflow routes when TESTING_ENABLED=1. They are intended for development and route verification only.',
    params: `TESTING_ENABLED=1

GET /api/test/*
POST /api/test/*`,
    example: `{
  "status": "pending",
  "message": "Mock route response generated by route_test_helper.py",
  "testing_enabled": true
}`
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

  const primaryPath = activeEndpoint.path.split('|')[0].trim();
  const publicEndpointIds = ['login', 'stealerlogs', 'public_api'];
  const isPublicEndpoint = publicEndpointIds.includes(activeEndpoint.id);
  const isTestingEndpoint = activeEndpoint.id === 'test_helper';
  const authMode = isTestingEndpoint ? 'Testing mode' : isPublicEndpoint ? 'Public endpoint' : 'Bearer token or access cookie';
  const authText = isTestingEndpoint
    ? 'Mock helper routes are available only when TESTING_ENABLED=1 is enabled in the backend environment.'
    : isPublicEndpoint
      ? 'This route is callable without a bearer token. Some public share routes may still require their share token query parameter.'
      : 'Protected routes accept Authorization: Bearer $ORION_TOKEN or the httpOnly access_token cookie set by /api/token.';
  const requestExample = activeEndpoint.params || `${activeEndpoint.method} ${primaryPath}\n\nNo request body is required for this endpoint.`;
  const curlExample = activeEndpoint.id === 'login'
    ? `curl -X POST https://try.orionintelligence.org/api/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "username=analyst@orionintelligence.org&password=********"`
    : activeEndpoint.id === 'stealerlogs'
      ? `curl "https://try.orionintelligence.org/api/search/stealerlogs?q=analyst@orionintelligence.org"`
      : isTestingEndpoint
        ? `TESTING_ENABLED=1 curl -X ${activeEndpoint.method} http://localhost:8000${primaryPath}`
        : `curl -X ${activeEndpoint.method} https://try.orionintelligence.org${primaryPath} \\
  -H "Authorization: Bearer $ORION_TOKEN"${activeEndpoint.method === 'POST' ? ' \\\n  -H "Content-Type: application/json"' : ''}`;

  return (
    <div className="relative flex flex-col md:flex-row md:h-[calc(100vh-80px)] md:overflow-hidden animate-in fade-in slide-in-from-bottom-1 duration-500 ease-out">
      {/* Sidebar Navigation */}
      <aside className="relative z-10 w-full md:w-72 lg:w-80 border-b md:border-b-0 md:border-r border-slate-200 dark:border-white/5 bg-slate-50/82 dark:bg-black/20 overflow-y-auto no-scrollbar flex flex-col shrink-0">
        <nav className="flex-1 p-6 space-y-10 md:pb-20">
          {categories.map((cat, catIdx) => (
            <div 
              key={cat.name} 
              className="space-y-4 animate-in fade-in slide-in-from-left-2"
              style={{ animationDelay: `${catIdx * 80}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-center gap-3 px-2">
                <cat.icon className="w-3.5 h-3.5 text-slate-300 dark:text-white/20" />
                <h2 className="text-[9px] font-bold text-slate-500 dark:text-white/40 uppercase tracking-[0.2em]">{cat.label}</h2>
              </div>
              <div className="space-y-1">
                {endpoints.filter(e => e.category === cat.name).map((e, eIdx) => (
                  <button
                    key={e.id}
                    onClick={() => setActiveId(e.id)}
                    style={{ animationDelay: `${(catIdx * 80) + (eIdx * 40)}ms`, animationFillMode: 'both' }}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-[11px] font-bold transition-all flex items-center justify-between group animate-in fade-in slide-in-from-left-1 ${
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

        <div className="hidden md:block p-6 border-t border-slate-200 dark:border-white/5 bg-white/[0.01] animate-in fade-in duration-1000">
           <div className="flex items-center gap-3 px-1 py-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-500 animate-pulse shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
              <span className="text-[9px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest leading-none">ROUTE STATUS: UPDATED</span>
           </div>
        </div>
      </aside>

      {/* Main Documentation Area */}
      <main className="relative z-10 flex-1 overflow-y-auto bg-white/90 dark:bg-[#0a0a0c]/95 px-5 py-5 md:px-6 md:py-7 lg:px-9 lg:py-8 no-scrollbar animate-in fade-in slide-in-from-right-1 duration-700">
        <article className="max-w-none mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
          <header className="mb-8">
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-5">
              <span className={`font-mono text-xs font-black uppercase tracking-widest ${
                activeEndpoint.method === 'GET' ? 'text-blue-600 dark:text-blue-400' : 'text-emerald-600 dark:text-emerald-400'
              }`}>
                {activeEndpoint.method}
              </span>
              <button
                onClick={() => handleCopy(activeEndpoint.path, 'endpoint')}
                className="group min-w-0 flex items-center gap-2 text-left"
                aria-label="Copy endpoint path"
              >
                <code className="text-sm font-mono text-slate-700 dark:text-white/80 truncate">{activeEndpoint.path}</code>
                {copied === 'endpoint' ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />}
              </button>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-white/30">
                {activeEndpoint.category}
              </span>
            </div>

            <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight mb-4">{activeEndpoint.name}</h1>
            <p className="text-base text-slate-500 dark:text-white/[0.48] leading-relaxed font-medium max-w-4xl">
              {activeEndpoint.description}
            </p>

            <dl className="mt-6 grid gap-y-3 sm:grid-cols-2 lg:grid-cols-[0.95fr_1.05fr] gap-x-8 lg:gap-x-12 text-sm">
              <div>
                <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-white/28 mb-1">Authentication</dt>
                <dd className="font-semibold text-slate-800 dark:text-white/75">{authMode}</dd>
              </div>
              <div>
                <dt className="text-[10px] font-black uppercase tracking-[0.18em] text-slate-400 dark:text-white/28 mb-1">Documentation Source</dt>
                <dd className="font-semibold text-slate-800 dark:text-white/75">Backend route files</dd>
              </div>
            </dl>
          </header>

          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-12 items-start">
            <div className="space-y-8">
              <section className="border-l border-slate-200 dark:border-white/[0.12] pl-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <Info className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Authentication</h2>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-white/[0.46] font-medium">{authText}</p>
              </section>

              <section>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Request</h2>
                    <p className="mt-1 text-xs font-medium text-slate-400 dark:text-white/30">Parameters, query string, or request body.</p>
                  </div>
                  <button
                    onClick={() => handleCopy(requestExample, 'request')}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all"
                    aria-label="Copy request example"
                  >
                    {copied === 'request' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'request' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="p-4 md:p-5 rounded-xl border border-slate-200/70 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0c0c0e] text-[11px] md:text-xs font-mono text-slate-700 dark:text-blue-200/85 leading-relaxed overflow-x-auto no-scrollbar whitespace-pre">
                  {requestExample}
                </pre>
              </section>

              <section>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">cURL</h2>
                    <p className="mt-1 text-xs font-medium text-slate-400 dark:text-white/30">Runnable example against the public Orion host.</p>
                  </div>
                  <button
                    onClick={() => handleCopy(curlExample, 'curl')}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all"
                    aria-label="Copy curl example"
                  >
                    {copied === 'curl' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'curl' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="p-4 md:p-5 rounded-xl border border-slate-200/70 dark:border-white/[0.1] bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-100 text-[11px] md:text-xs font-mono leading-relaxed overflow-x-auto no-scrollbar whitespace-pre shadow-sm dark:shadow-none">
                  {curlExample}
                </pre>
              </section>
            </div>

            <div className="space-y-8">
              <section>
                <div className="flex items-center justify-between gap-4 mb-3">
                  <div>
                    <h2 className="text-sm font-bold text-slate-900 dark:text-white">Example response</h2>
                    <p className="mt-1 text-xs font-medium text-slate-400 dark:text-white/30">Representative response shape from this endpoint.</p>
                  </div>
                  <button
                    onClick={() => handleCopy(activeEndpoint.example, 'example')}
                    className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-blue-600 dark:hover:text-white transition-all"
                    aria-label="Copy response example"
                  >
                    {copied === 'example' ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied === 'example' ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="p-4 md:p-5 rounded-xl border border-slate-200/70 dark:border-white/[0.08] bg-slate-50 dark:bg-[#0c0c0e] text-[11px] md:text-xs font-mono text-slate-700 dark:text-white/[0.76] leading-relaxed overflow-x-auto no-scrollbar whitespace-pre">
                  {activeEndpoint.example}
                </pre>
              </section>

              <section className="border-l border-slate-200 dark:border-white/[0.12] pl-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <Shield className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <h2 className="text-sm font-bold text-slate-900 dark:text-white">Implementation notes</h2>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 dark:text-white/[0.46] font-medium">
                  Route text is aligned with Orion backend route files, <code className="text-blue-600 dark:text-blue-300">docs/docs.py</code>, and <code className="text-blue-600 dark:text-blue-300">helper/route_test_helper.py</code>. Protected routes may also enforce role, license, scan-limit, tenant, or testing gates.
                </p>
              </section>
            </div>
          </div>
        </article>
      </main>
    </div>
  );
};

export default ApiDocumentation;
