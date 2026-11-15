import React from 'react';
import { InfoView } from './InfoPageLayout';
import { Bullets, Callout, ContactCard, LegalDocument, LegalSection, P, linkClass } from './LegalPage';
import { COMPANY, SECURITY_REPORT_URL } from '../company';

interface TermsProps {
  onNavigate: (view: InfoView) => void;
}

const LAST_UPDATED = 'November 15, 2026';

const buildSections = (onNavigate: (view: InfoView) => void): LegalSection[] => {
  const link = (to: InfoView, label: string) => (
    <button onClick={() => onNavigate(to)} className={linkClass}>
      {label}
    </button>
  );

  return [
    {
      id: 'agreement',
      title: 'Agreement to these terms',
      body: (
        <>
          <P>
            These Terms of Service (&ldquo;Terms&rdquo;) are an agreement between you and {COMPANY.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;). They
            cover this website, orionintelligence.org, and the Orion Intelligence web platform, APIs, browser extension, and related services we operate
            (together, the &ldquo;Service&rdquo;). By using the Service, you agree to these Terms.
          </P>
          <P className="mt-4">
            If you use the Service for an organization, you confirm that you can accept these Terms for it, and &ldquo;you&rdquo; includes that
            organization. If your organization has a signed agreement with us, such as an order form or master agreement, that agreement takes
            precedence where it differs from these Terms.
          </P>
        </>
      ),
    },
    {
      id: 'accounts',
      title: 'Accounts and access',
      body: (
        <Bullets
          items={[
            'Accounts are issued by us or by your organization’s administrator. The Service is for professional use and is not intended for anyone under the age of majority.',
            'Give accurate account information and keep it up to date.',
            'Keep your credentials and API keys confidential, and use multi-factor authentication where it is available.',
            'You are responsible for activity under your account. Tell us promptly if you suspect unauthorized access.',
          ]}
        />
      ),
    },
    {
      id: 'acceptable-use',
      title: 'Acceptable use',
      body: (
        <>
          <P className="mb-5">
            Use the Service only for lawful and authorized cybersecurity, OSINT, threat intelligence, investigation, monitoring, and analysis work. You
            must not:
          </P>
          <Bullets
            items={[
              'Break any law, or infringe the privacy, intellectual property, or other rights of others.',
              'Use information from the Service to harass, stalk, threaten, expose, or discriminate against any person.',
              'Use exposed credentials or other data from the Service to access accounts or systems you are not authorized to access.',
              'Scan, probe, or test networks, domains, applications, or devices that you do not own or have permission to test.',
              'Use the Service to decide a person’s eligibility for employment, credit, insurance, housing, or similar purposes.',
              'Resell, redistribute, or publish data from the Service except as your subscription allows.',
              'Bypass or interfere with security controls, quotas, rate limits, tenant separation, or the operation of the Service.',
              'Copy, reverse engineer, or build a competing product from the Service, except where the law expressly allows it.',
              'Upload malicious files other than to the analysis features built for that purpose, or content you have no right to share.',
            ]}
          />
        </>
      ),
    },
    {
      id: 'scans',
      title: 'Scans, lookups, and monitoring',
      body: (
        <P>
          Some features contact third-party systems directly, including vulnerability, web, and network scans and live profile lookups. You are
          responsible for having authorization for every target you submit and for complying with the law and any terms that apply to the target. We
          may refuse, limit, or stop scans or lookups that appear unauthorized or harmful, and we keep records of scan activity.
        </P>
      ),
    },
    {
      id: 'intelligence',
      title: 'Intelligence data',
      body: (
        <>
          <P>
            The Service surfaces information collected from open, social, technical, deep-web, dark-web, breach, and other sources. We do not create
            or verify that content, and it may be incomplete, outdated, or inaccurate. Orion is not a consumer reporting agency, and its data must not
            be used as a consumer report.
          </P>
          <div className="mt-5">
            <Callout title="Verify before acting.">
              Confirm findings independently before taking consequential action, and handle information about people lawfully. Our{' '}
              {link('privacy', 'Privacy Policy')} explains how we handle it.
            </Callout>
          </div>
        </>
      ),
    },
    {
      id: 'your-content',
      title: 'Your content',
      body: (
        <P>
          You keep all rights to the content you put into the Service, such as search terms, cases, notes, uploaded files, and monitored assets. You
          give us a limited right to host, process, and display it only to provide, secure, and support the Service for you. You are responsible for
          having the rights needed to submit your content.
        </P>
      ),
    },
    {
      id: 'our-ip',
      title: 'Our software and intellectual property',
      body: (
        <>
          <P>
            The Service, its software, design, documentation, and the Orion name and marks belong to {COMPANY.legalName} and its licensors. Subject to
            these Terms and your subscription, we give you a limited, non-exclusive, non-transferable right to use the Service for your internal
            purposes during your subscription.
          </P>
          <P className="mt-4">
            Source code we make publicly visible remains proprietary unless the license in its repository says otherwise. If you send us feedback or
            suggestions, we may use them without obligation to you.
          </P>
        </>
      ),
    },
    {
      id: 'api',
      title: 'API use',
      body: (
        <P>
          Keep API keys confidential and use the API within the documented limits and quotas. We may throttle, suspend, or revoke keys that are
          exposed, abused, or used in a way that harms the Service or other customers. The {link('api-docs', 'API reference')} describes
          the available endpoints.
        </P>
      ),
    },
    {
      id: 'fees',
      title: 'Subscriptions and fees',
      body: (
        <P>
          Paid plans, prices, and billing terms are set out in your quote or order. Fees are due as stated there and do not include taxes. Fees are
          non-refundable, except for service credits under the SLA or where the law requires otherwise. We may suspend access for overdue amounts
          after giving notice. Trial and evaluation access may be changed or ended at any time and is not covered by the SLA.
        </P>
      ),
    },
    {
      id: 'third-party',
      title: 'Third-party services',
      body: (
        <P>
          The Service can connect to third-party data sources, enrichment and AI services, and notification tools. Those services are governed by
          their own terms and privacy practices, and we are not responsible for them. Review them before enabling an integration.
        </P>
      ),
    },
    {
      id: 'availability',
      title: 'Availability and support',
      body: (
        <P>
          Our uptime, support response, maintenance, and service credit commitments for paid subscriptions are in the{' '}
          {link('sla', 'Service Level Agreement')}. We may add, change, or remove features over time, and we will give reasonable notice
          before removing functionality that is material to a paid subscription.
        </P>
      ),
    },
    {
      id: 'termination',
      title: 'Suspension and termination',
      body: (
        <>
          <P>
            We may suspend or end your access if you breach these Terms, create a security risk or legal exposure for us or others, or do not pay fees
            when due. We will give notice where it is practical to do so. You may stop using the Service at any time; any subscription commitment in
            your order still applies.
          </P>
          <P className="mt-4">
            When access ends, your right to use the Service stops. Where the Service supports it, we will help you export your content on request
            before or shortly after termination; after that, we delete it according to our retention practices.
          </P>
        </>
      ),
    },
    {
      id: 'disclaimers',
      title: 'Disclaimers',
      body: (
        <P>
          Except as expressly stated in these Terms or the SLA, the Service and all intelligence data are provided &ldquo;as is&rdquo; and &ldquo;as
          available&rdquo;, without warranties of any kind, to the extent the law allows. We do not guarantee that results are complete or accurate or
          that the Service will detect every threat or exposure.
        </P>
      ),
    },
    {
      id: 'liability',
      title: 'Limitation of liability',
      body: (
        <P>
          To the extent the law allows, neither party is liable for indirect, incidental, special, consequential, or punitive damages, or for lost
          profits, revenue, data, or goodwill. Our total liability for all claims relating to the Service is limited to the amount you paid us for the
          Service in the 12 months before the event giving rise to the claim. These limits do not apply where the law does not permit them.
        </P>
      ),
    },
    {
      id: 'indemnity',
      title: 'Indemnity',
      body: (
        <P>
          You will defend and indemnify {COMPANY.legalName} against third-party claims arising from your content, or from your scans or other use of
          the Service in breach of these Terms or the law.
        </P>
      ),
    },
    {
      id: 'changes',
      title: 'Changes to these terms',
      body: (
        <P>
          We may update these Terms as the Service or the law changes. We will post the new version here and revise the &ldquo;Updated&rdquo; date, and
          we will give notice of material changes before they take effect. Continuing to use the Service after that date means you accept the updated
          Terms.
        </P>
      ),
    },
    {
      id: 'contact',
      title: 'Contact us',
      body: (
        <ContactCard
          intro={<>For questions about these Terms, contact us:</>}
          email={COMPANY.supportEmail}
          note={
            <>
              To report a security vulnerability, use our{' '}
              <a href={SECURITY_REPORT_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>private disclosure form</a>. For anything
              else, use the {link('contact', 'contact page')}.
            </>
          }
        />
      ),
    },
  ];
};

const Terms: React.FC<TermsProps> = ({ onNavigate }) => (
  <LegalDocument
    eyebrow="Terms of Service"
    title={
      <>
        The ground rules for <span className="text-blue-600 dark:text-blue-500">using Orion.</span>
      </>
    }
    description="The terms that apply when you visit orionintelligence.org or use the Orion Intelligence platform, APIs, and related services."
    lastUpdated={LAST_UPDATED}
    glance={[
      'Use Orion only for lawful, authorized security and intelligence work.',
      'Scan only systems you own or have permission to test.',
      'You keep ownership of the content you put into Orion.',
      'Uptime and support commitments are in our SLA.',
    ]}
    sections={buildSections(onNavigate)}
  />
);

export default Terms;
