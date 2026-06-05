import { Bell } from 'lucide-react';
import { currentUser } from '../../data/mock';
import { StampTourBanner } from './StampTourBanner';
import { BenefitsCarousel } from './BenefitsCarousel';
import { PopularStores } from './PopularStores';

export function HomePage() {
  return (
    <div className="flex flex-col gap-6 pb-4">
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-4 pt-5">
        <div>
          <p className="text-gray-500 text-sm">안녕하세요,</p>
          <h1 className="text-xl font-bold text-gray-900">{currentUser.name}님 👋</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {currentUser.university} · {currentUser.department}
          </p>
        </div>
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gray-100">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>

      {/* Layer 3 — 행사연계 */}
      <StampTourBanner />

      {/* Layer 1 — 제휴 */}
      <BenefitsCarousel />
      <PopularStores />
    </div>
  );
}
