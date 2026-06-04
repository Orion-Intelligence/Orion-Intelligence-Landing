# Orion Technical Deck - Slide Text

Source file: `public/collaboration.html`  
Source section: `#technical-panel`  
Recommended use: Technical evaluation session for cybersecurity engineering, SOC, MDR, DFIR, integration, and product teams.  
Positioning note: This deck is intentionally **not** commercial positioning. It is a technical runbook that proves Orion's UI workflows, API surface, report structure, scan behavior, graph pivots, and tenant controls using authorized demo data.

---

## Slide 01 - Technical evaluation, not a sales pitch

- Header: ORION - Technical
- Tag: Demo Objective
- Eyebrow: Technical team session
- Main heading: Technical evaluation, not a sales pitch
- Lead: The purpose of this session is to let the technical team verify Orion's workflow, API behavior, data outputs, access controls, and operational boundaries in a live environment.
- What the demo proves:
  - UI workflow: Login, dashboard, search, filters, results, reports, graph pivots, and scan modules.
  - API workflow: Authenticated search, report retrieval, STIX-style export, IOC extraction, network intelligence, and SIEM search.
  - Evidence model: Result cards can be opened into reports with metadata, screenshots where available, JSON inspection, source context, and export options.
  - Control model: Tenant, role, license, IOC, case, audit, and service-status controls can be reviewed from the same platform.
- What this session avoids:
  - No pricing discussion.
  - No partnership commercials.
  - No market-size slides.
  - No client-facing brand story.
- Demo outcome:
  - By the end, the technical audience should know what Orion exposes, how the workflows behave, what the response objects look like, and which integration questions remain.
- Footer: Orion Technical 01

## Slide 02 - Demo environment and authorized test data

- Header: ORION - Technical
- Tag: Demo Setup
- Eyebrow: Inputs before the session
- Main heading: Demo environment and authorized test data
- Lead: The demo should run against a controlled tenant and permissioned targets so the technical team can focus on behavior, not legal or operational risk.
- Required environment items:
  - Demo tenant with known role and license state.
  - Demo analyst account for UI walkthrough.
  - API token issued for the same tenant context.
  - Known module access list for the demo user.
  - Browser access to the dashboard and API documentation.
- Required test inputs:
  - Permissioned demo domain: `security.example`.
  - Permissioned demo host or lab IP: `192.0.2.10`.
  - Demo email identity: `analyst@security.example`.
  - Demo username or handle: `orion_demo_user`.
  - Safe IOC sample file containing benign test indicators such as `CVE-2025-59374`, `security.example`, and `192.0.2.10`.
  - Known report document IDs from the demo dataset for report retrieval and STIX export.
- Scope boundaries:
  - Run active scans only on owned, lab, or explicitly authorized targets.
  - Do not demo sensitive identity, wanted-person, national-identity, exposed-camera, or geo-scanning workflows unless the environment, audience, permissions, and lawful-use approval are already confirmed.
- Footer: Orion Technical 02

## Slide 03 - Access, tenant context, and role-gated modules

- Header: ORION - Technical
- Tag: Access Control
- Eyebrow: First proof point
- Main heading: Access, tenant context, and role-gated modules
- Lead: Start by proving that Orion opens into a tenant-aware workspace and that module visibility is controlled by the user's role, tenant state, and license.
- Live demo steps:
  - Log in with the demo analyst account.
  - Confirm the dashboard workspace loads successfully.
  - Open the left sidebar and identify visible module groups.
  - Show which modules are available, gated, or hidden for the current role.
  - Open account or profile context to confirm tenant/user identity where available.
- What the technical team should verify:
  - UI access is authenticated.
  - The same user lands in the expected tenant context.
  - The sidebar reflects role/license state.
  - Disabled or unavailable features fail closed instead of exposing unauthorized actions.
- Suggested screen capture:
  - Login entry point.
  - Dashboard landing view.
  - Sidebar with available modules.
- Footer: Orion Technical 03

## Slide 04 - Demo route map

- Header: ORION - Technical
- Tag: Runbook
- Eyebrow: End-to-end sequence
- Main heading: Demo route map
- Lead: Use one consistent investigation scenario so the technical team can see how the same entity moves through search, reports, graph, scans, and API calls.
- Scenario:
  - Investigate `security.example`, `analyst@security.example`, and `192.0.2.10` as controlled demo entities.
- Phase 1 - UI investigation:
  - Dashboard search.
  - Consolidated search.
  - Filters and result triage.
  - Open report.
  - Review metadata and JSON.
  - Pivot to CTI Graph where enabled.
- Phase 2 - Live validation:
  - Entity API lookup for the demo email or username.
  - File Scanner / IOC extraction with the safe sample file.
  - Web Scan or Network Intel against the permissioned demo host.
- Phase 3 - API validation:
  - Authenticated API request.
  - Consolidated search endpoint.
  - Report retrieval endpoint.
  - STIX-format endpoint.
  - IOC extraction endpoint.
  - SIEM search endpoint if the tenant has demo logs.
- Phase 4 - Operations check:
  - Managed IOCs.
  - Case creation or case review.
  - Audit logs.
  - Service status / system settings where the demo role allows it.
- Footer: Orion Technical 04

## Slide 05 - UI demo: broad search to narrowed evidence

- Header: ORION - Technical
- Tag: Search Workflow
- Eyebrow: Indexed intelligence
- Main heading: UI demo: broad search to narrowed evidence
- Lead: Demonstrate how a technical analyst moves from a broad query into filtered, inspectable evidence.
- Live demo steps:
  - Open Consolidated Search.
  - Search for `security.example` or the agreed demo brand/domain.
  - Toggle search behavior controls where visible: semantic match, OR, AND, and full-query behavior.
  - Open Advanced filters.
  - Apply a safe filter such as network type, content category, date range, platform, country, or entity filter if available in the demo dataset.
  - Show result count, result cards, analytics or insight panels, selected-filter bar, and pagination/load-more behavior.
- What to point out:
  - Consolidated search is the first-pass triage route.
  - Dedicated modules can be used after broad triage if the analyst wants breach, exploit, defacement, social, feed, dump, or stealer-log focus.
  - Filters should reduce noise before anything is promoted into a report or case.
- Technical verification checklist:
  - Query executes in the selected module context.
  - Filters visibly affect the result set.
  - Result cards expose enough fields for triage.
  - Empty, loading, and no-result states are understandable.
- Footer: Orion Technical 05

## Slide 06 - UI demo: report inspection and raw evidence review

- Header: ORION - Technical
- Tag: Report Workflow
- Eyebrow: Evidence surface
- Main heading: UI demo: report inspection and raw evidence review
- Lead: Open a result and show that Orion's report view is an inspectable evidence surface, not only a presentation page.
- Live demo steps:
  - Open a result from the search results.
  - Review title, description or important content, web reference, source URL, published date, network, last-checked date, content tags, and freshness state where available.
  - Expand the metadata panel.
  - Review extracted content, sections, organizations, entities, people, or other attributes.
  - Open screenshot preview where available.
  - Open JSON viewer and inspect the raw structured record.
  - Show download/export/share/source actions where enabled.
  - Show AI summary or chat only if enabled in the demo environment.
- What the technical team should verify:
  - Report pages preserve source context.
  - Metadata is structured enough for downstream use.
  - JSON output is usable for analyst validation and API comparison.
  - Export actions behave consistently with permissions.
- Suggested screen capture:
  - Report page with metadata panel.
  - JSON viewer.
  - Screenshot area if available.
- Footer: Orion Technical 06

## Slide 07 - UI demo: CTI Graph and Social Intel pivots

- Header: ORION - Technical
- Tag: Graph Workflows
- Eyebrow: Relationship inspection
- Main heading: UI demo: CTI Graph and Social Intel pivots
- Lead: Use graph modules to prove that Orion can move from records and entities into relationship-oriented analysis.
- CTI Graph demo steps:
  - Open CTI Graph or pivot from a report where enabled.
  - Create or select a session.
  - Show cluster, document, property, grouped node, and directional connection concepts where present in the sample graph.
  - Search and highlight nodes.
  - Apply graph filters.
  - Switch between graph view and list view.
  - Toggle physics where available.
  - Export graph JSON or graph PDF where enabled.
- Social Intel demo steps:
  - Open Social Intel only with a consented demo username or demo image.
  - Create a session.
  - Run username/profile discovery or add an analyst-defined entity.
  - Review graph mode and list mode.
  - Open profile summary or metadata search where available.
- Technical verification checklist:
  - Sessions keep investigations separated.
  - Graph and list modes show the same investigation from different perspectives.
  - Exported graph outputs are usable for evidence handoff.
  - Social workflow remains controlled and consented.
- Footer: Orion Technical 07

## Slide 08 - UI demo: live entity checks and artifact review

- Header: ORION - Technical
- Tag: Live Validation
- Eyebrow: Targeted checks
- Main heading: UI demo: live entity checks and artifact review
- Lead: Demonstrate how Orion moves beyond indexed results into targeted lookup and artifact-scanning workflows.
- Entity API demo steps:
  - Open Entity API.
  - Run a demo email exposure lookup for `analyst@security.example`.
  - Run a demo social identifier lookup for `orion_demo_user` if that module is enabled.
  - Review pending, success, empty, and error states if the environment can safely demonstrate them.
- File Scanner / IOC extraction demo steps:
  - Upload the safe IOC sample file.
  - Verify extracted domains, IPs, URLs, CVEs, hashes, and language metadata where present.
  - Open or copy the structured result for comparison with the API response.
- APK scan demo steps:
  - Use only a benign internal sample APK when available.
  - Show metadata, permissions, crypto signals, network indicators, and tampering markers where returned.
- Technical verification checklist:
  - Live checks are authenticated and tenant-aware.
  - File inputs are handled safely.
  - Outputs are structured, not only visual.
  - Long-running or upstream-dependent requests expose an understandable processing state.
- Footer: Orion Technical 08

## Slide 09 - UI demo: Network Intel and Web Scans

- Header: ORION - Technical
- Tag: Network Validation
- Eyebrow: Permissioned external surface review
- Main heading: UI demo: Network Intel and Web Scans
- Lead: Use owned or lab targets to show how Orion validates domain, IP, and web-facing evidence.
- Network Intel demo steps:
  - Resolve `security.example` to IP context where configured.
  - Run host recon against the permitted demo host.
  - Run IP scan against `192.0.2.10` or the approved lab IP.
  - Run vulnerability scan only when the target and scope are explicitly approved.
- Web Scans demo steps:
  - Run a basic scan against the permissioned demo domain.
  - Show HTTP/security-header, repository, SEO, service, or port details based on the selected scan mode.
  - Open the scan result and show how it returns to report-style evidence handling.
- Support-method demo steps:
  - Run subdomain discovery, DNS/reverse check, or Wayback lookup against the permitted demo domain where enabled.
- Technical verification checklist:
  - The scan scope is visible and controlled.
  - Result fields are structured enough for integration.
  - Failures and empty results are clear.
  - Potentially intrusive scans are gated by role, approval, and lawful-use policy.
- Footer: Orion Technical 09

## Slide 10 - API demo: authenticate, search, and retrieve a report

- Header: ORION - Technical
- Tag: API Search
- Eyebrow: Backend integration proof
- Main heading: API demo: authenticate, search, and retrieve a report
- Lead: Show the same workflow through API calls so engineers can validate response shape, status handling, and downstream integration potential.
- API surfaces to show:
  - Auth: OAuth2 bearer-token protected requests.
  - Search: `POST /api/search/consolidated`.
  - Dedicated search options: `POST /api/search/strategic`, `POST /api/search/breach`, `POST /api/search/social`, `POST /api/search/exploit`, `POST /api/search/defacement`, and `POST /api/search/stealer/ioc`.
  - Report retrieval: `GET /api/search/{report_type}/{doc_id}` for supported report categories.
  - Screenshot retrieval: `GET /api/search/breach/screenshot/{filename}` where supported.
- Consolidated search request body to show in the terminal:
  - `q`: `security.example`
  - `page`: `1`
  - `network`: `all`
  - `category`: `all`
  - `content`: `all`
  - `daterange`: empty for first run, then scoped for second run.
  - `entity_filter`: optional structured filter after the first result set is visible.
  - `fullsearch`, `must`, and `safe`: show values used in the demo and explain why.
- Response checks:
  - HTTP status code.
  - Result array or grouped result object.
  - Document identifier for report retrieval.
  - Network/source fields.
  - Title/content fields.
  - IOC, URL, country, platform, or entity fields where returned.
- Error checks:
  - 401 when no token is supplied.
  - 403 when the token lacks access.
  - 422 when required request fields are missing or malformed.
- Footer: Orion Technical 10

## Slide 11 - API demo: STIX, IOC extraction, and network intelligence

- Header: ORION - Technical
- Tag: API Outputs
- Eyebrow: Structured handoff
- Main heading: API demo: STIX, IOC extraction, and network intelligence
- Lead: Prove that Orion outputs can be used by downstream systems, not only by the web UI.
- STIX-format demo:
  - Start from a known report document ID.
  - Request supported STIX output such as `GET /api/search/breach/stix/{doc_id}`, `GET /api/search/strategic/stix/{doc_id}`, `GET /api/search/defacement/stix/{doc_id}`, `GET /api/search/exploit/stix/{doc_id}`, `GET /api/search/social/stix/{doc_id}`, `GET /api/search/chat/stix/{doc_id}`, or `GET /api/search/news/stix/{doc_id}`.
  - Verify bundle type, object count, indicator objects, observed-data objects, labels, marking definitions, and external references.
- IOC extraction demo:
  - Submit the safe IOC sample file to `POST /api/ioc/extract`.
  - Verify filename, file type, extracted text length, status, original filename, and extracted IOC objects.
- Network intelligence demo:
  - Resolve a permitted domain through `POST /api/netintel/resolve_ip`.
  - Scan an approved IP through `POST /api/netintel/ipscanner`.
  - Run URL vulnerability review through `POST /api/netintel/url_vulnerability_scan` only on authorized targets.
- Support-method demo:
  - Use `POST /api/urlscan/subdomains`, `POST /api/urlscan/dns`, and `POST /api/urlscan/wayback` where enabled.
- Technical verification checklist:
  - Response objects can be parsed without UI scraping.
  - IOC outputs can feed SIEM/SOAR/TIP workflows.
  - STIX outputs preserve useful context.
  - Active scans remain permissioned and controlled.
- Footer: Orion Technical 11

## Slide 12 - API demo: SIEM log injection and tenant-scoped search

- Header: ORION - Technical
- Tag: SIEM Integration
- Eyebrow: Tenant-scoped operational data
- Main heading: API demo: SIEM log injection and tenant-scoped search
- Lead: Show how Orion can handle tenant-scoped operational log records when this API path is enabled in the demo environment.
- Injection demo:
  - Use `POST /api/index/injection` to submit a small batch of safe demo SIEM/raw log records.
  - Include fields such as event type, host, raw message, severity, source, tags, timestamp, and user.
  - Confirm the response returns indexed IDs, target index, and indexed count.
- Search demo:
  - Use `POST /api/profile/event-management/siem/search`.
  - Search for the demo event terms: `admin@alerts.example`, `login-0015.security.example`, `10.10.0.15`, and `auth_failure`.
  - Verify total hits, page count, batch size, event IDs, hashes, host, raw message, severity, source, tags, timestamp, and tenant scope.
- Important technical note:
  - The tenant context should come from the authenticated user/token, not from a client-supplied tenant ID in the request body.
- Technical verification checklist:
  - Demo logs are isolated to the authenticated tenant.
  - Search returns only tenant-authorized records.
  - Raw fields remain available for analyst inspection.
  - Response shape is suitable for SIEM/SOAR enrichment testing.
- Footer: Orion Technical 12

## Slide 13 - Operations demo: IOCs, cases, audit, and service status

- Header: ORION - Technical
- Tag: Operations
- Eyebrow: Control-plane review
- Main heading: Operations demo: IOCs, cases, audit, and service status
- Lead: A technical evaluation should include the operational surfaces that make Orion manageable for real teams.
- Managed IOC demo:
  - Open the tenant IOC management page.
  - Add a demo value such as `security.example` or `analyst@security.example` to the appropriate category.
  - Show category browsing, search, add, remove, and clear behavior where available.
  - Return to tenant homepage and confirm the IOC can support downstream alerting or scanning actions where enabled.
- Case management demo:
  - Create or open a demo case.
  - Add title, description, case type, intake source, status, severity, priority, tags, and primary entity.
  - Add evidence or artifacts if the environment supports it.
  - Review case detail sections and closure fields.
- Audit and admin demo:
  - Open audit logs if the role permits it.
  - Filter or search for the demo user's recent activity.
  - Open system settings or service status only with an admin/maintainer role.
- Technical verification checklist:
  - Monitored values are tenant-scoped.
  - Cases preserve investigation context.
  - Audit records are searchable/exportable where enabled.
  - Service visibility is available for operational troubleshooting.
- Footer: Orion Technical 13

## Slide 14 - Security, privacy, and lawful-use guardrails

- Header: ORION - Technical
- Tag: Guardrails
- Eyebrow: Technical boundaries
- Main heading: Security, privacy, and lawful-use guardrails
- Lead: Before any production integration, the technical team should confirm how sensitive workflows are gated, logged, and approved.
- Demo rules:
  - Use only controlled demo identities, demo domains, demo files, demo social handles, and approved lab infrastructure.
  - Keep active scanning off public third-party assets unless written authorization exists.
  - Keep identity-heavy modules disabled or out of scope unless they are legally approved for the tenant and use case.
  - Treat exposed-camera, geo-scanning, national-identity, and wanted-person workflows as restricted modules, not default vendor-demo content.
- Controls to verify:
  - Authentication and token expiry behavior.
  - Role and license gating.
  - Tenant isolation.
  - Audit logging.
  - Error handling for forbidden actions.
  - Data-retention and export rules.
  - Rate-limit and abuse-prevention expectations.
- Technical acceptance question:
  - Can the buyer's engineers describe exactly who can run which lookup, against which target class, with what audit record and approval boundary?
- Footer: Orion Technical 14

## Slide 15 - Technical acceptance criteria and next engineering actions

- Header: ORION - Technical
- Tag: Acceptance Criteria
- Eyebrow: Close for technical team
- Main heading: Technical acceptance criteria and next engineering actions
- Lead: Close the session by turning observations into engineering decisions, not sales commitments.
- Acceptance criteria:
  - Authentication: API calls succeed with a valid token and fail predictably with invalid, missing, or unauthorized credentials.
  - Search: UI and API searches return understandable results for the same demo entities.
  - Reports: Report pages and report APIs expose usable metadata, source context, and raw structured data.
  - STIX: Supported report types can produce parseable STIX-style outputs.
  - Scans: Entity, file, web, and network checks run only within authorized scope and return structured outputs.
  - Graphs: CTI Graph and Social Intel demonstrate session handling, relationship review, list view, and export behavior where enabled.
  - Tenant controls: IOCs, cases, audit logs, and admin settings are role-gated and tenant-aware.
  - Error handling: Loading, pending, empty, failed, 401, 403, and 422 states are visible and understandable.
- Engineering follow-up items:
  - Confirm production endpoint list and enabled modules.
  - Confirm authentication flow and token lifecycle.
  - Confirm rate limits, quotas, request timeouts, and long-running scan behavior.
  - Confirm data retention, export policy, and audit-log requirements.
  - Confirm webhook, polling, SIEM, SOAR, and ticketing integration options.
  - Confirm staging tenant, sample payload pack, and endpoint contract pack.
- Closing statement:
  - The demo is successful when the technical team can trace one controlled entity from search to report, from report to graph, from UI to API, and from API output into their own engineering workflow.
- Footer: Orion Technical 15

---

## Presenter Notes - Live demo checklist

- Before the call:
  - Confirm demo tenant, role, license, and module visibility.
  - Confirm API token, token expiry, and bearer-token request format.
  - Confirm controlled test entities: `security.example`, `analyst@security.example`, `orion_demo_user`, and approved lab IP.
  - Prepare safe IOC sample file.
  - Prepare known report document IDs for report and STIX retrieval.
  - Prepare one successful search, one empty search, and one permission-denied example if possible.
- During the call:
  - Keep the same entity across UI and API examples.
  - Show raw JSON whenever engineers ask how the output will integrate.
  - Point out role/license gating instead of hiding it.
  - Do not run high-risk scans live unless the audience has already approved the target scope.
- After the call:
  - Send endpoint list, sample payloads, response examples, and integration assumptions.
  - Record open questions around auth, rate limits, retention, deployment model, and allowed modules.
  - Separate commercial follow-up from technical follow-up.
