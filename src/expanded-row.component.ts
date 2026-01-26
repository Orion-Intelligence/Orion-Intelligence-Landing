import {
  Component,
  ChangeDetectionStrategy,
  signal,
  Input,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface TagGroup {
  key: string;
  label: string;
  values: string[];
  count: number;
  isPriority: boolean;
  icon: string;
}

@Component({
  selector: 'app-expanded-row',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './expanded-row.component.html',
  styleUrls: ['./expanded-row.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpandedRowComponent {
  @Input() result: any = {
    rank_index: 'IOC-001',
    year: 2024,
    m_date: '2024-07-29T10:30:00Z',
    m_file: 'report-q2.pdf',
    m_channel: 'Web Download',
    m_source: 'External Threat Feed',
    m_url: 'https://malicious.example/path/to/resource',
    m_important_content:
      'Detected IOC associated with credential harvesting activity targeting financial institutions.',
    m_email_identifier: 'yasmina.belk@gmail.com',
    m_target_domain: 'yasmina.belk',
    m_password: 's3cr3tP@ssw0rd!',
    m_root_domain: ['malicious-root.com'],
    m_ip: ['192.168.1.10', '10.0.0.45', '172.16.5.22', '203.0.113.19', '198.51.100.8'],
    m_domain: ['evil.example', 'phishing.site', 'login-fake.net'],
    m_email: ['admin@evil.example', 'support@phishing.site'],
    m_hash: [
      'd41d8cd98f00b204e9800998ecf8427e',
      '9e107d9d372bb6826bd81d3542a419d6',
      '5a105e8b9d40e1329780d62ea2265d8a',
    ],
    m_actor: ['Unknown', 'APT-29'],
    m_country: ['US', 'DE', 'FR', 'RU', 'CN', 'GB'],
    m_cve: ['CVE-2023-1234', 'CVE-2023-5678'],
  };
  @Input() index: number = 0;

  selectedGroupKey = signal<string | null>(null);
  copiedValue = signal<string | null>(null);
  copiedAll = signal(false);
  passwordVisible = signal(false);
  telemetrySectionVisible = signal(true);

  iconMap: Record<string, string> = {
    root_domain: 'bi-globe',
    ip: 'bi-hdd-network',
    domain: 'bi-diagram-3',
    email: 'bi-envelope',
    hash: 'bi-hash',
    actor: 'bi-person',
    country: 'bi-flag',
    cve: 'bi-bug',
  };

  tooltipMap: Record<string, string> = {
    m_date: 'The date and time when the event was recorded.',
    m_file: 'The name of the file associated with the indicator.',
    m_root_domain: 'The primary domain associated with the malicious activity.',
    m_channel: 'The channel through which the indicator was received.',
    m_source: 'The original source of this threat intelligence.',
    m_url: 'The full malicious URL.',
    m_important_content: 'A summary or key description of the threat.',
    m_email_identifier: 'The email address identified in the activity.',
    m_target_domain: 'The specific domain that was targeted.',
    m_password: 'The compromised password. Handle with care.'
  };

  get tagGroups(): TagGroup[] {
    const result = this.result;
    if (!result) return [];
    
    const groups = Object.keys(result)
      .filter(key => key.startsWith('m_') && Array.isArray(result[key]) && result[key].length > 0)
      .map(key => {
        const values = result[key];
        return {
          key,
          label: this.formatKeyLabel(key),
          values,
          count: values.length,
          isPriority: key === 'm_root_domain',
          icon: key.replace(/^m_/, ''),
        };
      });

    groups.sort((a, b) => (a.isPriority === b.isPriority ? 0 : a.isPriority ? -1 : 1));
    return groups;
  }

  get selectedGroup(): TagGroup | null {
    const key = this.selectedGroupKey();
    if (!key) return null;
    return this.tagGroups.find(g => g.key === key) ?? null;
  }

  get totalTagsCount(): number {
    return this.tagGroups.reduce((acc, group) => acc + group.count, 0);
  }

  toggleGroup(key: string): void {
    this.selectedGroupKey.update((current) => (current === key ? null : key));
  }

  closeDetails(): void {
    this.selectedGroupKey.set(null);
  }

  copyValue(value: string): void {
    if (!value) return;
    navigator.clipboard.writeText(value).then(() => {
      this.copiedValue.set(value);
      setTimeout(() => this.copiedValue.set(null), 2000);
    });
  }

  copyAllTelemetry(): void {
    const allValues = this.tagGroups
      .flatMap(group => group.values)
      .join('\n');

    if (!allValues) return;

    navigator.clipboard.writeText(allValues).then(() => {
      this.copiedAll.set(true);
      setTimeout(() => this.copiedAll.set(false), 2000);
    });
  }

  toggleTelemetrySection(): void {
    this.telemetrySectionVisible.update(v => !v);
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.update(v => !v);
  }

  formatKeyLabel(key: string): string {
    const cleaned = key.replace(/^m_/, '').replace(/_/g, ' ');
    return cleaned.length < 4
      ? cleaned.toUpperCase()
      : cleaned
          .toLowerCase()
          .replace(/\b\w/g, (w) => w.toUpperCase());
  }
  
  downloadReport(): void {
    const dataStr = JSON.stringify(this.result, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'report.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  trackGroupByKey(index: number, group: TagGroup): string {
    return group.key;
  }

  trackValueByValue(index: number, value: string): string {
    return value;
  }
}