interface TimelineStepProps {
  stepNumber: number;
  title: string;
  timestamp?: string;
  isPending?: boolean;
  isCompleted?: boolean;
  isLastStep?: boolean;
}

export default function TimelineStep({
  stepNumber,
  title,
  timestamp,
  isPending = false,
  isCompleted = false,
  isLastStep = false,
}: TimelineStepProps) {
  return (
    <div className="flex gap-4">
      {/* Step Circle & Connector */}
      <div className="flex flex-col items-center">
        {/* Circle */}
        <div
          className={`
            w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm
            flex-shrink-0
            ${
              isCompleted
                ? 'bg-brand-orange text-white'
                : isPending
                  ? 'border-2 border-dashed border-text-muted text-text-muted'
                  : 'border-2 border-gray-300 text-gray-400'
            }
          `}
        >
          {isCompleted ? '✓' : stepNumber}
        </div>

        {/* Connector Line */}
        {!isLastStep && (
          <div
            className={`
              w-0.5 h-12 mt-2
              ${isCompleted ? 'bg-border-warm' : 'border-l-2 border-dashed border-border-warm'}
            `}
          />
        )}
      </div>

      {/* Content */}
      <div className="pt-1 pb-6">
        <h4
          className={`
            font-bold text-sm
            ${isCompleted ? 'text-text-primary' : 'text-text-muted'}
          `}
        >
          {title}
        </h4>
        {timestamp && (
          <p className="text-xs text-text-faint mt-1">{timestamp}</p>
        )}
        {isPending && (
          <p className="text-xs text-text-faint mt-1">Pending – submit when ready</p>
        )}
        {!isCompleted && !isPending && (
          <p className="text-xs text-text-faint mt-1">Awaiting review</p>
        )}
      </div>
    </div>
  );
}
