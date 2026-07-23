interface ReviewerBoxProps {
  initials: string;
  name: string;
  title: string;
  subtitle?: string;
  isDarkSidebar?: boolean;
}

export default function ReviewerBox({
  initials,
  name,
  title,
  subtitle = 'Your manager',
  isDarkSidebar = false,
}: ReviewerBoxProps) {
  return (
    <div className="bg-bg-warm-tint border border-border-warm rounded-card p-6">
      <p className="text-xs font-bold tracking-wider uppercase text-text-faint mb-3">
        Reviewer
      </p>

      <div className="flex items-start gap-3">
        <div
          className={`
            w-[52px] h-[52px] rounded-avatar-md flex items-center justify-center
            font-bold text-sm flex-shrink-0
            ${isDarkSidebar ? 'bg-gray-600 text-white' : 'bg-bg-orange-tint text-brand-orange'}
          `}
        >
          {initials}
        </div>

        <div className="flex-1">
          <h4 className="font-bold text-sm text-text-primary">{name}</h4>
          <p className="text-xs text-text-muted">{title}</p>
          {subtitle && (
            <p className="text-xs text-text-faint mt-1">{subtitle}</p>
          )}
        </div>
      </div>
    </div>
  );
}
