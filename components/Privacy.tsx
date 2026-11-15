import React from 'react';
import { InfoView } from './InfoPageLayout';
import { Bullets, Checks, ContactCard, Item, LegalDocument, LegalSection, P, linkClass } from './LegalPage';
import { COMPANY } from '../company';

interface PrivacyProps {
  onNavigate: (view: InfoView) => void;
}

const LAST_UPDATED = 'November 15, 2026';
const EXTENSION_POLICY_URL = `${COMPANY.platformUrl}privacy/extension`;

const buildSections = (onNavigate: (view: InfoView) => void): LegalSection[] => [
  {
    id: 'scope',
    title: 'Scope and responsibility',
    body: (
      <>
        <P>
          This policy explains how {COMPANY.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;) handles information when you visit orionintelligence.org (this
          website) and when you use the Orion Intelligence web platform, APIs, and support channels we operate (together, the &ldquo;Service&rdquo;). The
          Orion Social browser extension is covered by a{' '}
          <a href={EXTENSION_POLICY_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>separate privacy policy</a>.
        </P>
        <P className="mt-4">
          If your employer, customer, tenant administrator, or another organization provides your account or operates its own deployment, that
          organization may control the information processed in that instance. Its privacy notice and instructions may apply in addition to, or
          instead of, this policy. Questions about an organization-managed account should first go to that organization.
        </P>
        <P className="mt-4">
          Use of the Service is also governed by our{' '}
          <button onClick={() => onNavigate('terms')} className={linkClass}>Terms of Service</button>.
        </P>
      </>
    ),
  },
  {
    id: 'website',
    title: 'This website and the exposure check',
    body: (
      <>
        <P className="mb-5">This website has no accounts or sign-in. It processes a small amount of information to work:</P>
        <div className="space-y-4">
          <Item title="Exposure check searches">
            When you search an email address or username on the homepage, that identifier is sent to Orion&rsquo;s search service at
            try.orionintelligence.org to look for matching records in indexed stealer-log data. Searches are subject to a daily quota and to the usage
            and security logging described below.
          </Item>
          <Item title="Results cached on your device">
            To avoid repeat lookups, your browser keeps recent search results in local storage for up to 24 hours, at most 100 searches. This copy stays
            on your device; you can remove it by clearing this site&rsquo;s data in your browser.
          </Item>
          <Item title="Preferences">Your theme and language choices are saved in local storage so the site remembers them on your next visit.</Item>
          <Item title="Hosting and third-party resources">
            Our hosting provider records standard request logs, such as IP address, browser, requested page, and time, to deliver and secure the site.
            Fonts load from Google Fonts, so your browser sends your IP address and browser details to Google when a page loads. Links to DeepIntel.si,
            GitHub, social networks, and the reporting portal lead to services with their own privacy practices.
          </Item>
          <Item title="Messages you send us">
            The contact form opens your own email app; nothing is submitted through this website. When you email us, we receive the details you choose
            to include.
          </Item>
        </div>
      </>
    ),
  },
  {
    id: 'collect',
    title: 'Information we collect',
    body: (
      <>
        <P className="mb-5">On the platform, the information processed depends on the features you use and how your instance is configured. It may include:</P>
        <div className="space-y-4">
          <Item title="Account and organization information">
            Your name, username, email address, organization or tenant, role, account preferences, authentication and recovery details, multi-factor
            authentication settings, and information an administrator supplies to create or manage your account.
          </Item>
          <Item title="Content and investigative activity">
            Search terms, investigation targets, cases, notes, reports, monitored profiles or assets, alerts, exports, uploaded files, API requests,
            extension results, and other content you submit, generate, or choose to store in the Service.
          </Item>
          <Item title="Usage, audit, and security information">
            Actions performed in the Service, timestamps, search and feature activity, login and authentication events, administrative changes, exports,
            errors, and audit records used to secure the Service and support organizational oversight.
          </Item>
          <Item title="Device, connection, and communication information">
            IP address, browser and device details, user-agent information, requested URLs, session identifiers, cookies or local-storage values,
            diagnostic logs, and the contents of support, account, or security communications you send us.
          </Item>
        </div>
      </>
    ),
  },
  {
    id: 'intelligence',
    title: 'Investigative and threat-intelligence data',
    body: (
      <>
        <P>
          The Service helps authorized users search, correlate, monitor, and analyze information from open, social, technical, deep-web, dark-web,
          breach, and other intelligence sources. That material may contain identifiers and other information about people, accounts, organizations,
          infrastructure, or incidents, including information the subject did not provide directly to us.
        </P>
        <div className="mt-5 rounded-2xl border border-blue-500/20 bg-blue-500/[0.05] p-5 md:p-6">
          <p className="text-sm md:text-[15px] leading-[1.75] text-slate-600 dark:text-white/55 font-medium">
            <strong className="font-extrabold text-slate-900 dark:text-white">Responsible use matters.</strong> Authorized users and their organizations
            are responsible for having a lawful purpose and appropriate authority for their searches, monitoring, exports, and downstream use.
            Intelligence may be incomplete, outdated, duplicated, or inaccurate and should be independently verified before consequential action is
            taken.
          </p>
        </div>
      </>
    ),
  },
  {
    id: 'use',
    title: 'How we use information',
    body: (
      <>
        <Bullets
          items={[
            'Provide, operate, maintain, and configure the Service and its APIs.',
            'Authenticate users, manage tenants and permissions, and protect accounts.',
            'Run the searches, scans, collections, monitoring, analysis, alerts, reports, and exports you request.',
            'Enable case management, collaboration, administration, and audit functions.',
            'Detect abuse, investigate security events, troubleshoot errors, and enforce applicable terms.',
            'Respond to support requests and send operational, account, and security notices.',
            'Understand performance and improve the reliability, safety, and functionality of the Service.',
            'Comply with law, lawful requests, and our legal obligations, and protect legal rights.',
          ]}
        />
        <P className="mt-5">We do not sell account or investigative information, and we do not use it for third-party behavioral advertising.</P>
      </>
    ),
  },
  {
    id: 'legal-bases',
    title: 'Legal bases',
    body: (
      <P>
        Where applicable law requires a legal basis, we process personal information as necessary to provide the Service and perform our agreements;
        for legitimate interests such as securing, supporting, and improving the Service; to comply with legal obligations; and with consent where
        consent is requested. When an organization controls an account or deployment, that organization determines its own legal bases for the
        investigations and other processing it directs.
      </P>
    ),
  },
  {
    id: 'sharing',
    title: 'How information is shared',
    body: (
      <>
        <P className="mb-5">We disclose information only as reasonably necessary in the following circumstances:</P>
        <Checks
          items={[
            {
              title: 'Within your organization',
              text: 'Tenant administrators and authorized members may access account details, cases, activity, audit records, and content according to their roles and the organization’s settings.',
            },
            {
              title: 'Service providers',
              text: 'Vendors that support hosting, storage, email delivery, security, diagnostics, or other operations may process limited information for us under appropriate contractual restrictions.',
            },
            {
              title: 'Legal and safety reasons',
              text: 'We may disclose information when reasonably necessary to comply with law or lawful process, protect people or the Service, investigate abuse, or establish, exercise, or defend legal claims.',
            },
            {
              title: 'Business changes or your direction',
              text: 'Information may be transferred in connection with a merger, financing, acquisition, reorganization, or sale of assets, or shared when you direct us to do so or provide consent.',
            },
          ]}
        />
      </>
    ),
  },
  {
    id: 'integrations',
    title: 'Integrations and external sources',
    body: (
      <P>
        Some features connect to external data sources, enrichment services, AI services, notification channels, or tools selected or configured by
        you or your organization. The information sent to an integration depends on the feature and may include search terms, indicators, source
        content, or account identifiers needed to complete the request. External services process information under their own terms and privacy
        practices. Review those terms and your organization&rsquo;s configuration before enabling or using an integration.
      </P>
    ),
  },
  {
    id: 'cookies',
    title: 'Cookies and local storage',
    body: (
      <P>
        The platform uses cookies and browser storage for essential functions such as authentication, session continuity, security, language, theme,
        and interface preferences; blocking essential storage may prevent sign-in or other features from working. This website stores only the theme,
        language, and cached search results described above. Neither uses cookies or storage for cross-site behavioral advertising. An independently
        operated deployment may add its own tools, and its operator is responsible for explaining those practices.
      </P>
    ),
  },
  {
    id: 'retention',
    title: 'Data retention',
    body: (
      <P>
        We retain information for as long as needed to provide and secure the Service, maintain required audit and business records, resolve disputes,
        enforce agreements, and comply with law. Retention may vary by data type, tenant settings, contract, and deployment. When information is
        deleted, limited copies may remain temporarily in backups or be retained where required for security, fraud prevention, legal compliance, or
        the establishment or defense of claims. Operators of organization-managed or self-hosted instances set their own retention practices.
      </P>
    ),
  },
  {
    id: 'security',
    title: 'Security',
    body: (
      <P>
        We use administrative, technical, and organizational safeguards designed to protect information, including access controls, tenant and role
        separation, authentication controls, audit logging, protected network transport, and monitoring appropriate to the Service. Customers and users
        are responsible for protecting credentials, enabling available security features, assigning access appropriately, and securing their devices
        and integrations. No method of transmission, processing, or storage can be guaranteed completely secure.
      </P>
    ),
  },
  {
    id: 'transfers',
    title: 'International transfers',
    body: (
      <P>
        Depending on the hosting region, your location, and the services or integrations configured for your account, information may be processed in
        countries other than the one where you live. Where required, we use recognized safeguards for international transfers. Organization-managed and
        self-hosted deployments determine their own hosting locations and transfer arrangements.
      </P>
    ),
  },
  {
    id: 'rights',
    title: 'Your rights and choices',
    body: (
      <>
        <P>
          Depending on your location and the circumstances, you may have rights to access, correct, delete, restrict, or object to processing of your
          personal information; receive a portable copy; withdraw consent; or complain to a data-protection authority. These rights may be subject to
          legal exceptions and identity verification.
        </P>
        <P className="mt-4">
          For an organization-managed account, submit your request to the organization that provided the account, because it generally controls that
          data. For an Orion-operated account or a concern about information in Orion-operated intelligence data, contact us using the address below
          with enough detail for us to locate and evaluate the request. We may preserve information where retention is legally required or needed to
          protect rights and security.
        </P>
      </>
    ),
  },
  {
    id: 'children',
    title: 'Children’s privacy',
    body: (
      <P>
        The Service is a professional investigative and security platform and is not directed to children. It is not intended for anyone under the age
        of majority in their jurisdiction, and we do not knowingly invite children to create accounts.
      </P>
    ),
  },
  {
    id: 'changes',
    title: 'Changes to this policy',
    body: (
      <P>
        We may update this policy as the Service, our practices, or legal requirements change. When we do, we will revise the &ldquo;Last updated&rdquo;
        date at the top of this page. Where required, we will give additional notice of material changes before they take effect.
      </P>
    ),
  },
  {
    id: 'contact',
    title: 'Contact us',
    body: (
      <ContactCard
        intro="For questions about this policy, privacy requests concerning an Orion-operated account, or concerns about information processed by the Orion-operated Service, contact us:"
        email={COMPANY.privacyEmail}
        note={
          <>
            For anything else, use the{' '}
            <button onClick={() => onNavigate('contact')} className={linkClass}>contact page</button>.
          </>
        }
      />
    ),
  },
];

const Privacy: React.FC<PrivacyProps> = ({ onNavigate }) => (
  <LegalDocument
    eyebrow="Privacy Policy"
    title={
      <>
        Your data, <span className="text-blue-600 dark:text-blue-500">handled plainly.</span>
      </>
    }
    description="How Orion Intelligence collects, uses, shares, and protects information on this website and across the web platform, APIs, and related services."
    lastUpdated={LAST_UPDATED}
    glance={[
      'We do not sell personal or investigative information.',
      'No advertising or analytics cookies on this website.',
      'Exposure-check results are cached only in your browser, for up to 24 hours.',
      `Privacy requests go to ${COMPANY.privacyEmail}.`,
    ]}
    sections={buildSections(onNavigate)}
  />
);

export default Privacy;
