interface AffiliationBadgeProps {
  small?: boolean;
}

export function AffiliationBadge({ small = false }: AffiliationBadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium bg-emerald-100 text-emerald-700 ${
        small ? 'text-xs px-2 py-0.5' : 'text-sm px-2.5 py-1'
      }`}
    >
      제휴
    </span>
  );
}
