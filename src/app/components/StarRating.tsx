import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (v: number) => void;
}

export function StarRating({
  value,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
}: StarRatingProps) {
  const px = size === "sm" ? 14 : size === "lg" ? 22 : 18;

  return (
    <div className="flex gap-0.5">
      {Array.from({ length: max }).map((_, i) => {
        const filled = i < Math.floor(value);
        const half = !filled && i < value;
        return (
          // <button
          //   key={i}
          //   type="button"
          //   disabled={!interactive}
          //   onClick={() => interactive && onChange?.(i + 1)}
          //   className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : 'cursor-default'}
          //   style={{ background: 'none', border: 'none', padding: 0 }}
          // >
          <Star
            key={i}
            size={px}
            fill={filled || half ? "#F59340" : "none"}
            color={filled || half ? "#F59340" : "#D4B5A8"}
            strokeWidth={1.5}
          />
          // </button>
        );
      })}
    </div>
  );
}

export function RatingRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground" style={{ fontSize: 13 }}>
        {label}
      </span>
      <div className="flex items-center gap-2">
        <StarRating value={value} size="sm" />
        <span
          style={{
            fontSize: 13,
            fontWeight: 600,
            color: "#F59340",
            minWidth: 24,
          }}
        >
          {value}/5
        </span>
      </div>
    </div>
  );
}
