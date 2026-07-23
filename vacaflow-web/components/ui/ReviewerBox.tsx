interface ReviewerBoxProps {
  /** Reviewer's full name, or null/undefined if none is assigned yet. */
  name?: string | null;
  /** Contextual line, e.g. "Your manager" or "Reviewed this request". */
  role?: string;
  /** Message shown when there is no reviewer yet. */
  emptyLabel?: string;
}

function initialsFrom(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export default function ReviewerBox({
  name,
  role = 'Your manager',
  emptyLabel = 'Not yet assigned',
}: ReviewerBoxProps) {
  return (
    <div className="bg-bg-warm-tint border border-border-warm rounded-card p-6">
      <p className="text-xs font-bold tracking-wider uppercase text-text-faint mb-3">Reviewer</p>

      {name ? (
        <div className="flex items-start gap-3">
          <div className="w-[52px] h-[52px] rounded-avatar-md flex items-center justify-center font-bold text-sm flex-shrink-0 bg-bg-orange-tint text-brand-orange">
            {initialsFrom(name)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-text-primary truncate">{name}</h4>
            <p className="text-xs text-text-muted">{role}</p>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="w-[52px] h-[52px] rounded-avatar-md flex items-center justify-center flex-shrink-0 border-2 border-dashed border-border-warm-alt text-text-faint">
            —
          </div>
          <p className="text-sm text-text-muted">{emptyLabel}</p>
        </div>
      )}
    </div>
  );
}
