
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
    id: 'login',
    category: 'Core',
    name: 'Login and Session Cookie',
    method: 'POST',
    path: '/api/token',
    description: 'Password login with OAuth2 form fields. The response carries a bearer JWT and the session profile; add ?cookie_only=true to receive an httpOnly access_token cookie instead of a token in the body. When 2FA is on, the response is { "twofa_required": true, "temp_token": "..." } and the login is finished at /api/token/2fa/verify. Web tokens last 30 minutes, and a new login replaces the previous web session.',
    params: `Content-Type: application/x-www-form-urlencoded

username=analyst@orionintelligence.org
password=********

Optional query: ?cookie_only=true`,
    example: `{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "session": {
    "role": "analyst",
    "username": "analyst01",
    "status": "active",
    "hasOnboarding": false,
    "subscription": false,
    "verificationDate": "2026-10-01T09:00:00",
    "licenses": ["osint_basic"],
    "password_reset_required": false,
    "password_reset_token": null
  }
}`,
    auth: 'public',
    access: 'No token required. Five failed attempts within 30 minutes for the same IP and username lock login for 60 seconds, then 10 and 30 minutes (HTTP 429 with a Retry-After header).',
    curl: `curl -X POST ${API_HOST}/api/token \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "username=analyst@orionintelligence.org&password=********"`
  },
  {
    id: 'auth_flow',
    category: 'Core',
    name: 'Auth Flow Helpers',
    method: 'POST',
    path: '/api/token/2fa/verify | /api/token/refresh | /api/logout',
    description: '2FA verification exchanges the temp_token from /api/token and a 6-digit TOTP code for a full session. Refresh extends a session that has not expired yet (refreshed web tokens last 15 minutes). Logout ends the current web session, disconnects the browser extension, and clears the session cookies. Verify and refresh accept ?cookie_only=true.',
    params: `POST /api/token/2fa/verify
Authorization: Bearer <temp_token>
{ "code": "123456" }

POST /api/token/refresh
Authorization: Bearer $ORION_TOKEN

POST /api/logout`,
    example: `{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "session": {
    "role": "analyst",
    "username": "analyst01",
    "status": "active",
    "licenses": ["osint_basic"]
  }
}`,
    access: '2FA verification takes the temp_token as a Bearer header only (cookies are not accepted). Logout also works with a missing or expired token.',
    curl: `curl -X POST ${API_HOST}/api/token/2fa/verify \\
  -H "Authorization: Bearer $TEMP_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"code":"123456"}'`
  },
  {
    id: 'account',
    category: 'Core',
    name: 'Signup and Password Recovery',
    method: 'POST',
    path: '/api/signup | /api/verify/{verification_token} | /api/forgot | /api/updatePassword | /api/recover',
    description: 'Self-service account flows. Signup creates an organization and its first user, then emails a verification link valid for 24 hours; the organization stays pending until it is approved. Usernames are 8 to 20 characters and start with a letter, and free-mail addresses are rejected. Forgot sends a 20-minute reset link, updatePassword completes it, and recover uses a saved recovery key to reset the password and turn off 2FA.',
    params: `POST /api/signup
{
  "username": "analyst01",
  "email": "analyst@example.com",
  "password": "********"
}

POST /api/verify/{verification_token}
POST /api/forgot           { "email": "analyst@example.com" }
POST /api/updatePassword   { "token": "<reset token>", "password": "********" }
POST /api/recover          { "recovery_key": "<saved recovery key>" }
POST /api/subscription/request
{ "name": "Analyst", "phone": "<phone>", "email": "analyst@example.com", "plan": "monthly-highlighted" }`,
    example: `{
  "message": "Signup successful. Your account is under verification.",
  "status": "pending",
  "email": "analyst@example.com"
}`,
    auth: 'public',
    access: 'No token required. Forgot and recover return the same message whether or not the account exists.',
    curl: `curl -X POST ${API_HOST}/api/signup \\
  -H "Content-Type: application/json" \\
  -d '{"username":"analyst01","email":"analyst@example.com","password":"********"}'`
  },
  {
    id: 'extension',
    category: 'Core',
    name: 'Browser Extension Session',
    method: 'POST',
    path: '/api/extension/login | /api/extension/session | /api/extension/refresh | /api/extension/logout | /api/extension/ws-ticket',
    description: 'Signs the Orion Social browser extension in next to an active web session. Extension tokens last 30 days and are also set as the httpOnly extension_access_token cookie. ws-ticket issues a 30-second ticket for the WebSocket at /api/extension/socket, which carries capture requests between Orion and the extension. Extension packages and update manifests are served from /ext/chrome/... and /ext/firefox/....',
    params: `POST /api/extension/login
{ "username": "analyst01", "password": "********" }

GET  /api/extension/session
POST /api/extension/refresh
POST /api/extension/ws-ticket
WS   /api/extension/socket?ticket=<ticket>`,
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
  {
    id: 'insight',
    category: 'Core',
    name: 'System Insights',
    method: 'GET',
    path: '/api/insight | /api/insight/country',
    description: 'Workspace analytics: document counts with daily and weekly change, the latest leak, generic, and defacement documents, and per-country activity for the heatmap. /api/insight/country pages through the documents behind one country and category. Platform-wide feeder and index statistics are available at /api/profile/system-statistics.',
    params: `GET /api/insight?days=30

GET /api/insight/country?category=leaks&country=DE&page=1&limit=20&days=30

category: strategic | leaks | news | tracking | exploit | actors |
          malware | compromised | defacement | social | chat`,
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
    id: 'route_coverage',
    category: 'Core',
    name: 'Audited Route Coverage',
    method: 'GET',
    path: '/api/*',
    description: 'This reference was rebuilt from the route decorators and request models in the 18 files under backend/routes in November 2026. Routes that only connect Orion services to each other, hooks used by hosting infrastructure, and routes that exist only in test builds (TESTING_ENABLED=1) are not listed individually. Errors use { "detail": "..." }, and validation failures return 422 with a validation_errors list.',
    example: `{
  "total_routes": 457,
  "files": {
    "api_routes.py": 106,
    "test_routes.py": 82,
    "tenant_routes.py": 53,
    "crawl_routes.py": 34,
    "case_routes.py": 28,
    "manage_profiles_routes.py": 28,
    "ai_routes.py": 26,
    "social_routes.py": 23,
    "admin_routes.py": 17,
    "geo_fencing_routes.py": 16,
    "auth_routes.py": 13,
    "public_api_routes.py": 10,
    "extension_routes.py": 7,
    "mail_sso_routes.py": 5,
    "alert_connector_routes.py": 4,
    "graph_routes.py": 3,
    "api_micros.py": 1,
    "documentation_routes.py": 1
  },
  "methods_excluding_test_routes": {
    "POST": 217,
    "GET": 113,
    "DELETE": 28,
    "PUT": 16,
    "WEBSOCKET": 1
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
    id: 'consolidated_ioc',
    category: 'Search',
    name: 'IOC Consolidated Search',
    method: 'POST',
    path: '/api/search/consolidated/ioc',
    description: 'Searches leak, generic, exploit, APT, malware, chat, social, and defacement records by tagged indicators. Combine tag:value pairs with AND, OR, &&, or ||. Supported tags are m_domain (or domain), m_email, m_ip, m_username, m_channel, and m_search_all (or all); use * as the value to match any record that has the field. Pages hold 15 results.',
    params: `{
  "ioc": "m_domain:example.com || m_email:analyst@orionintelligence.org",
  "daterange": "2026-10-01,2026-11-15",
  "page": 1
}`,
    example: `{
  "Result": [{
    "m_channel_name": "example-channel",
    "m_content": "Credentials for example.com posted...",
    "_id": "a1b2...",
    "rank_index": "chat_model",
    "_score": 1.0,
    "_rank": 1
  }],
  "Page_Count": 2,
  "Total_Hits": 42
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
    category: 'Search',
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
    id: 'search_helpers',
    category: 'Search',
    name: 'Search Suggestions and Filters',
    method: 'GET',
    path: '/api/search/suggest | /api/search/exploit/suggestions | /api/search/apt/families | /api/search/malware/filter-options',
    description: 'Helpers for search interfaces: spelling suggestions for a query, autocomplete values for exploit fields (m_cve, m_cwe, m_product, m_tags), and the APT families, countries, and malware filters available. Dismiss and restore hide or bring back an individual stealer-log, breach, exploit, or social result for the whole tenant.',
    params: `GET  /api/search/suggest?q=ransomwar
GET  /api/search/exploit/suggestions?field=m_product&q=apache&limit=25
GET  /api/search/apt/families
GET  /api/search/malware/filter-options

POST /api/search/result/dismiss
POST /api/search/result/restore
{ "hash": "9f2c...", "type": "stealer_log" }`,
    example: `{
  "suggestion": "ransomware"
}`,
    access: 'Active user with role admin, member, analyst, or demo. Exploit suggestions need the exploit module. Dismiss and restore need the admin role, a maintainer license, or the dismiss_result permission.',
    curl: `curl "${API_HOST}/api/search/suggest?q=ransomwar" \\
  -H "Authorization: Bearer $ORION_TOKEN"`
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
    id: 'stealerlogs',
    category: 'Search',
    name: 'Public Email Exposure Check',
    method: 'GET',
    path: '/api/search/stealerlogs',
    description: 'The public exposure check behind the homepage audit. Looks up an email address or username in monitored stealer-log data and returns a risk summary with severity NONE, LOW, MEDIUM, or HIGH. Passwords, hashes, cookies, and raw lines are removed from returned records.',
    params: `?q=analyst@orionintelligence.org`,
    example: `{
  "breach_found": true,
  "total_exposures": 3,
  "unique_channels": 2,
  "unique_types": 1,
  "primary_channel": "telegram-feed-01",
  "primary_channel_hits": 2,
  "primary_type": "combo",
  "primary_type_hits": 3,
  "risk_score": 80,
  "severity": "HIGH",
  "records": [{
    "type": "combo",
    "channel": "telegram-feed-01",
    "email": ["analyst@orionintelligence.org"],
    "date": "2026-10-30"
  }]
}`,
    auth: 'public',
    access: 'No token required. Each IP address can run 35 searches per 24 hours; beyond that the API returns 429 Search limit reached for this IP.',
    curl: `curl "${API_HOST}/api/search/stealerlogs?q=analyst@orionintelligence.org"`
  },
  {
    id: 'stix_export',
    category: 'Search',
    name: 'STIX Export and Conversion',
    method: 'GET',
    path: '/api/search/{type}/stix/{doc_id}',
    description: 'Exports a report as a STIX 2.1 bundle with deterministic IDs, a TLP:AMBER marking, and report, identity, intrusion-set, indicator, observable, vulnerability, and relationship objects. Supported types are breach, news, strategic, exploit, social, chat, and defacement. To convert your own Orion-shaped records, POST one to /api/stix/convert/{kind} (leak, general, exploit, social, chat, or defacement), or an array to the /batch variant.',
    params: `GET  /api/search/breach/stix/{doc_id}?lang=en

POST /api/stix/convert/leak
{
  "m_title": "Example Corp files published",
  "m_url": "http://exampleleaksite.onion/post/12"
}

POST /api/stix/convert/leak/batch
[{ "m_title": "..." }, { "m_title": "..." }]`,
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
    access: 'Exports need the same module license as the report type. Conversion routes need an active account with role admin, member, analyst, or demo.',
    curl: `curl "${API_HOST}/api/search/breach/stix/$DOC_ID?lang=en" \\
  -H "Authorization: Bearer $ORION_TOKEN"`
  },
  {
    id: 'siem_search',
    category: 'Search',
    name: 'SIEM Event Search',
    method: 'POST',
    path: '/api/profile/event-management/siem/search',
    description: 'Searches the security events ingested for your tenant, newest first. Free text matches all terms; tagged terms can use domain, email, ip, event_type, source, host, user, severity, or all. Events arrive from Orion collectors through /api/index/injection.',
    params: `{
  "q": "severity:high",
  "from": 0,
  "size": 100,
  "date_range": "2026-11-01,2026-11-15"
}`,
    example: `{
  "cards_data": [{
    "timestamp": "2026-11-15T09:12:44Z",
    "host": "web-01",
    "source": "nginx",
    "event_type": "auth_failure",
    "severity": "high",
    "raw": "Failed login for admin from 203.0.113.7"
  }],
  "total_hits": 1,
  "page_count": 1,
  "batch_size": 100
}`,
    access: 'Role admin or member with a maintainer license (admins bypass), and event management enabled for the tenant.'
  },

  // --- DYNAMIC INTEL ---
  {
    id: 'dynamic_user',
    category: 'Intelligence',
    name: 'Dynamic Entity Scans',
    method: 'POST',
    path: '/api/dynamic/{user|social|cracked|software|wanted|national-identity}',
    description: 'Live lookups that run as scan jobs. user checks breach databases for an email or username, social checks where a username is registered, cracked and software look for modded app and software listings, wanted searches sanctions and wanted-person records (answered immediately), and national-identity queries a national ID database. Other calls return a pending job: poll it with /api/scan-jobs/{scan_id}/poll. Repeating a finished scan returns requires_confirmation unless you add ?force_new=true.',
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
    id: 'ai_routes',
    category: 'Intelligence',
    name: 'Nexus AI Chat',
    method: 'POST',
    path: '/api/nexus/chat',
    description: 'Streams an AI analyst conversation as newline-delimited JSON: status lines with progress, then a final output line. Pass session_id with session_type persistent to continue a saved chat, or use a temporary session. Re-sending the same request_id within 5 minutes reattaches to a running stream, and POST /api/nexus/chat/cancel stops it. Errors arrive inside the stream with "error": true.',
    params: `{
  "message": "Which exposed credentials for example.com appeared this month?",
  "session_id": "",
  "session_type": "temporary",
  "request_id": "req-0001",
  "tool": "open_chat"
}`,
    example: `{"status": {"message": "Searching breach sources", "progress": 0.4}, "done": false, "error": false}
{"output": {"response": "Found 3 exposed credentials for example.com..."}, "done": true, "error": false}`,
    access: 'Role admin, member, or analyst. AI must be enabled for the tenant, and the user needs the scanning license (pentester or enterprise).',
    curl: `curl -N -X POST ${API_HOST}/api/nexus/chat \\
  -H "Authorization: Bearer $ORION_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"message":"Summarize exposure for example.com","session_type":"temporary"}'`
  },
  {
    id: 'nexus_tools',
    category: 'Intelligence',
    name: 'AI Text Analysis and Chat Sessions',
    method: 'POST',
    path: '/api/nexus/analyze-text | /api/nlp/summarize/ai | /api/nexus/chats',
    description: 'analyze-text classifies a message as spam or not and checks every URL in it for phishing. summarize/ai summarizes a list of texts. /api/nexus/chats creates and lists saved Nexus conversations; GET, PUT, and DELETE /api/nexus/chats/{session_id} read, rename, and delete one, and POST /api/nexus/chats/{session_id}/messages appends messages. Kill-chain exports from a chat are listed at /api/nexus/exports/kill-chain/{chat_id}.',
    params: `POST /api/nexus/analyze-text
{ "text": "Your account is locked. Verify at https://login.example.com/verify" }

POST /api/nlp/summarize/ai
{ "data": ["First report text...", "Second report text..."] }

POST /api/nexus/chats   { "title": "Example Corp exposure" }
GET  /api/nexus/chats`,
    example: `{
  "status": "success",
  "text_length": 212,
  "truncated": false,
  "spam": { "label": "spam", "confidence": 0.97, "is_spam": true },
  "urls_found": 1,
  "url_results": [{
    "url": "https://login.example.com/verify",
    "label": "phishing",
    "confidence": 0.94,
    "is_safe": false
  }],
  "verdict": { "safe": false, "threats": ["spam_detected"] }
}`,
    access: 'Role admin, member, or analyst with AI enabled for the tenant. analyze-text and summarize need the AI module (enterprise; admins bypass); chat sessions need the scanning license.'
  },
  {
    id: 'kill_chain',
    category: 'Intelligence',
    name: 'Kill-Chain Workspaces',
    method: 'POST',
    path: '/api/kill-chain/containers',
    description: 'Saves an attack-graph workspace tied to one Nexus chat: the target scope, the goal, graph nodes and edges, and the proposed, accepted, and dismissed hypotheses. Create one per chat, load the current or per-chat container, and save changes with PUT.',
    params: `POST /api/kill-chain/containers
{ "chat_id": "6650f1c2a9e1b4d3c2a10007", "name": "" }

GET    /api/kill-chain/containers/current
GET    /api/kill-chain/containers/by-chat/{chat_id}
PUT    /api/kill-chain/containers/{container_id}
DELETE /api/kill-chain/containers/{container_id}`,
    example: `{
  "id": "6650f1c2a9e1b4d3c2a10042",
  "chat_id": "6650f1c2a9e1b4d3c2a10007",
  "scope": {
    "raw": "example.com",
    "kind": "domain",
    "host": "example.com",
    "valid": true
  },
  "goal": "Obtain initial access",
  "goal_complete": false,
  "nodes": [],
  "edges": [],
  "proposals": [],
  "accepted": [],
  "dismissed": [],
  "prefs": {}
}`,
    access: 'Role admin, member, or analyst.'
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
  {
    id: 'social_monitoring',
    category: 'Intelligence',
    name: 'Social Profile Monitoring',
    method: 'POST',
    path: '/api/manage-profiles/profiles | /api/manage-profiles/personas | /api/manage-profiles/results',
    description: 'Connects monitored social accounts through browser sessions captured by the extension, assigns personas, and runs post, ad, hate-speech, or keyword monitoring. Start a run with POST /api/manage-profiles/profiles/{profile_id}/trigger-{post|ad|hate-speech|keywords}-monitoring and follow it in /api/manage-profiles/results. trigger-takedown files an impersonation report with the platform.',
    params: `POST /api/manage-profiles/personas
{
  "name": "Analyst persona",
  "age_group": "25-34",
  "gender": "unspecified",
  "interests": ["security", "technology"]
}

POST /api/manage-profiles/profiles
{
  "platform": "x",
  "session_id": "<captured session id>",
  "profile_name": "Example Corp",
  "profile_url": "https://x.com/examplecorp",
  "purposes": ["ad_monitoring", "keywords_monitoring"],
  "keywords": ["example corp"],
  "cronjob_enabled": true
}

POST /api/manage-profiles/profiles/{profile_id}/trigger-ad-monitoring
GET  /api/manage-profiles/results`,
    example: `{
  "active_runs": [{
    "run_id": "run-0001",
    "profile_id": "665f...",
    "platform": "x",
    "activity": "ad_monitoring",
    "is_manual": true,
    "started_at": "2026-11-15T10:00:00Z",
    "step": "collecting"
  }],
  "ad_detection_results": [],
  "post_results": [],
  "hate_speech_results": []
}`,
    access: 'Role admin, member, or analyst with the social_mapper module (social_mapper or enterprise license; admins and maintainers bypass).'
  },
  {
    id: 'entity_graph',
    category: 'Intelligence',
    name: 'CTI Entity Graph',
    method: 'GET',
    path: '/api/graph',
    description: 'Returns the relationship graph around an entity such as an email, domain, IP, or company from Orion\'s CTI graph. GET takes one query; POST accepts several, combined with || or &&. edge caps the number of documents (20 to 800) and depth the number of hops (1 to 5). Graph workspaces are saved per user with /api/graph/session/upsert and /api/graph/session/tabs (up to 5 tabs).',
    params: `GET /api/graph?data_point_type=property&model_type=m_email&query_value=analyst@orionintelligence.org&edge=100&depth=2

POST /api/graph
{
  "requests": [
    { "data_point_type": "property", "model_type": "m_domain", "query_value": "example.com" },
    { "data_point_type": "property", "model_type": "m_email", "query_value": "analyst@orionintelligence.org" }
  ],
  "operator": "||",
  "edge": 100,
  "depth": 2
}`,
    example: `{
  "results": [{
    "vertex": {},
    "edge": {},
    "path": { "vertices": [], "edges": [] }
  }],
  "limit_reached": false,
  "queried_id": "...",
  "matched_vertex_ids": []
}`,
    access: 'The cti_graph license (osint_advanced or enterprise; admins and maintainers bypass). Graph sessions need the scanning license or osint_advanced.',
    curl: `curl "${API_HOST}/api/graph?data_point_type=property&model_type=m_domain&query_value=example.com&edge=100&depth=2" \\
  -H "Authorization: Bearer $ORION_TOKEN"`
  },
  {
    id: 'threat_lens',
    category: 'Intelligence',
    name: 'Threat Lens and Map Entities',
    method: 'POST',
    path: '/api/threat/lens | /api/search/map-entities/stream | /api/search/map-entities/by-ids',
    description: 'Threat lens runs a consolidated search over the last 240 days, newest first, for the map view (up to 100 items per collection). map-entities/stream streams mapped facilities such as ports, power plants, and airports as newline-delimited JSON chunks, and by-ids resolves specific entities.',
    params: `POST /api/threat/lens
{ "q": "energy sector", "network": "all" }

POST /api/search/map-entities/stream
{ "size": 1000 }

POST /api/search/map-entities/by-ids
["entity-001", "entity-002"]`,
    example: `[{
  "id": "entity-001",
  "name": "Example Harbour Terminal",
  "type": "port",
  "country": "DE",
  "lat": 53.54,
  "lon": 9.98,
  "capacity_mw": null
}]`,
    access: 'The geo_fencing license (osint_advanced or enterprise; admins bypass). by-ids needs only the general module.'
  },
  {
    id: 'satellite_routes',
    category: 'Intelligence',
    name: 'Geo, Map, and Satellite Intelligence',
    method: 'POST',
    path: '/api/satellite/{geocode|facilities|sentinel/image|anomaly|compare|livetrack/...}',
    description: 'Geospatial intelligence. geocode, facilities, anomaly, and compare run as jobs: re-send the same body until status is done, then check result.status for errors. sentinel/image returns a Sentinel image for a point and month (true_colour, false_colour, ndvi, swir, moisture, or sar). livetrack returns live aircraft or ships in a bounding box, or one aircraft by ICAO24 or one ship by MMSI.',
    params: `POST /api/satellite/geocode
{ "query": "Berlin, Germany" }

POST /api/satellite/facilities
{ "lat": 52.52, "lon": 13.405, "radius_km": 5 }

POST /api/satellite/sentinel/image
{ "lat": 52.52, "lon": 13.405, "delta": 0.05, "image_type": "ndvi", "month": "2026-10", "size": 512 }

POST /api/satellite/livetrack/aircraft
{ "lat_min": 52.3, "lat_max": 52.7, "lon_min": 13.1, "lon_max": 13.7 }`,
    example: `{
  "job_id": "8b41...",
  "status": "done",
  "result": {
    "status": "done",
    "results": [{
      "name": "Berlin",
      "display_name": "Berlin, Germany",
      "lat": 52.52,
      "lon": 13.405,
      "type": "city",
      "class": "place"
    }]
  }
}`,
    access: 'The geo_fencing license (osint_advanced or enterprise; admins bypass).'
  },

  // --- ASSET DISCOVERY ---
  {
    id: 'urlscan',
    category: 'Asset',
    name: 'Domain and Infrastructure Scans',
    method: 'POST',
    path: '/api/urlscan/{domain|subdomains|dns|wayback}',
    description: 'Infrastructure scans of a public domain, tracked as scan jobs. domain runs a basic or advanced security scan (headers, TLS, HTTP, and an OWASP ZAP pass), an SEO scan, or a repository scan. subdomains enumerates subdomains (checkLive tests which ones respond), dns performs reverse DNS and reachability checks, and wayback collects archived URLs. Private, loopback, and reserved targets are rejected.',
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
    access: 'Active user with role admin, member, analyst, or demo and the scanning license (pentester or enterprise). Poll results with /api/scan-jobs/{scan_id}/poll.'
  },
  {
    id: 'netintel',
    category: 'Asset',
    name: 'Network Intelligence',
    method: 'POST',
    path: '/api/netintel/{resolve_ip|ipscanner|url_vulnerability_scan|iot_detect|camera_detect_ranges}',
    description: 'resolve_ip resolves a domain to its IPs, DNS records, and SPF and DMARC posture. ipscanner runs port, service, TLS, and hosting reconnaissance on one IP; depth low, medium, high, or full scans the top 100 to 5,000 ports. url_vulnerability_scan runs a web vulnerability (DAST) scan, with full depth reserved for root-tenant administrators. iot_detect and camera_detect_ranges return candidate IPs near a coordinate or inside CIDR ranges; they do not confirm devices. All run as scan jobs.',
    params: `POST /api/netintel/resolve_ip
{ "domain": "example.com" }

POST /api/netintel/ipscanner
{ "ip": "<authorized public IP>", "depth": "medium" }

POST /api/netintel/url_vulnerability_scan
{ "domain": "https://example.com", "depth": "low" }

POST /api/netintel/iot_detect
{ "coordinates": "52.52,13.405", "radius_km": 25, "max_ips": 200 }`,
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
    access: 'resolve_ip, ipscanner, and url_vulnerability_scan need the scanning license (pentester or enterprise). iot_detect and camera_detect_ranges need the geo_fencing license (osint_advanced or enterprise). Private and reserved targets are rejected.'
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
  {
    id: 'scan_jobs',
    category: 'Asset',
    name: 'Scan Jobs',
    method: 'POST',
    path: '/api/scan-jobs/{scan_id}/poll | /api/scan-jobs/notifications | /api/scan-jobs/{scan_id}',
    description: 'Every tracked scan (dynamic, urlscan, netintel, and crypto) is saved as a scan job. Poll a job for progress and the final result, list recent jobs, count unseen ones, mark them seen, and delete finished jobs. Job states are queued, running, partial, done, and error.',
    params: `POST   /api/scan-jobs/{scan_id}/poll
GET    /api/scan-jobs/notifications?page=1&limit=8
GET    /api/scan-jobs/{scan_id}
GET    /api/scan-jobs/count
POST   /api/scan-jobs/seen   { "scan_id": "6745f0c2a1b2c3d4e5f60789" }
DELETE /api/scan-jobs/clear-all
DELETE /api/scan-jobs/delete/{scan_id}`,
    example: `{
  "response": {
    "job_id": "5f2c...a9",
    "status": "done",
    "result": {
      "status": "done",
      "result": [{
        "m_title": "User orion_demo_user found on https://example.com",
        "m_url": "https://example.com/orion_demo_user",
        "m_network": "clearnet",
        "m_content_type": ["stolen"]
      }]
    }
  },
  "seen": false,
  "updated_at": "2026-11-15T10:02:00Z",
  "completed_at": "2026-11-15T10:02:00Z"
}`,
    access: 'The scanning license (pentester or enterprise); count and the incomplete-job list need only an active account. Jobs are private to the user who started them.'
  },
  {
    id: 'takedowns',
    category: 'Asset',
    name: 'Takedown Requests',
    method: 'POST',
    path: '/api/takedowns',
    description: 'Requests removal of a defaced or malicious page. Creating a request captures evidence and finds the site\'s abuse contact; re-send the same request while it reports capturing. Reviewers accept a request, which emails the abuse contact from the tenant mailbox, reject it with a reason, or retry a failed capture, and can read and reply to the abuse thread. Statuses are capturing, pending (shown as in_progress), accepted, denied, and failed.',
    params: `POST /api/takedowns
{
  "target_url": "https://example.com/defaced",
  "report_id": "rpt-0001",
  "custom_message": "Defaced homepage"
}

GET  /api/takedowns?status=pending&page=1&limit=20
POST /api/takedowns/{request_id}/accept
POST /api/takedowns/{request_id}/reject   { "reason": "Out of scope" }
POST /api/takedowns/{request_id}/retry
GET  /api/takedowns/thread
POST /api/takedowns/reply`,
    example: `{
  "id": "665f1c2ab4e1f0a9c3d2e101",
  "report_id": "rpt-0001",
  "target_url": "https://example.com/defaced",
  "target_domain": "example.com",
  "abuse_email": "abuse@example.com",
  "status": "pending",
  "public_status": "in_progress",
  "status_label": "Takedown in progress",
  "evidence": { "status": "done", "custom_message": "Defaced homepage" },
  "created_at": "2026-11-15T10:00:00Z",
  "decided_at": null
}`,
    access: 'Creating and listing need role admin, member, or analyst with the defacement module (osint_basic and up, or maintainer). Accept, reject, retry, and the mail thread routes are for root-tenant admins and maintainers.'
  },
  {
    id: 'crawler_indexing',
    category: 'Asset',
    name: 'Crawler and Indexing Routes',
    method: 'POST',
    path: '/api/index/{leak|news|tracking|exploit|apt|malware|market|defacement|generic|chat|social|sanctions|entity|stealerlog|injection}',
    description: 'Ingestion API for Orion crawlers and collectors. Each route validates a typed batch and writes it to its index. /api/index/injection accepts up to 500 SIEM events per request for the caller\'s tenant. Screenshots and HTML snapshots are uploaded through /api/screenshot and /api/snapshot, and feeder scripts are managed under /api/profile/feeder/*.',
    params: `POST /api/index/leak

{
  "base_url": "http://example.onion",
  "m_network": "onion",
  "cards_data": [{
    "m_title": "Example Corp data leak",
    "m_url": "http://example.onion/post/42",
    "m_content": "Example Corp internal files published...",
    "m_company_name": "Example Corp",
    "m_websites": ["example.com"],
    "m_content_type": ["leaks"],
    "m_date": "2026-11-01",
    "m_team": "ExampleGroup"
  }]
}`,
    example: `{
  "message": "website indexed succesfully"
}`,
    auth: 'crawler',
    access: 'Send Authorization: Bearer with a token for an admin or crawler account. Requests share a queue and return 429 when it is full.'
  },

  // --- DOSSIERS & REPORTS ---
  {
    id: 'cases',
    category: 'Dossier',
    name: 'Case Management',
    method: 'GET',
    path: '/api/profile/cases',
    description: 'Investigation cases with entities, artifacts, tasks, comments, linked cases, monitored communication channels, and a configurable status board. Artifact files are encrypted at rest and integrity-checked with SHA-256. Cases can be shared through expiring public links (1 to 720 hours), archived once closed, and assigned to analysts.',
    params: `POST /api/profile/cases
{
  "caseId": "CASE-00042",
  "title": "Credential leak for example.com",
  "caseType": "data_leak",
  "severity": "high",
  "priority": "medium",
  "primaryEntityId": "ent-1",
  "entities": [{ "entityId": "ent-1", "type": "domain", "value": "example.com", "role": "primary" }],
  "tags": ["credentials"]
}

PUT  /api/profile/cases/{case_id}/status          { "status": "under_investigation", "reason": "Triage done" }
PUT  /api/profile/cases/{case_id}/assign-analyst  { "analystIds": ["<user id>"] }
POST /api/profile/cases/{case_id}/artifacts/{artifact_id}/files   (multipart, up to 5 files of 20 MB)
POST /api/profile/cases/{case_id}/shares          { "expiresInHours": 168 }`,
    example: `{
  "caseId": "CASE-00042",
  "title": "Credential leak for example.com",
  "caseType": "data_leak",
  "status": "under_investigation",
  "severity": "high",
  "priority": "medium",
  "assignedAnalysts": [{ "username": "analyst01", "role": "analyst", "status": "active" }],
  "entities": [{ "entityId": "ent-1", "type": "domain", "value": "example.com", "role": "primary" }],
  "artifacts": [{
    "artifactId": "a1",
    "type": "file",
    "title": "Paste dump",
    "files": [{ "fileName": "dump.txt", "fileSize": 2048, "integrityStatus": "verified" }]
  }],
  "isArchived": false,
  "createdAt": "2026-11-01T09:00:00Z"
}`,
    access: 'Active user with case management: the admin role, a maintainer license, or the case_management permission for members and analysts. Analysts see only cases assigned to them.'
  },
  {
    id: 'feedback',
    category: 'Dossier',
    name: 'Report Feedback',
    method: 'GET',
    path: '/api/feedback/{doc_id}',
    description: 'Analyst feedback on any report: comments (one per user per report each hour) and recommended, trust, and untrust toggles, where trust and untrust exclude each other. Analyst profiles and recent activity are available at /api/user/{user_id}/get and /api/user/{user_id}/activity.',
    params: `GET    /api/feedback/{doc_id}
POST   /api/feedback/comment/{doc_id}   { "comment": "Confirmed by a second source." }
DELETE /api/feedback/comment/{doc_id}/{comment_created_at}
POST   /api/feedback/recommended/{doc_id}
POST   /api/feedback/trust/{doc_id}
POST   /api/feedback/untrust/{doc_id}`,
    example: `{
  "doc_id": "9c1e...",
  "recommended_count": 3,
  "trust_count": 2,
  "untrust_count": 0,
  "comments": [{
    "username": "analyst01",
    "comment": "Confirmed by a second source.",
    "is_deleted": false,
    "created_at": "2026-11-15T10:00:00Z"
  }],
  "can_react": true
}`,
    access: 'Active user with role admin, member, analyst, or demo.'
  },
  {
    id: 'tenant_admin',
    category: 'Dossier',
    name: 'Tenant and Users',
    method: 'POST',
    path: '/api/get/tenant | /api/update/tenants | /api/users | /api/tenant/create/user | /api/update/user',
    description: 'Organization settings (name, contact details, watched IOCs, custom domain, alert visibility, mail settings, and heatmap range) and user management. Maintainers create members, analysts, and demo users with a subset of the tenant\'s licenses and permissions such as case_management. Users manage their own profile, 2FA, and password through /api/update/current/user and can generate a recovery key with /api/recovery-key.',
    params: `POST /api/get/tenant

POST /api/update/tenants
{
  "name": "Example Corp",
  "country": "Germany",
  "custom_domain": "intel.example.com",
  "iocs": [{ "ioc_id": "ioc-1", "name": "Primary domain", "values": ["example.com"] }],
  "heatmap_days": 30
}

POST /api/tenant/create/user
{
  "username": "analyst02",
  "email": "analyst02@example.com",
  "password": "********",
  "role": "analyst",
  "licenses": ["osint_basic"],
  "permissions": ["case_management"]
}`,
    example: `{
  "message": "User created successfully",
  "username": "analyst02",
  "email": "analyst02@example.com",
  "tenant_id": "665e...",
  "allowed_licenses": ["osint_basic", "osint_advanced"]
}`,
    access: 'Reading the tenant needs role admin, member, analyst, or demo. Updating the tenant and creating users need a maintainer license; /api/users is for admins and members.'
  },
  {
    id: 'alerts',
    category: 'Dossier',
    name: 'Alerts and Connectors',
    method: 'GET',
    path: '/api/profile/alerts | /api/profile/alert/scan | /api/alert-connectors/settings',
    description: 'Alerts are raised when watched IOCs appear in new intelligence. List them with paging and filters, mark them seen, dismiss them, or start an on-demand alert scan. Maintainers of parent tenants can read child-tenant alerts at /api/tenants/{tenant_id}/alerts. Connectors deliver alerts to Slack (incoming webhook) or Jira (issues) after an OAuth connect at /api/alert-connectors/{slack|jira}/connect.',
    params: `GET  /api/profile/alerts?page=1&limit=20&paginate=true&unseen_only=true&include_counts=true
POST /api/alert/seen
POST /api/alert/dismiss   "<alert hash>"
POST /api/profile/alert/scan
POST /api/profile/alert/scan/status

GET  /api/alert-connectors/settings
GET  /api/alert-connectors/slack/connect`,
    example: `{
  "items": [{
    "alert_id": "al-0001",
    "type": "breach",
    "ioc_type": "m_domain",
    "ioc_value": "example.com",
    "title": "example.com found in a new leak post",
    "risk": "high",
    "report_seen": false,
    "dismissed": false,
    "first_seen": "2026-11-15T08:00:00Z"
  }],
  "total": 1,
  "page": 1,
  "limit": 20,
  "has_more": false,
  "counts_by_type": { "breach": 1 }
}`,
    access: 'Alert lists and actions are for members; starting a scan and bulk deletes also need a maintainer license. Connector settings need role admin or member.',
    curl: `curl "${API_HOST}/api/profile/alerts?page=1&limit=20&paginate=true" \\
  -H "Authorization: Bearer $ORION_TOKEN"`
  },
  {
    id: 'audit_backups',
    category: 'Dossier',
    name: 'Audit Logs and Backups',
    method: 'POST',
    path: '/api/audit/logs | /api/tenant/backups | /api/admin/backups',
    description: 'Audit logs record searches, scans, and administrative changes for the tenant, 100 entries per page. Maintainers can list, download, restore, and import tenant backups; platform administrators manage full backups, instant backups, and per-tenant restores under /api/admin/backups. Restores run in the background, so poll the status route for progress.',
    params: `POST /api/audit/logs
{ "page": 1, "daterange": "2026-11-01T00:00:00Z,2026-11-15T23:59:59Z", "actor_id": "analyst01" }

GET  /api/tenant/backups
GET  /api/tenant/backups/status
POST /api/tenant/backups/{backup_id}/restore
GET  /api/tenant/backups/{backup_id}/download`,
    example: `{
  "items": [{
    "id": "6650f1c2a9e1b4d3c2a10101",
    "ts": "2026-11-15T10:00:00Z",
    "tenant_id": "665e...",
    "actor_id": "analyst01",
    "event": "dynamic_user"
  }],
  "page": 1
}`,
    access: 'Audit logs need a maintainer license. Tenant backups need a maintainer license and backup access for the tenant. /api/admin/backups is for platform administrators.'
  },
  {
    id: 'vault',
    category: 'Dossier',
    name: 'Vault and End-to-End Keys',
    method: 'GET',
    path: '/api/vault/credentials | /api/e2e/key',
    description: 'A per-user credential vault encrypted in the browser: the server stores only ciphertext and IVs. The vault needs an end-to-end key first. PUT /api/e2e/key stores the public key and the passphrase-wrapped private key, and /api/e2e/key/unlock returns the wrapped key after the passphrase is verified. Changing a stored password needs a fresh proof from /api/vault/verify-password.',
    params: `GET  /api/e2e/key
POST /api/e2e/key/unlock   { "verifier": "<passphrase verifier>", "kind": "passphrase" }

POST /api/vault/credentials
{
  "website_name": "Example portal",
  "website_url": "https://portal.example.com",
  "username": "analyst01",
  "password_ciphertext": "<base64 ciphertext>",
  "password_iv": "<base64 iv>"
}

POST /api/vault/verify-password   { "password": "********" }`,
    example: `[{
  "id": "6650f1c2a9e1b4d3c2a10201",
  "website_name": "Example portal",
  "website_url": "https://portal.example.com",
  "username": "analyst01",
  "password_ciphertext": "<base64 ciphertext>",
  "password_iv": "<base64 iv>",
  "created_at": "2026-11-15T10:00:00Z",
  "updated_at": "2026-11-15T10:00:00Z"
}]`,
    access: 'Any active signed-in user. verify-password shares the login lockout, and unlock locks for 15 minutes after 5 wrong attempts.'
  },
  {
    id: 'public_api',
    category: 'Dossier',
    name: 'Public API Routes',
    method: 'GET',
    path: '/api/public | /api/public/case-shares/{share_id} | /api/public/chat-shares/{share_id}',
    description: 'Routes that need no account. /api/public returns the workspace\'s public settings, such as its name, version, and sign-up and login options. The case and chat share routes return a read-only view of a shared investigation or Nexus conversation and need the signed token from the share link. Logos are served from /api/s/static/system/{logo} and /api/s/static/favicon.',
    params: `GET /api/public
GET /api/public/case-shares/{share_id}?token=<share token>
GET /api/public/chat-shares/{share_id}?token=<share token>
GET /api/s/static/favicon`,
    example: `{
  "settings": {
    "app_name": "Orion Intelligence",
    "version": "2.4.0",
    "signup_enabled": "1",
    "tenant_login": "0",
    "app_url": "https://try.orionintelligence.org"
  }
}`,
    auth: 'public',
    access: 'No bearer token. Share routes need the token query parameter from the share link: 401 if it is missing or expired, 403 if the share was revoked.',
    curl: `curl ${API_HOST}/api/public`
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
    : `Protected routes accept Authorization: Bearer $ORION_TOKEN or the httpOnly access_token cookie set by /api/token.${activeEndpoint.access ? ` ${activeEndpoint.access}` : ''}`;
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
                <dd className="font-semibold text-slate-800 dark:text-white/75">Backend route files</dd>
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
                  Route text is aligned with the Orion backend route files in <code className="text-blue-600 dark:text-blue-300">backend/routes</code> and their request models. Protected routes also enforce the caller's tenant, account status, role, and license, and some share a request queue that returns 429 when full. Errors return <code className="text-blue-600 dark:text-blue-300">{'{ "detail": "..." }'}</code>.
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
