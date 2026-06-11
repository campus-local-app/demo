import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Map, Users, User, Dices } from 'lucide-react';
import { RouletteModal } from '../roulette/RouletteModal';

const leftTabs = [
  { to: '/home', label: '홈', Icon: Home },
  { to: '/map', label: '지도', Icon: Map },
];

const rightTabs = [
  { to: '/friends', label: '친구', Icon: Users },
  { to: '/mypage', label: '마이', Icon: User },
];

export function BottomTabBar() {
  const [rouletteOpen, setRouletteOpen] = useState(false);

  const renderTab = ({ to, label, Icon }: (typeof leftTabs)[number]) => (
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
  );

  return (
    <>
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-white border-t border-gray-200 flex z-50">
        {leftTabs.map(renderTab)}

        {/* Center roulette button */}
        <div className="flex-1 flex flex-col items-center justify-center relative">
          <button
            onClick={() => setRouletteOpen(true)}
            className="absolute -top-5 w-14 h-14 rounded-full bg-primary-500 text-white flex items-center justify-center shadow-lg shadow-primary-500/30 active:scale-90 transition-transform border-4 border-white"
          >
            <Dices size={24} />
          </button>
          <span className="mt-5 text-[10px] text-transparent select-none">·</span>
        </div>

        {rightTabs.map(renderTab)}
      </nav>

      <RouletteModal
        open={rouletteOpen}
        onClose={() => setRouletteOpen(false)}
      />
    </>
  );
}
