interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

const colors = [
  'bg-blue-100 text-blue-700',
  'bg-purple-100 text-purple-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
  'bg-amber-100 text-amber-700',
];

function getColor(name: string) {
  const idx = name.charCodeAt(0) % colors.length;
  return colors[idx];
}

export function Avatar({ name, size = 'md' }: AvatarProps) {
  const sizeClass =
    size === 'sm' ? 'w-7 h-7 text-xs' : size === 'lg' ? 'w-12 h-12 text-lg' : 'w-9 h-9 text-sm';
  const initial = name.startsWith('익명 부#') ? '부' : name.charAt(0);
  return (
    <div
      className={`${sizeClass} ${getColor(name)} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
    >
      {initial}
    </div>
  );
}
