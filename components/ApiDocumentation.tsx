
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
  // 'public' routes need no token, 'crawler' routes need a crawler account token, 'extension' routes use the extension token.
  auth?: 'public' | 'crawler' | 'extension';
  // role, license, and limit requirements, shown under Authentication
  access?: string;
  // replaces the generated cURL example
  curl?: string;
}

const API_HOST = 'https://try.orionintelligence.org';

const endpoints: Endpoint[] = [
  // --- CORE SYSTEMS ---
  {
    id: 'insight',
    category: 'Core',
    name: 'System Insights',
    method: 'GET',
    path: '/api/insight',
    description: 'Workspace analytics: document counts with daily and weekly change, the latest leak, generic, and defacement documents, and per-country activity for the heatmap over the chosen number of days.',
    params: `GET /api/insight?days=30`,
    example: `{
  "insights": {
    "general": {
      "document_count": {
        "key": "Document Count",
        "value": 5120,
        "change_weekly": "+3.20%",
        "change_daily": "0%"
      }
    },
    "leak": {},
    "defacement": {}
  },
  "latestDocument": {
    "leak_model": [{
      "title": "Example leak",
      "url": ["http://example.com/"],
      "source": "onion"
    }],
    "exploit_model": [],
    "chat_model": [],
    "generic_model": [],
    "defacement_model": []
  },
  "country_insight": { "leaks": [{ "m_country": ["DE"] }] },
  "country_insight_range": { "leaks": { "from": "2026-10-16", "to": "2026-11-14" } },
  "country_insight_days": 30
}`,
    access: 'Active user with role admin, member, analyst, or demo.',
    curl: `curl "${API_HOST}/api/insight?days=30" \\
  -H "Authorization: Bearer $ORION_TOKEN"`
  },
  {
    id: 'directory',
    category: 'Core',
    name: 'Source Directory',
    method: 'GET',
    path: '/api/directory',
    description: 'Lists monitored sources across clearnet, onion, and I2P networks, with the time each source last produced leak or general records. Filter by network, index, content type, and date range. Results are paged 1,000 at a time.',
    params: `GET /api/directory?page=1&network=onion&index=leak&content_type=leaks&daterange=2026-10-01,2026-11-15

network:      all | clearnet | onion | i2p
index:        all | general | leak | defacement | chat | exploit | twitter | reddit
content_type: all | general | forums | news | stolen | drugs | hacking | marketplaces |
              cryptocurrency | leaks | adult | tracking | chat | social`,
    example: `{
  "total_count": 12345,
  "page": 1,
  "mDirectoryCallbackLinks": [{
    "url": "http://exampleforumabcdef.onion/",
    "name": "Example Forum",
    "network_type": "onion",
    "content_type": ["forums"],
    "index_type": ["leak"],
    "leak_model_last_update": "2026-11-10T10:15:00",
    "geneic_model_last_update": null
  }]
}`,
    access: 'Active user with role admin, member, analyst, or demo.',
    curl: `curl "${API_HOST}/api/directory?page=1&network=onion&index=leak" \\
  -H "Authorization: Bearer $ORION_TOKEN"`
  },
  {
    id: 'extension',
    category: 'Core',
    name: 'Browser Extension Session',
    method: 'POST',
    path: '/api/extension/login | /api/extension/session | /api/extension/refresh | /api/extension/logout | /api/extension/ws-ticket | /ext/{artifact}',
    description: 'Signs the Orion Social browser extension in next to an active web session. Extension tokens last 30 days and are also set as the httpOnly extension_access_token cookie. ws-ticket issues a 30-second ticket the extension uses to open its live capture channel with Orion. GET /ext/{artifact} serves the extension packages, policy files, and update manifests for Chrome and Firefox.',
    params: `POST /api/extension/login
{ "username": "analyst01", "password": "********" }

GET  /api/extension/session
POST /api/extension/refresh
POST /api/extension/ws-ticket
GET  /ext/{artifact}`,
    example: `{
  "detail": "Logged in",
  "access_token": "eyJhbGciOiJIUzI1NiIs..."
}`,
    auth: 'extension',
    access: 'Login needs the same user to be signed in to the web app (401 orion_login_required otherwise) and shares the login rate limit. The other routes read the extension token from the Authorization header or the extension_access_token cookie.',
    curl: `curl -X POST ${API_HOST}/api/extension/login \\
  -H "Content-Type: application/json" \\
  -d '{"username":"analyst01","password":"********"}'`
  },

  // --- SEARCH ENGINES ---
  {
    id: 'consolidated',
    category: 'Search',
    name: 'Consolidated Search',
    method: 'POST',
    path: '/api/search/consolidated',
    description: 'Runs one query across every collection and returns results grouped by collection: leak, exploit, APT, malware, marketplace, chat, generic, defacement, social, tracking, and news. Queries support exact phrases in quotes and exclusions with a leading minus. In entity_filter, different keys are combined with AND and values within a key with OR. matchtype "" or "or" matches any term, "and" all terms, "full" the whole phrase, and "semantic" uses vector search where it is enabled.',
    params: `{
  "q": "example corp",
  "page": 1,
  "network": "all",
  "category": "all",
  "matchtype": "",
  "daterange": "2026-10-01,2026-11-15",
  "sort_latest": false,
  "platform_result_count": 15,
  "entity_filter": {
    "m_domain": ["example.com"],
    "m_country": ["Germany"]
  }
}`,
    example: `{
  "leak_model": {
    "Result": [{
      "m_title": "Example Corp files published",
      "m_url": "http://exampleleaksite.onion/post/12",
      "m_network": "onion",
      "m_content_type": ["leaks"],
      "m_creation_date": "2026-11-02T08:14:00+00:00",
      "_id": "9c1e...",
      "rank_index": "leak_model",
      "_score": 11.2,
      "_rank": 1
    }],
    "Suggestions": null,
    "Page_Count": 3.0
  },
  "exploit_model": { "Result": [], "Suggestions": null, "Page_Count": 0.0 },
  "apt_model": null,
  "malware_model": null,
  "news_model": null
}`,
    access: 'Requires the admin role or an enterprise license.'
  },
  {
    id: 'strategic',
    category: 'Search',
    name: 'Strategic Search',
    method: 'POST',
    path: '/api/search/strategic',
    description: 'Searches the strategic (general) intelligence index and returns diversified, ranked results together with each source\'s current crawl status. Accepts the same body as consolidated search. Demo accounts are limited to onion sources with safe search on.',
    params: `{
  "q": "ransomware negotiation",
  "page": 1,
  "network": "onion",
  "category": "all",
  "safe": true,
  "daterange": ""
}`,
    example: `{
  "Result": [{
    "m_title": "Example Corp internal portal",
    "m_url": "https://example.com/",
    "m_network": "clearnet",
    "m_crawl_status": "online",
    "m_last_crawled_at": "2026-11-14T02:10:00Z",
    "_id": "7d0e...",
    "rank_index": "generic_model",
    "_score": 8.1,
    "_rank": 1
  }],
  "Page_Count": 12,
  "Total_Hits": 171
}`,
    access: 'Active user with role admin, member, analyst, or demo and a license that includes the general module (free, osint_basic, osint_advanced, or enterprise).'
  },
  {
    id: 'vertical_search',
    category: 'Search',
    name: 'Vertical Report Search',
    method: 'POST',
    path: '/api/search/{breach|marketplace|social|exploit|apt-intel|defacement}',
    description: 'Focused searches over one report family, using the same body as consolidated search plus the filters listed for each vertical. Breach results hide dump links and inline passwords unless the tenant has an enterprise license. apt-intel groups records by actor or malware family. Every vertical returns Result, Page_Count, and Total_Hits; report details are at /api/search/{type}/{doc_id}.',
    params: `POST /api/search/exploit
{
  "q": "remote code execution",
  "page": 1,
  "m_cve": ["CVE-2026-12345"],
  "m_severity": "critical",
  "daterange": "2026-09-01,2026-11-15"
}

Vertical filters
breach       category: all | leaks | databases | <content type>
marketplace  category: all | marketplaces
social       category: all | telegram | forum | <platform>
exploit      m_cve, m_cwe, m_product, m_version, m_platform, m_cvss,
             m_severity, m_remote_type, m_risk, m_tags
apt-intel    category: all | apt | malware | defacement; family, m_country
defacement   content: hacked | phishing | phishing_domain | scam | typosquatting |
             malicious_redirect | malware_url | open_directory | spam_url`,
    example: `{
  "Result": [{
    "m_title": "CVE-2026-12345 remote code execution in Example Server",
    "m_cve": ["CVE-2026-12345"],
    "m_severity": "critical",
    "m_url": "https://example.com/advisories/12345",
    "_id": "3f9a...",
    "rank_index": "exploit_model",
    "_rank": 1
  }],
  "Page_Count": 4,
  "Total_Hits": 57
}`,
    access: 'Each vertical needs its module license: breach and marketplace need breach, social needs social, exploit needs exploit, and defacement needs defacement (all included from osint_basic up). apt-intel needs an osint_basic, osint_advanced, or enterprise license.'
  },
  {
    id: 'report_detail',
    category: 'Dossier',
    name: 'Report Details',
    method: 'GET',
    path: '/api/search/{breach|marketplace|news|exploit|strategic|apt|malware|chat|social|defacement}/{doc_id}',
    description: 'Returns one stored report by ID without search-only fields such as embeddings. Add ?lang=<code> to translate the content fields (not available for defacement). Breach screenshots and archived HTML snapshots are served from /api/search/breach/screenshot/{filename}, /api/search/breach/snapshot/{filename}, and /api/search/social/snapshot/{filename}; snapshots download as sandboxed attachments.',
    params: `GET /api/search/breach/{doc_id}?lang=en
GET /api/search/exploit/{doc_id}
GET /api/search/breach/screenshot/{filename}
GET /api/search/breach/snapshot/{filename}`,
    example: `{
  "m_title": "Example Corp files published",
  "m_url": "http://exampleleaksite.onion/post/12",
  "m_network": "onion",
  "m_company_name": "Example Corp",
  "m_team": "ExampleGroup",
  "m_content": "Example Corp internal files published...",
  "m_important_content": "120 GB of HR and finance data",
  "m_content_type": ["leaks"],
  "m_creation_date": "2026-11-02T08:14:00+00:00"
}`,
    access: 'Same module license as the matching search vertical; chat reports need an enterprise license. Unknown IDs return 404 Document not found.'
  },
  {
    id: 'stealer_ioc',
    category: 'Search',
    name: 'Stealer-Log Credential Search',
    method: 'POST',
    path: '/api/search/stealer/ioc',
    description: 'Searches stealer-log credential records by tagged indicators: m_domain (or domain), m_url, m_email, m_username, m_password, m_ip, m_phone, m_creditcard, m_fullbin, m_cookie, m_extra, and m_search_all (or all), combined with AND or OR. Results can be narrowed by password strength. Passwords are masked unless the tenant has an enterprise license.',
    params: `{
  "ioc": "m_domain:example.com",
  "daterange": "2026-01-01,2026-11-15",
  "page": 1,
  "hide_dismissed": true,
  "password_schema": {
    "minLength": 8,
    "hasNumbers": true,
    "hasSpecialChars": true
  }
}`,
    example: `{
  "Result": [{
    "type": "combo",
    "channel": "example-channel",
    "email": ["analyst@orionintelligence.org"],
    "password": "Not authorized",
    "date": "2026-10-03",
    "m_index": "stealer_model",
    "dismiss_id": "9f2c...",
    "dismissed": false
  }],
  "Suggestions": [],
  "Page_Count": 1
}`,
    access: 'Active user with role admin, member, analyst, or demo and the stealer_logs module (osint_advanced, social_mapper, or enterprise; maintainers bypass).'
  },
  {
    id: 'stix_export',
    category: 'Dossier',
    name: 'STIX Export',
    method: 'GET',
    path: '/api/search/{type}/stix/{doc_id}',
    description: 'Exports a report as a STIX 2.1 bundle with deterministic IDs, a TLP:AMBER marking, and report, identity, intrusion-set, indicator, observable, vulnerability, and relationship objects. Supported types are breach, news, strategic, exploit, social, chat, and defacement.',
    params: `GET /api/search/breach/stix/{doc_id}?lang=en

type: breach | news | strategic | exploit | social | chat | defacement`,
    example: `{
  "type": "bundle",
  "id": "bundle--3c1f6e2a-...",
  "x_tenant_name": "Example Corp",
  "objects": [{
    "type": "report",
    "spec_version": "2.1",
    "name": "Example Corp files published",
    "labels": ["example-corp:leak"],
    "x_tenant_network": "onion"
  }, {
    "type": "indicator",
    "spec_version": "2.1",
    "pattern": "[domain-name:value = 'example.com']",
    "pattern_type": "stix"
  }]
}`,
    access: 'Exports need the same module license as the report type.',
    curl: `curl "${API_HOST}/api/search/breach/stix/$DOC_ID?lang=en" \\
  -H "Authorization: Bearer $ORION_TOKEN"`
  },

  // --- DYNAMIC INTEL ---
  {
    id: 'dynamic_user',
    category: 'Intelligence',
    name: 'Dynamic Entity Scans',
    method: 'POST',
    path: '/api/dynamic/{user|social|cracked|software|wanted|national-identity}',
    description: 'Live lookups that run as scan jobs. user checks breach databases for an email or username, social checks where a username is registered, cracked and software look for modded app and software listings, wanted searches sanctions and wanted-person records (answered immediately), and national-identity queries a national ID database. The other scans return a pending scan job (scan_id) instead of results; progress and results appear under scan notifications in the Orion platform. Repeating a finished scan returns requires_confirmation unless you add ?force_new=true.',
    params: `POST /api/dynamic/user?force_new=false
{
  "text": {
    "email": "analyst@orionintelligence.org",
    "username": "orion_demo_user"
  }
}

Keys read per scan
user               email, username
social             username
cracked            name, app_name, url, playstore_url
software           name
wanted             query (or name, username)
national-identity  pak_query`,
    example: `{
  "job_id": "5f2c...a9",
  "status": "pending",
  "progress": 5,
  "step": "queued",
  "scan_id": "6745f0c2a1b2c3d4e5f60789",
  "scan_title": "User Exposure Scan",
  "scan_target": "analyst@orionintelligence.org",
  "scan_status": "running",
  "scan_seen": false,
  "scan_created_at": "2026-11-15T10:00:00Z",
  "scan_completed_at": null
}`,
    access: 'Active user with role admin, member, analyst, or demo and the scanning license (pentester or enterprise). New scans are written to the audit log.'
  },
  {
    id: 'social_routes',
    category: 'Intelligence',
    name: 'Social Reconnaissance',
    method: 'POST',
    path: '/api/social/{recon|recon/status|recon/cancel|recon/image|online/images|metadata|forum}',
    description: 'Username reconnaissance across social platforms. Start a recon, then poll /api/social/recon/status until it returns the matched profiles; starting a new recon cancels your other pending ones. recon/image starts a reverse-image recon from a base64 photo. online/images and metadata collect public images and token mentions for one profile (re-send the same body to poll). forum searches indexed forum posts.',
    params: `POST /api/social/recon
{ "query": "orion_demo_user" }

POST /api/social/recon/status
{ "query": "orion_demo_user" }

POST /api/social/online/images
{ "platform": "x", "username": "orion_demo_user", "max_images": 10 }

POST /api/social/forum
{ "query": "example corp", "max_results": 50 }`,
    example: `{
  "profile_username": "orion_demo_user",
  "status": "pending",
  "progress": 5,
  "step": "queued"
}`,
    access: 'Active user with role admin, member, analyst, or demo and the scanning license (pentester or enterprise).'
  },
  {
    id: 'social_graph',
    category: 'Intelligence',
    name: 'Social Graph Data',
    method: 'POST',
    path: '/api/social/data | /api/social/connections | /api/social/graph/data | /api/social/identity-resolution/investigate',
    description: 'Stores and reads the profile graphs built from recon. Save profiles under a root username, list saved graphs, load stored connections for a profile, and fetch several stored graphs at once. identity-resolution compares a reference profile with a candidate and returns impersonation risk and same-person likelihood with an evidence matrix.',
    params: `POST /api/social/data
{ "profile_username": "orion_demo_user", "profiles": [], "replace": false }

GET  /api/social/data
GET  /api/social/data/{profile_username}

POST /api/social/identity-resolution/investigate
{
  "reference_profile_url": "https://x.com/orion_demo_user",
  "candidate_profile_url": "https://instagram.com/orion.demo.user",
  "enable_image_comparison": true
}`,
    example: `{
  "user_id": "665f0b11...",
  "profile_username": "orion_demo_user",
  "saved": 2,
  "config": null
}`,
    access: 'The scanning license, or an osint_advanced or social_mapper license. Saving and pruning graphs accept osint_advanced but not social_mapper.'
  },

  // --- ASSET DISCOVERY ---
  {
    id: 'urlscan',
    category: 'Asset',
    name: 'Domain and Infrastructure Scans',
    method: 'POST',
    path: '/api/urlscan/{domain|subdomains|dns|wayback}',
    description: 'Infrastructure scans of a public domain, tracked as scan jobs whose progress and results appear under scan notifications in the Orion platform. domain runs a basic or advanced security scan (headers, TLS, HTTP, and an OWASP ZAP pass), an SEO scan, or a repository scan. subdomains enumerates subdomains (checkLive tests which ones respond), dns performs reverse DNS and reachability checks, and wayback collects archived URLs. Private, loopback, and reserved targets are rejected.',
    params: `POST /api/urlscan/domain
{
  "domain": "example.com",
  "scanType": "advanced",
  "checkLive": false
}

scanType for /domain: basic | advanced | seo | repo
/api/urlscan/subdomains   send "scanType": "subdomains"
/api/urlscan/wayback      send "scanType": "wayback"
/api/urlscan/dns          send "scanType": null`,
    example: `{
  "job_id": "1d7e...",
  "status": "pending",
  "progress": 5,
  "step": "queued",
  "scan_id": "6745f0c2a1b2c3d4e5f60790",
  "scan_title": "ADVANCED Scan",
  "scan_target": "example.com",
  "scan_status": "running",
  "scan_seen": false
}`,
    access: 'Active user with role admin, member, analyst, or demo and the scanning license (pentester or enterprise).'
  },
  {
    id: 'netintel',
    category: 'Asset',
    name: 'Network Intelligence',
    method: 'POST',
    path: '/api/netintel/{resolve_ip|ipscanner|url_vulnerability_scan}',
    description: 'resolve_ip resolves a domain to its IPs, DNS records, and SPF and DMARC posture. ipscanner runs port, service, TLS, and hosting reconnaissance on one IP; depth low, medium, high, or full scans the top 100 to 5,000 ports. url_vulnerability_scan runs a web vulnerability (DAST) scan, with full depth reserved for root-tenant administrators. All run as scan jobs.',
    params: `POST /api/netintel/resolve_ip
{ "domain": "example.com" }

POST /api/netintel/ipscanner
{ "ip": "<authorized public IP>", "depth": "medium" }

POST /api/netintel/url_vulnerability_scan
{ "domain": "https://example.com", "depth": "low" }`,
    example: `{
  "domain": "example.com",
  "ips": ["192.0.2.10"],
  "records": {},
  "email_security": {
    "spf": "v=spf1 -all",
    "dmarc": "v=DMARC1; p=reject",
    "dmarc_domain": "_dmarc.example.com"
  },
  "lookup_errors": [],
  "status": "done"
}`,
    access: 'All three need the scanning license (pentester or enterprise). Private and reserved targets are rejected.'
  },
  {
    id: 'file_analysis',
    category: 'Asset',
    name: 'File, URL, Crypto, and Phone Analysis',
    method: 'POST',
    path: '/api/ioc/extract | /api/ioc/extract/url | /api/crypto/scan | /api/cross/search | /api/phone/universal_search | /api/dkim/check',
    description: 'ioc/extract takes a file upload of up to 10 MB and returns extracted IOCs, metadata, and antivirus results; APK files also get app analysis. ioc/extract/url fetches a page, extracts IOCs, and flags scams. crypto/scan traces a wallet or a 64-character transaction hash. cross/search queries onion search engines. phone/universal_search runs phone or domain OSINT, and dkim/check discovers DKIM selectors or analyzes a raw email. File, onion, phone, and DKIM lookups finish by re-sending the same request.',
    params: `POST /api/ioc/extract   (multipart/form-data)
file=@sample.pdf

POST /api/ioc/extract/url
{ "url": "https://example.com/notice" }

POST /api/crypto/scan
{ "text": { "wallet": "<wallet address>" } }

POST /api/cross/search
{ "text": { "query": "example corp" } }

POST /api/dkim/check
{ "text": { "domain": "example.com" } }`,
    example: `{
  "extracted_text_length": 1840,
  "extracted_text": "Your account has been suspended...",
  "iocs": [{ "m_domain": "example.com" }],
  "status": "success",
  "is_scam": false
}`,
    access: 'The scanning license (pentester or enterprise). File uploads, crypto scans, and onion searches are limited to the admin, member, and analyst roles.',
    curl: `curl -X POST ${API_HOST}/api/ioc/extract \\
  -H "Authorization: Bearer $ORION_TOKEN" \\
  -F "file=@sample.pdf"`
  },
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

  // "/api/search/{breach|social}" becomes "/api/search/breach"; "/a | /b" becomes "/a"
  const primaryPath = activeEndpoint.path.replace(/\{([^}|]+)\|[^}]*\}/g, '$1').split(' | ')[0].trim();
  const isPublicEndpoint = activeEndpoint.auth === 'public';
  const authMode = isPublicEndpoint
    ? 'Public endpoint'
    : activeEndpoint.auth === 'crawler'
      ? 'Crawler account token'
      : activeEndpoint.auth === 'extension'
        ? 'Extension token'
        : 'Bearer token or access cookie';
  const authText = activeEndpoint.auth
    ? activeEndpoint.access || 'This route is callable without a bearer token.'
    : `Protected routes accept Authorization: Bearer $ORION_TOKEN, the access token issued to your Orion account, or the platform's httpOnly session cookie.${activeEndpoint.access ? ` ${activeEndpoint.access}` : ''}`;
  const requestExample = activeEndpoint.params || `${activeEndpoint.method} ${primaryPath}\n\nNo request body is required for this endpoint.`;
  const curlExample = activeEndpoint.curl ?? (isPublicEndpoint
    ? `curl -X ${activeEndpoint.method} ${API_HOST}${primaryPath}`
    : `curl -X ${activeEndpoint.method} ${API_HOST}${primaryPath} \\
  -H "Authorization: Bearer $ORION_TOKEN"${activeEndpoint.method === 'POST' ? ' \\\n  -H "Content-Type: application/json"' : ''}`);

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
      <main className="relative z-10 flex-1 min-w-0 overflow-y-auto bg-white/90 dark:bg-[#0a0a0c]/95 px-5 py-5 md:px-6 md:py-7 lg:px-9 lg:py-8 no-scrollbar animate-in fade-in slide-in-from-right-1 duration-700">
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
                <dd className="font-semibold text-slate-800 dark:text-white/75">Published OpenAPI schema</dd>
              </div>
            </dl>
          </header>

          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-12 items-start">
            <div className="min-w-0 space-y-8">
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

            <div className="min-w-0 space-y-8">
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
                  This reference covers only the routes published in the Orion API's OpenAPI schema, the same set shown in its Swagger UI. Protected routes also enforce the caller's tenant, account status, role, and license, and some share a request queue that returns 429 when full. Errors return <code className="text-blue-600 dark:text-blue-300">{'{ "detail": "..." }'}</code>.
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
