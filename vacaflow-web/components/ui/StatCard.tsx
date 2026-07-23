import Icon, { IconName } from './Icon';

type StatTone = 'orange' | 'amber' | 'green' | 'gray';

interface StatCardProps {
  label: string;
  value: number | string;
  icon: IconName;
  tone?: StatTone;
  hint?: string;
}

const toneStyles: Record<StatTone, { bg: string; text: string }> = {
  orange: { bg: 'bg-bg-orange-tint', text: 'text-brand-orange' },
  amber: { bg: 'bg-status-submitted-bg', text: 'text-status-submitted-text' },
  green: { bg: 'bg-status-approved-bg', text: 'text-status-approved-text' },
  gray: { bg: 'bg-status-draft-bg', text: 'text-status-draft-text' },
};

export default function StatCard({ label, value, icon, tone = 'orange', hint }: StatCardProps) {
  const t = toneStyles[tone];
  return (
    <div className="bg-bg-surface border border-border-warm rounded-card p-5">
      <div className="flex items-center justify-between mb-4">
        <span className="text-label uppercase text-text-faint">{label}</span>
        <span className={`w-9 h-9 rounded-[10px] ${t.bg} ${t.text} flex items-center justify-center`}>
          <Icon name={icon} size={18} />
        </span>
      </div>
      <p className="text-[32px] leading-none font-extrabold text-text-primary">{value}</p>
      {hint && <p className="text-xs text-text-faint mt-2">{hint}</p>}
    </div>
  );
}
