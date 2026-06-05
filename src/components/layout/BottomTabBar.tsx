import { NavLink } from 'react-router-dom';
import { Home, Map, GraduationCap, Users, User } from 'lucide-react';

const tabs = [
  { to: '/home', label: '홈', Icon: Home },
  { to: '/map', label: '지도', Icon: Map },
  { to: '/school', label: '학교', Icon: GraduationCap },
  { to: '/friends', label: '친구', Icon: Users },
  { to: '/mypage', label: '마이', Icon: User },
];

export function BottomTabBar() {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 flex z-50">
      {tabs.map(({ to, label, Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-xs transition-colors ${
              isActive ? 'text-primary-500' : 'text-gray-400'
            }`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
