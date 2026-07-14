import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Rating({ value, count, className }: { value: number; count?: number; className?: string }) {
  return (
    <div className={cn('flex items-center gap-1 text-[13px] text-fg-muted', className)}>
      <div className="flex">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              'h-4 w-4',
              i < Math.round(value) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            )}
          />
        ))}
      </div>
      <span className="tabular">{value.toFixed(1)}</span>
      {count !== undefined && <span>({count})</span>}
    </div>
  );
}
