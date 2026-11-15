// Company facts and public contact points, shared by the footer, homepage, and the About / Contact / Privacy pages.
export const COMPANY = {
  legalName: 'Genesis Technologies',
  product: 'Orion Intelligence',
  headquarters: 'St. Petersburg, Florida',
  country: 'United States',
  founded: '2023',
  size: '11–50 employees',
  industry: 'Computer and Network Security',
  supportEmail: 'support@orionintelligence.org',
  privacyEmail: 'privacy@orionintelligence.org',
  platformUrl: 'https://try.orionintelligence.org/',
  docsUrl: 'https://orion-search.readthedocs.io',
  statusUrl: 'https://uptime.orionintelligence.org/status/orion-intelligence',
  reportingPortalUrl: 'https://orionleaks.com/',
  linkedInUrl: 'https://www.linkedin.com/showcase/orion-by-genesis-technologies/',
} as const;

// The public repository; the platform repository itself is private.
export const GITHUB_URL = 'https://github.com/Orion-Intelligence/Orion-Intelligence-Solution';
export const SECURITY_REPORT_URL = `${GITHUB_URL}/security/advisories/new`;

export const COPYRIGHT = `© ${new Date().getFullYear()} ${COMPANY.legalName}. All rights reserved.`;

// Published service levels (see /sla). Keep the SLA page, Pricing, About, and the homepage stat in step with these.
export const SLA = {
  uptime: '99.5%',
  responseCritical: '4 hours',
  responseHigh: '8 hours',
  responseNormal: '1 business day',
  creditTier1: '10%',
  creditTier2: '25%',
  creditTier2Below: '99.0%',
  claimWindowDays: 30,
  maintenanceNoticeHours: 48,
  supportHours: 'Monday to Friday, 9:00 to 18:00 US Eastern Time, excluding US federal holidays',
} as const;
