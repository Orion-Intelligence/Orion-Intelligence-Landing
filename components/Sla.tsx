import React from 'react';
import { InfoView } from './InfoPageLayout';
import { Bullets, ContactCard, LegalDocument, LegalSection, P, Table, linkClass } from './LegalPage';
import { COMPANY, SECURITY_REPORT_URL, SLA } from '../company';

interface SlaProps {
  onNavigate: (view: InfoView) => void;
}

const LAST_UPDATED = 'November 15, 2026';

const PLATFORM_MONITOR = 'Try Orion Intelligence';

const ExternalLink: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={linkClass}>
    {children}
  </a>
);

const statusLink = <ExternalLink href={COMPANY.statusUrl}>status page</ExternalLink>;

const buildSections = (onNavigate: (view: InfoView) => void): LegalSection[] => [
  {
    id: 'scope',
    title: 'Scope',
    body: (
      <>
        <P>
          This Service Level Agreement (&ldquo;SLA&rdquo;) sets out the support, maintenance, and incident communication commitments{' '}
          {COMPANY.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) makes for the hosted Orion Intelligence platform we operate at
          try.orionintelligence.org, including its web application and APIs (the &ldquo;Service&rdquo;). It applies to customers with an active paid
          subscription and forms part of our{' '}
          <button onClick={() => onNavigate('terms')} className={linkClass}>Terms of Service</button>. If you have a signed agreement with different
          service levels, that agreement applies instead.
        </P>
        <P className="mt-4">
          This SLA does not cover free access, trials, or evaluations; the public exposure check on this website; self-hosted or customer-operated
          deployments; or features labelled beta, preview, or experimental.
        </P>
      </>
    ),
  },
  {
    id: 'availability',
    title: 'Availability',
    body: (
      <>
        <P>
          We run the Service around the clock and monitor it continuously from outside our own network. We do not currently commit to a numeric
          uptime percentage. Instead, we publish the Service&rsquo;s measured availability so you can see exactly how it performs.
        </P>
        <P className="mt-4">
          On our {statusLink}, the <strong className="font-extrabold text-slate-900 dark:text-white">{PLATFORM_MONITOR}</strong> component tracks the
          hosted platform covered by this SLA, with daily history for the last 90 days. The page also tracks documentation sites, related services,
          and individual data collection feeds; those components, and the page&rsquo;s combined figure, are not a measure of platform availability.
        </P>
      </>
    ),
  },
  {
    id: 'maintenance',
    title: 'Maintenance',
    body: (
      <P>
        We schedule planned maintenance for low-traffic periods and announce it on our {statusLink} at least {SLA.maintenanceNoticeHours} hours in
        advance. If an urgent security fix cannot wait, we may apply it with shorter notice and will post an update on the status page.
      </P>
    ),
  },
  {
    id: 'support',
    title: 'Support and response times',
    body: (
      <>
        <P className="mb-6">
          Report issues to{' '}
          <a href={`mailto:${COMPANY.supportEmail}`} className={linkClass}>{COMPANY.supportEmail}</a> or through Help &amp; Support in the platform. We
          assign a severity based on impact and aim to send a first response within these times:
        </P>
        <Table
          head={['Severity', 'Examples', 'First response']}
          emphasizeLast
          rows={[
            [
              'Critical',
              'The Service is unavailable, or sign-in, search, or case access fails for all users of your tenant; or a suspected security incident affects your data.',
              SLA.responseCritical,
            ],
            ['High', 'A core feature is failing or badly degraded for many users, with no reasonable workaround.', SLA.responseHigh],
            ['Normal', 'Questions, minor defects, configuration help, and feature requests.', SLA.responseNormal],
          ]}
        />
        <P className="mt-6">
          Response times are measured from when we receive your report during support hours: {SLA.supportHours}. A first response means a member of our
          team has reviewed the issue and replied; the time to resolve depends on the problem. Including your tenant, the users affected, when the
          problem started, and steps or screenshots helps us respond faster.
        </P>
      </>
    ),
  },
  {
    id: 'status',
    title: 'Status and incident updates',
    body: (
      <>
        <Bullets
          items={[
            <>Live availability and incident history are published on our {statusLink}.</>,
            'While an incident affects the Service, we post updates on the status page until it is resolved.',
            'If a security incident affects your data, we will notify you without undue delay and as required by law.',
            <>
              Security researchers can <ExternalLink href={SECURITY_REPORT_URL}>report a vulnerability privately</ExternalLink>; we aim to acknowledge new
              reports within 8 hours.
            </>,
          ]}
        />
      </>
    ),
  },
  {
    id: 'exclusions',
    title: 'What this SLA does not cover',
    body: (
      <>
        <P className="mb-5">Our response commitments do not apply to problems caused by:</P>
        <Bullets
          items={[
            'You, your users, equipment, networks, or integrations, or use that breaches the Terms of Service.',
            'Third-party data sources, scan or lookup targets, and integrations such as enrichment, AI, or notification services.',
            'Suspension of access under the Terms of Service.',
            'Events beyond our reasonable control, such as natural disasters, widespread internet or power failures, or government action.',
          ]}
        />
      </>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this SLA',
    body: (
      <P>
        We may update this SLA as the Service changes. We will post the new version here and revise the &ldquo;Updated&rdquo; date. A change that
        reduces these commitments takes effect at your next renewal.
      </P>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: (
      <ContactCard
        intro="For support or questions about this SLA, contact us:"
        email={COMPANY.supportEmail}
        note={
          <>
            Check the live {statusLink} for current availability, or use the{' '}
            <button onClick={() => onNavigate('contact')} className={linkClass}>contact page</button>.
          </>
        }
      />
    ),
  },
];

const Sla: React.FC<SlaProps> = ({ onNavigate }) => (
  <LegalDocument
    eyebrow="Service Level Agreement"
    title={
      <>
        Support you can <span className="text-blue-600 dark:text-blue-500">plan around.</span>
      </>
    }
    description="The support response, maintenance, and incident communication commitments for the hosted Orion Intelligence platform."
    lastUpdated={LAST_UPDATED}
    glance={[
      `First response to critical issues within ${SLA.responseCritical}.`,
      `Planned maintenance announced at least ${SLA.maintenanceNoticeHours} hours ahead.`,
      'Measured availability is public on our status page.',
      'Incident updates are posted until each incident is resolved.',
    ]}
    sections={buildSections(onNavigate)}
  />
);

export default Sla;
