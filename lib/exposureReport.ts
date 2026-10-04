import { jsPDF } from 'jspdf';

export type ReportRecord = Record<string, string[]>;

export interface ExposureReportInput {
  email: string;
  totalExposures: number;
  uniqueChannels: number;
  primaryChannel: string;
  primaryChannelHits: number;
  primaryType: string;
  primaryTypeHits: number;
  riskScore: number;
  severity: string;
  records: ReportRecord[];
}

interface ReportRow {
  sites: string[];
  identifier: string;
  timestamp: number;
  fields: [string, string][];
}

interface ExposureReport extends ExposureReportInput {
  appName: string;
  generatedAt: Date;
  rows: ReportRow[];
  sites: string[];
  emails: string[];
  sources: string[];
}

const MAX_RECORDS = 500;
const MAX_TEXT = 200;
const SECRET_KEY = /pass|pwd|secret|token|cvv|cvc|hash|index/i;
const HIDDEN_KEYS = new Set(['_id', 'raw', 'raw_file', 'mapping', 'delimiter', 'dismissed', 'dismiss_id', 'm_sub_host', 'credit_card', 'pan', 'card', 'card_number', 'browser_cookies', 'value', 'national_id']);
const FIELD_ORDER = ['source_domain', 'service_domain', 'domains', 'url', 'email', 'username', 'domain', 'channel', 'type', 'date', 'file_name'];
const FIELD_LABELS: Record<string, string> = { source_domain: 'Breached site', service_domain: 'Service domain', channel: 'Source', file_name: 'Leak file' };

export const RECOMMENDED_ACTIONS: [string, string][] = [
  ['Change your passwords', 'Update the password on every site listed, and anywhere you reused it.'],
  ['Turn on two-factor authentication', 'Add an authenticator app or security key to these accounts.'],
  ['Sign out everywhere', 'End active sessions on the affected services to cut off stolen cookies.'],
  ['Check your devices', 'Stealer logs come from infected machines. Run a full malware scan.']
];

const cleanText = (value: unknown, max = MAX_TEXT) =>
  String(value ?? '').replace(/[\u0000-\u001f\u007f]+/g, ' ').replace(/\s+/g, ' ').trim().slice(0, max);

const cleanNumber = (value: unknown, max = 1_000_000) => {
  const number = Math.floor(Number(value));
  return Number.isFinite(number) ? Math.min(Math.max(number, 0), max) : 0;
};

const toValues = (value: unknown): string[] =>
  (Array.isArray(value) ? value : [value])
    .filter((item) => item !== null && item !== undefined && typeof item !== 'object')
    .map((item) => cleanText(item))
    .filter(Boolean)
    .slice(0, 20);

export const sanitizeReportInput = (email: string, data: Record<string, unknown>): ExposureReportInput => {
  const rawRecords = Array.isArray(data.records) ? data.records.slice(0, MAX_RECORDS) : [];
  const records = rawRecords
    .filter((record): record is Record<string, unknown> => !!record && typeof record === 'object' && !Array.isArray(record))
    .map((record) => {
      const clean: ReportRecord = {};
      Object.entries(record).forEach(([key, value]) => {
        if (!/^[A-Za-z0-9_-]{1,40}$/.test(key) || HIDDEN_KEYS.has(key) || SECRET_KEY.test(key)) return;
        let values = toValues(value);
        if (key === 'extra') values = values.filter((item) => !SECRET_KEY.test(item.split(':')[0]));
        if (values.length) clean[key] = values;
      });
      return clean;
    })
    .filter((record) => Object.keys(record).length > 0);

  return {
    email,
    totalExposures: cleanNumber(data.total_exposures),
    uniqueChannels: cleanNumber(data.unique_channels),
    primaryChannel: cleanText(data.primary_channel, 80),
    primaryChannelHits: cleanNumber(data.primary_channel_hits),
    primaryType: cleanText(data.primary_type, 80),
    primaryTypeHits: cleanNumber(data.primary_type_hits),
    riskScore: cleanNumber(data.risk_score, 100),
    severity: cleanText(data.severity, 20),
    records
  };
};

const urlHost = (value: string) => {
  try {
    return new URL(value.includes('://') ? value : `https://${value}`).hostname;
  } catch {
    return '';
  }
};

const recordSites = (record: ReportRecord) =>
  Array.from(new Set([
    ...(record.source_domain ?? []),
    ...(record.service_domain ?? []),
    ...(record.domains ?? []),
    ...(record.url ?? []).map(urlHost)
  ].filter(Boolean).map((site) => site.toLowerCase().replace(/^www\./, ''))));

const recordFields = (record: ReportRecord): [string, string][] => {
  const keys = [...FIELD_ORDER.filter((key) => key in record), ...Object.keys(record).filter((key) => !FIELD_ORDER.includes(key)).sort()];
  return keys.map((key) => {
    const label = FIELD_LABELS[key] ?? (key.replace(/[_-]+/g, ' ').trim().replace(/^./, (c) => c.toUpperCase()));
    return [label, record[key].join(', ')] as [string, string];
  });
};

const formatDate = (date: Date) => date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

const plural = (count: number, word: string) => `${count} ${word}${count === 1 ? '' : 's'}`;

export const buildExposureReport = (input: ExposureReportInput, appName = 'Orion Intelligence'): ExposureReport => {
  const rows = input.records.map((record) => {
    const time = new Date(record.date?.[0] ?? '').getTime();
    return {
      sites: recordSites(record),
      identifier: record.email?.[0] ?? record.username?.[0] ?? record.phone?.[0] ?? record.identifier?.[0] ?? '-',
      timestamp: Number.isNaN(time) ? 0 : time,
      fields: recordFields(record)
    };
  }).sort((a, b) => b.timestamp - a.timestamp);

  return {
    ...input,
    appName,
    generatedAt: new Date(),
    rows,
    sites: Array.from(new Set(rows.flatMap((row) => row.sites))),
    emails: Array.from(new Set(input.records.flatMap((record) => (record.email ?? []).map((email) => email.toLowerCase())))),
    sources: Array.from(new Set(input.records.flatMap((record) => record.channel ?? [])))
  };
};

export const reportFileName = (report: ExposureReport) => `exposure-report-${report.generatedAt.toISOString().slice(0, 10)}.pdf`;

const reportTitle = (report: ExposureReport) => `${report.appName} Exposure Report`;

const lastSeen = (report: ExposureReport) => {
  const latest = Math.max(0, ...report.rows.map((row) => row.timestamp));
  return latest ? formatDate(new Date(latest)) : 'Unknown';
};

// ---------- PDF (same layout and palette as the Orion intelligence report export) ----------

type RGB = [number, number, number];
const THEME: Record<string, RGB> = {
  ink: [21, 40, 63],
  body: [37, 49, 66],
  muted: [102, 115, 132],
  accent: [165, 35, 54],
  border: [205, 212, 220],
  divider: [222, 227, 232],
  rowAlt: [247, 249, 251],
  footer: [91, 102, 117],
  white: [255, 255, 255]
};

const PAGE_W = 595.28;
const PAGE_H = 841.89;
const MARGIN = 48;
const CONTENT_W = PAGE_W - MARGIN * 2;
const TOP = 82;
const BOTTOM = PAGE_H - 58;

const latin1 = (text: string) => text.replace(/[^\x20-\x7e\xa0-\xff\u2013\u2014\u2018\u2019\u201c\u201d\u2022\u2026]/g, '?');

export const renderReportPdf = (report: ExposureReport): ArrayBuffer => {
  const doc = new jsPDF({ unit: 'pt', format: 'a4' });
  doc.setProperties({ title: reportTitle(report), subject: 'Intelligence intelligence export', author: report.appName, creator: report.appName });
  let y = TOP;
  const sectionPages: [string, number][] = [];

  const font = (style: 'normal' | 'bold', size: number, color: RGB) => {
    doc.setFont('helvetica', style);
    doc.setFontSize(size);
    doc.setTextColor(...color);
  };
  const tracked = (text: string, x: number, baseline: number, charSpace: number, align: 'left' | 'right' = 'left') => {
    const width = doc.getTextWidth(text) + charSpace * Math.max(0, text.length - 1);
    doc.text(latin1(text), align === 'right' ? x - width : x, baseline, { charSpace });
  };
  const rule = (x1: number, y1: number, x2: number, color: RGB, width: number) => {
    doc.setDrawColor(...color);
    doc.setLineWidth(width);
    doc.line(x1, y1, x2, y1);
  };
  const newPage = () => {
    doc.addPage();
    y = TOP;
  };
  const ensure = (height: number) => {
    if (y + height > BOTTOM) newPage();
  };
  const wrap = (text: string, width: number) => doc.splitTextToSize(latin1(text), width) as string[];

  const paragraph = (text: string, style: 'normal' | 'bold', size: number, leading: number, color: RGB, spaceAfter: number, indent = 0) => {
    font(style, size, color);
    wrap(text, CONTENT_W - indent).forEach((line) => {
      ensure(leading);
      doc.text(line, MARGIN + indent, y + leading * 0.72);
      y += leading;
    });
    y += spaceAfter;
  };
  const bullet = (label: string, text: string) => {
    const size = 9.5;
    const leading = 14;
    const indent = 14;
    font('bold', size, THEME.body);
    const prefix = `• ${label} `;
    const prefixWidth = doc.getTextWidth(prefix) + 2;
    font('normal', size, THEME.body);
    const firstLine = wrap(text, CONTENT_W - indent - prefixWidth)[0] ?? '';
    const rest = text.slice(firstLine.length).trim();
    ensure(leading);
    font('bold', size, THEME.body);
    doc.text(latin1(prefix), MARGIN + indent, y + leading * 0.72);
    font('normal', size, THEME.body);
    doc.text(firstLine, MARGIN + indent + prefixWidth, y + leading * 0.72);
    y += leading;
    if (rest) wrap(rest, CONTENT_W - indent).forEach((line) => {
      ensure(leading);
      doc.text(line, MARGIN + indent, y + leading * 0.72);
      y += leading;
    });
    y += 3;
  };
  const heading = (text: string) => {
    ensure(48);
    y += 12;
    font('bold', 12, THEME.ink);
    doc.text(latin1(text), MARGIN, y + 15.5 * 0.72);
    y += 15.5 + 5;
    rule(MARGIN, y, MARGIN + CONTENT_W, THEME.accent, 0.8);
    y += 0.8 + 7;
    sectionPages.push([text, doc.getNumberOfPages()]);
  };
  const recordCard = (marker: string, title: string, fields: [string, string][]) => {
    const labelW = CONTENT_W * 0.26;
    const valueW = CONTENT_W - labelW - 15;
    const measure = ([label, value]: [string, string]) => {
      font('bold', 7.3, THEME.muted);
      const labelLines = wrap(label, labelW - 9);
      font('normal', 8.5, THEME.body);
      const valueLines = wrap(value, valueW);
      return { labelLines, valueLines, height: Math.max(labelLines.length * 10, valueLines.length * 11.5) + 8 };
    };
    const rows = fields.map(measure);
    ensure(7 + 4 + 13 + 4 + (rows[0]?.height ?? 0));
    y += 7;
    rule(MARGIN, y, MARGIN + CONTENT_W, THEME.accent, 0.7);
    y += 0.7 + 4;
    font('bold', 6.5, THEME.accent);
    doc.text(latin1(marker), MARGIN, y + 13 * 0.72);
    const markerWidth = doc.getTextWidth(marker) + 9;
    font('bold', 10, THEME.ink);
    doc.text(wrap(title, CONTENT_W - markerWidth)[0] ?? '', MARGIN + markerWidth, y + 13 * 0.72);
    y += 13 + 4;
    rows.forEach((row, index) => {
      ensure(row.height);
      doc.setFillColor(...(index % 2 ? THEME.rowAlt : THEME.white));
      doc.rect(MARGIN, y, CONTENT_W, row.height, 'F');
      font('bold', 7.3, THEME.muted);
      row.labelLines.forEach((line, i) => doc.text(line, MARGIN + 2, y + 4 + 7.6 + i * 10));
      font('normal', 8.5, THEME.body);
      row.valueLines.forEach((line, i) => doc.text(line, MARGIN + labelW + 8, y + 4 + 8.6 + i * 11.5));
      if (index < rows.length - 1) rule(MARGIN, y + row.height, MARGIN + CONTENT_W, THEME.divider, 0.25);
      y += row.height;
    });
    y += 7;
  };

  // Cover
  const coverX = 57;
  const coverW = PAGE_W - coverX * 2;
  const sections = ['Summary', ...(report.rows.length ? ['Records'] : []), 'Conclusion'];
  font('bold', 7.2, THEME.accent);
  tracked('CONFIDENTIAL', PAGE_W - coverX, 42, 1.35, 'right');
  font('bold', 7.4, THEME.accent);
  tracked('INTELLIGENCE', coverX, 104, 1.1);
  font('bold', 34, THEME.ink);
  const titleLines = wrap(reportTitle(report), coverW).slice(0, 3);
  titleLines.forEach((line, i) => doc.text(line, coverX, 151 + i * 35));
  const titleBottom = 151 + (titleLines.length - 1) * 35;
  font('normal', 11, THEME.muted);
  doc.text('Intelligence result dossier', coverX, titleBottom + 29, { charSpace: 0.4 });
  rule(coverX, titleBottom + 52, coverX + 72, THEME.accent, 1.55);
  font('bold', 10.5, THEME.body);
  wrap('An integrated intelligence review prepared for authorized operational and security decision-making.', Math.min(coverW, 470))
    .forEach((line, i) => doc.text(line, coverX, titleBottom + 83 + i * 14.2, { charSpace: 0.5 }));
  font('bold', 7.4, THEME.accent);
  tracked('REPORT CONTENTS', coverX, 390, 1.05);
  rule(coverX, 403, PAGE_W - coverX, THEME.border, 0.55);
  sections.forEach((name, i) => {
    const rowTop = 390 + 14 + i * 37;
    font('bold', 8, THEME.accent);
    doc.text(String(i + 1).padStart(2, '0'), coverX, rowTop + 22);
    font('bold', 10, THEME.ink);
    doc.text(name, coverX + 42, rowTop + 22, { charSpace: 0.5 });
    rule(coverX, rowTop + 36, PAGE_W - coverX, THEME.border, 0.45);
  });
  const generated = report.generatedAt.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true, timeZone: 'UTC' });
  const columnW = (coverW - 48) / 3;
  [['PREPARED FOR', report.appName], ['REPORT CONTEXT', 'API Export'], ['GENERATED', `${generated} UTC`]].forEach(([label, value], i) => {
    const x = coverX + i * (columnW + 24);
    font('bold', 7.2, THEME.muted);
    tracked(label, x, PAGE_H - 134, 0.8);
    font('normal', 9, THEME.ink);
    doc.text(latin1(value), x, PAGE_H - 114);
  });
  rule(coverX, PAGE_H - 48, PAGE_W - coverX, THEME.border, 0.5);
  font('normal', 7.6, THEME.footer);
  doc.text('AUTHORIZED RECIPIENTS ONLY', coverX, PAGE_H - 29, { charSpace: 0.6 });
  doc.text('Confidential', PAGE_W - coverX, PAGE_H - 29, { align: 'right' });

  // Executive summary
  newPage();
  font('bold', 7.5, THEME.accent);
  tracked('EXECUTIVE SUMMARY', MARGIN, y + 5, 0.85);
  rule(MARGIN, y + 12, MARGIN + CONTENT_W, THEME.ink, 0.8);
  y += 13 + 6;

  const recordCount = report.rows.length || report.totalExposures;
  heading('Summary');
  paragraph(`Exposure Report for ${report.email}`, 'bold', 9.5, 14, THEME.body, 6);
  paragraph(
    `${report.email} appears in ${plural(recordCount, 'stealer log record')} across ${plural(report.sites.length || report.uniqueChannels, report.sites.length ? 'site' : 'source')}. ` +
    'Stealer logs are collected by malware running on an infected device. Passwords are never included in this report.',
    'normal', 9.5, 14, THEME.body, 6
  );
  paragraph(`This report holds ${plural(recordCount, 'record')} across 1 section.`, 'normal', 9.5, 14, THEME.body, 6);
  bullet('Records:', plural(recordCount, 'record'));
  bullet('Severity:', `${report.severity || 'Unknown'} (risk score ${report.riskScore}%)`);
  if (report.primaryChannel) bullet('Top source:', `${report.primaryChannel} (${plural(report.primaryChannelHits, 'hit')})`);
  if (report.primaryType) bullet('Main vector:', `${report.primaryType} (${plural(report.primaryTypeHits, 'hit')})`);
  if (report.rows.length) {
    bullet('Breached sites:', report.sites.join(', ') || 'None recorded');
    bullet('Linked emails:', report.emails.join(', ') || 'None recorded');
    bullet('Last seen:', lastSeen(report));
  }

  if (report.rows.length) {
    heading('Records');
    report.rows.forEach((row, i) => recordCard(`RECORD ${String(i + 1).padStart(3, '0')}`, row.sites[0] ?? row.identifier, row.fields));
  }

  heading('Conclusion');
  paragraph(`${report.email} was found in ${plural(recordCount, 'stealer log record')}. Treat every affected account as compromised until its password is changed.`, 'normal', 9.5, 14, THEME.body, 6);
  RECOMMENDED_ACTIONS.forEach(([title, detail]) => bullet(`${title}:`, detail));

  // Table of contents (inserted after the cover once page numbers are known)
  doc.insertPage(2);
  y = TOP;
  font('bold', 15, THEME.ink);
  doc.text('Table of Contents', MARGIN, y + 19 * 0.72);
  y += 19 + 3;
  rule(MARGIN, y, MARGIN + CONTENT_W, THEME.accent, 0.8);
  y += 11;
  sectionPages.forEach(([name, page]) => {
    font('bold', 9.5, THEME.ink);
    const number = String(page);
    const baseline = y + 21 * 0.72;
    doc.text(name, MARGIN, baseline);
    const start = MARGIN + doc.getTextWidth(name) + 6;
    const end = MARGIN + CONTENT_W - doc.getTextWidth(number) - 6;
    for (let x = start; x < end; x += 7.5) doc.text('.', x, baseline);
    doc.text(number, MARGIN + CONTENT_W, baseline, { align: 'right' });
    y += 33;
  });

  // Running header and footer on every page after the cover
  const total = doc.getNumberOfPages();
  for (let page = 2; page <= total; page++) {
    doc.setPage(page);
    font('bold', 6.7, THEME.ink);
    tracked(report.appName.toUpperCase(), MARGIN, 27.7, 0.7);
    tracked('INTELLIGENCE / DETAILS', PAGE_W - MARGIN - 0.6, 27.7, 0.39, 'right');
    rule(42, PAGE_H - 36.5, PAGE_W - 42, THEME.border, 0.5);
    font('normal', 6.3, THEME.footer);
    doc.text('CONFIDENTIAL - AUTHORISED RECIPIENTS ONLY', 42, PAGE_H - 18.7);
    doc.text('Intelligence Report', PAGE_W / 2, PAGE_H - 18.7, { align: 'center' });
    doc.text(`Page ${page - 1} of ${total - 1}`, PAGE_W - 42, PAGE_H - 18.7, { align: 'right' });
  }

  return doc.output('arraybuffer');
};

// ---------- Email (attachment only, no exposure details in the body) ----------

const escapeHtml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');

export const renderReportEmailText = (report: ExposureReport) => [
  'Your exposure report is ready',
  '',
  `Attached is the exposure report you requested for ${report.email} (${reportFileName(report)}).`,
  'Open the PDF to see where this address appeared and the steps we recommend.',
  '',
  'For your privacy, the details are only in the attached PDF. Passwords are never included.',
  '',
  `Sent by ${report.appName} because someone requested an exposure report for this address.`
].join('\n');

export const renderReportEmailHtml = (report: ExposureReport) => {
  const e = escapeHtml;
  const font = "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
  const mono = "SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";
  const label = `font-family:${font};font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;`;
  const contents = ['Where this address appeared', 'Emails and accounts linked to it', 'Steps to secure your accounts']
    .map((item, i) => `<tr><td width="34" valign="top" style="padding:9px 0;"><div style="width:22px;height:22px;border-radius:11px;background:#EFF4FF;font-family:${font};font-size:11px;font-weight:700;line-height:22px;text-align:center;color:#2563EB;">${i + 1}</div></td><td style="padding:9px 0;font-family:${font};font-size:15px;line-height:22px;color:#0F172A;">${e(item)}</td></tr>`)
    .join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="color-scheme" content="light">
<meta name="supported-color-schemes" content="light">
<title>${e(reportTitle(report))}</title>
</head>
<body style="margin:0;padding:0;background:#EEF2F7;-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">Your requested exposure report is attached as a PDF.</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#EEF2F7;">
<tr><td align="center" style="padding:40px 14px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:640px;">
<tr><td style="background:#0B1220;background-image:linear-gradient(135deg,#0B1220 0%,#12234A 62%,#1D3F8F 100%);border-radius:18px 18px 0 0;padding:30px 36px 36px;">
<table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
<td style="font-family:${font};font-size:14px;font-weight:800;letter-spacing:.32em;color:#FFFFFF;">ORION</td>
<td align="right"><span style="display:inline-block;padding:5px 11px;border-radius:999px;background:rgba(255,255,255,.10);border:1px solid rgba(255,255,255,.18);${label}font-size:10px;color:#C7D7FE;">Report ready</span></td>
</tr></table>
<div style="height:34px;line-height:34px;font-size:0;">&nbsp;</div>
<div style="${label}color:#93B4FD;">Exposure report</div>
<h1 style="margin:12px 0 0;font-family:${font};font-size:30px;line-height:1.2;font-weight:800;letter-spacing:-.01em;color:#FFFFFF;">Your report is ready</h1>
<p style="margin:12px 0 0;font-family:${font};font-size:15px;line-height:1.5;color:#CBD5E1;">Prepared for <span style="font-family:${mono};font-size:14px;color:#FFFFFF;word-break:break-all;">${e(report.email)}</span></p>
</td></tr>
<tr><td style="background:#FFFFFF;border-radius:0 0 18px 18px;padding:34px 36px 36px;">
<p style="margin:0;font-family:${font};font-size:16px;line-height:1.65;color:#475569;">We've attached the exposure report you requested. It's a PDF you can open, save, or share with whoever handles your security.</p>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:26px;border:1px solid #E2E8F0;border-radius:14px;"><tr>
<td width="64" valign="middle" style="padding:16px 0 16px 16px;"><div style="width:46px;height:56px;border-radius:8px;background:#2563EB;font-family:${font};font-size:12px;font-weight:800;letter-spacing:.06em;line-height:56px;text-align:center;color:#FFFFFF;">PDF</div></td>
<td valign="middle" style="padding:16px 18px 16px 14px;">
<div style="font-family:${font};font-size:15px;font-weight:700;color:#0F172A;word-break:break-all;">${e(reportFileName(report))}</div>
<div style="font-family:${font};font-size:13px;color:#94A3B8;padding-top:4px;">Attached to this email &middot; Passwords never included</div>
</td></tr></table>
<div style="${label}color:#94A3B8;padding-top:32px;">Inside the report</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:8px;">${contents}</table>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-top:26px;background:#F8FAFC;border-radius:12px;"><tr>
<td style="padding:16px 18px;font-family:${font};font-size:13px;line-height:1.6;color:#475569;"><strong style="color:#0F172A;">Privacy first.</strong> The details live only in the attachment, never in the body of this email.</td>
</tr></table>
</td></tr>
<tr><td style="padding:26px 22px 0;font-family:${font};font-size:12px;line-height:1.7;color:#94A3B8;text-align:center;">
Sent by ${e(report.appName)} because someone requested an exposure report for this address.<br>
If that wasn't you, the report can still help you secure your accounts.<br>
<span style="color:#B4BFCE;">${e(formatDate(report.generatedAt))}</span>
</td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
};
