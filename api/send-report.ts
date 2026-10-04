import nodemailer from 'nodemailer';
import {
  buildExposureReport,
  renderReportEmailHtml,
  renderReportEmailText,
  renderReportPdf,
  reportFileName,
  sanitizeReportInput
} from '../lib/exposureReport.js';

const EMAIL_PATTERN = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const DAY_MS = 24 * 60 * 60 * 1000;
const RECIPIENT_DAILY_LIMIT = 1;
const IP_DAILY_LIMIT = 5;

// Best-effort limits: kept per warm function instance, so they reset on cold starts.
const sendLog = new Map<string, number[]>();

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });

const recentSends = (key: string) => {
  const cutoff = Date.now() - DAY_MS;
  const recent = (sendLog.get(key) ?? []).filter((time) => time > cutoff);
  sendLog.set(key, recent);
  return recent;
};

export async function POST(request: Request): Promise<Response> {
  let payload: { email?: unknown; report?: unknown };
  try {
    payload = await request.json();
  } catch {
    return json(400, { detail: 'Invalid request body' });
  }

  const email = String(payload.email ?? '').replace(/\s+/g, '').toLowerCase();
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return json(400, { detail: 'Please enter a valid email address' });
  }
  if (!payload.report || typeof payload.report !== 'object' || Array.isArray(payload.report)) {
    return json(400, { detail: 'Missing report data' });
  }
  const data = payload.report as Record<string, unknown>;
  const input = sanitizeReportInput(email, data);
  if (data.breach_found !== true && input.records.length === 0) {
    return json(404, { detail: 'No exposures found for this email' });
  }

  const ip = (request.headers.get('x-forwarded-for') ?? '').split(',')[0].trim() || 'unknown';
  const ipKey = `ip:${ip}`;
  const recipientKey = `to:${email}`;
  if (recentSends(ipKey).length >= IP_DAILY_LIMIT) {
    return json(429, { detail: 'Report email limit reached for this IP' });
  }
  if (recentSends(recipientKey).length >= RECIPIENT_DAILY_LIMIT) {
    return json(429, { detail: 'A report was already sent to this email today' });
  }

  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, MAIL_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    return json(500, { detail: 'Email delivery is not configured' });
  }

  const report = buildExposureReport(input);
  const port = Number(SMTP_PORT);
  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS }
  });

  try {
    await transporter.sendMail({
      from: MAIL_FROM || `Orion Intelligence <${SMTP_USER}>`,
      to: email,
      subject: `Your Orion Intelligence exposure report for ${email}`,
      text: renderReportEmailText(report),
      html: renderReportEmailHtml(report),
      attachments: [{ filename: reportFileName(report), content: Buffer.from(renderReportPdf(report)), contentType: 'application/pdf' }]
    });
  } catch {
    return json(502, { detail: 'Could not send the report email' });
  }

  const now = Date.now();
  sendLog.set(ipKey, [...recentSends(ipKey), now]);
  sendLog.set(recipientKey, [...recentSends(recipientKey), now]);
  return json(200, { sent: true });
}
