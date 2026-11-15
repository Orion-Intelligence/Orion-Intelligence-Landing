import React from 'react';
import { InfoView } from './InfoPageLayout';
import { Bullets, ContactCard, LegalDocument, LegalSection, P, Table, linkClass } from './LegalPage';
import { COMPANY, SECURITY_REPORT_URL, SLA } from '../company';

interface SlaProps {
  onNavigate: (view: InfoView) => void;
}

const LAST_UPDATED = 'November 15, 2026';

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
          This Service Level Agreement (&ldquo;SLA&rdquo;) sets out the availability, support, and service credit commitments {COMPANY.legalName}{' '}
          (&ldquo;we&rdquo;, &ldquo;us&rdquo;) makes for the hosted Orion Intelligence platform we operate at try.orionintelligence.org, including its
          web application and APIs (the &ldquo;Service&rdquo;). It applies to customers with an active paid subscription and forms part of our{' '}
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
    title: 'Availability commitment',
    body: (
      <>
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8 rounded-2xl border border-blue-500/20 bg-blue-500/[0.05] p-6 md:p-7">
          <p className="text-5xl md:text-6xl font-black tracking-tight text-blue-600 dark:text-blue-400 tabular-nums">{SLA.uptime}</p>
          <p className="text-sm md:text-[15px] leading-[1.7] text-slate-600 dark:text-white/55 font-medium">
            <strong className="font-extrabold text-slate-900 dark:text-white">Monthly Uptime commitment.</strong> That allows for about 3.6 hours of
            Downtime in a 30-day month, not counting the exclusions below.
          </p>
        </div>
        <P>
          <strong className="font-extrabold text-slate-900 dark:text-white">Monthly Uptime</strong> is the percentage of minutes in a calendar month
          (UTC) in which the Service is not in Downtime: total minutes minus Downtime minutes, divided by total minutes.
        </P>
        <P className="mt-4">
          <strong className="font-extrabold text-slate-900 dark:text-white">Downtime</strong> is time when users of your tenant cannot sign in, or the web
          application or API fails to respond or returns server errors for core functions such as search and case access, as confirmed by our
          external monitoring and service logs. Slower responses, or a single feature that is unavailable while core use continues, are not counted
          as Downtime.
        </P>
      </>
    ),
  },
  {
    id: 'exclusions',
    title: 'What is not counted',
    body: (
      <>
        <P className="mb-5">The following do not count as Downtime:</P>
        <Bullets
          items={[
            'Scheduled maintenance announced in advance, as described below.',
            'Urgent maintenance needed to fix a critical security vulnerability or respond to an active threat.',
            'Problems caused by you, your users, equipment, networks, or integrations, or by use that breaches the Terms of Service.',
            'Unavailability of third-party data sources, scan or lookup targets, and integrations such as enrichment, AI, or notification services.',
            'Suspension of access under the Terms of Service.',
            'Events beyond our reasonable control, such as natural disasters, widespread internet or power failures, or government action.',
            'Features labelled beta, preview, or experimental.',
          ]}
        />
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
        <P>
          Live availability and incident history are published on our {statusLink}. While an incident affects availability, we post updates there
          until it is resolved. If a security incident affects your data, we will notify you without undue delay and as required by law.
        </P>
        <P className="mt-4">
          Security researchers can{' '}
          <ExternalLink href={SECURITY_REPORT_URL}>report a vulnerability privately</ExternalLink>; we aim to acknowledge new reports within 8 hours.
        </P>
      </>
    ),
  },
  {
    id: 'credits',
    title: 'Service credits',
    body: (
      <>
        <P className="mb-6">If Monthly Uptime falls below the commitment, you can claim a credit against the monthly fee for the Service:</P>
        <Table
          head={['Monthly Uptime', 'Service credit']}
          emphasizeLast
          rows={[
            [`Below ${SLA.uptime}, at least ${SLA.creditTier2Below}`, `${SLA.creditTier1} of the monthly fee`],
            [`Below ${SLA.creditTier2Below}`, `${SLA.creditTier2} of the monthly fee`],
          ]}
        />
        <div className="mt-6">
          <Bullets
            items={[
              <>
                To claim, email{' '}
                <a href={`mailto:${COMPANY.supportEmail}`} className={linkClass}>{COMPANY.supportEmail}</a> within {SLA.claimWindowDays} days after the end
                of the affected month, with your tenant name and the dates and times of the Downtime. We verify claims against our monitoring records.
              </>,
              'Credits are applied to future invoices for the Service. They are not refundable or exchangeable for cash.',
              `Credits are capped at ${SLA.creditTier2} of the monthly fee for the affected month. For annual billing, the monthly fee is one twelfth of the annual fee.`,
              'Credits are available to accounts in good standing and are the sole remedy for not meeting the availability commitment.',
            ]}
          />
        </div>
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
        intro="For support, service credit claims, or questions about this SLA, contact us:"
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
        Availability you can <span className="text-blue-600 dark:text-blue-500">plan around.</span>
      </>
    }
    description="The uptime, support response, maintenance, and service credit commitments for the hosted Orion Intelligence platform."
    lastUpdated={LAST_UPDATED}
    glance={[
      `${SLA.uptime} monthly uptime for the hosted platform.`,
      `First response to critical issues within ${SLA.responseCritical}.`,
      `Service credits of ${SLA.creditTier1} or ${SLA.creditTier2} if we miss the target.`,
      'Live availability is public on our status page.',
    ]}
    sections={buildSections(onNavigate)}
  />
);

export default Sla;
