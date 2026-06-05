interface StarRatingProps {
  rating: number;
  size?: 'sm' | 'md';
  showNumber?: boolean;
}

export function StarRating({ rating, size = 'sm', showNumber = true }: StarRatingProps) {
  const starSize = size === 'sm' ? 'text-sm' : 'text-base';
  return (
    <span className={`inline-flex items-center gap-0.5 ${starSize}`}>
      <span className="text-amber-400">★</span>
      {showNumber && (
        <span className="text-gray-600 font-medium">{rating.toFixed(1)}</span>
      )}
    </span>
  );
}
