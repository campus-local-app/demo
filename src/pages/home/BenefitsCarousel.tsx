import { useNavigate } from 'react-router-dom';
import { benefits, stores } from '../../data/mock';

export function BenefitsCarousel() {
  const navigate = useNavigate();

  return (
    <section>
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="font-bold text-gray-900">이번 달 혜택</h2>
        <button className="text-xs text-primary-500 font-medium">전체보기</button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {benefits.map((benefit) => {
          const store = stores.find((s) => s.id === benefit.storeId);
          return (
            <div
              key={benefit.id}
              onClick={() => store && navigate(`/store/${store.id}`)}
              className="flex-shrink-0 w-52 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl p-4 cursor-pointer active:scale-95 transition-transform"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{benefit.discount}</span>
                </div>
                <span className="text-white/80 text-xs">{store?.category}</span>
              </div>
              <p className="text-white font-bold text-sm mb-1 line-clamp-2">{benefit.title}</p>
              <p className="text-white/70 text-xs">{benefit.condition}</p>
              <div className="mt-2 text-white/60 text-xs">~{benefit.validUntil}</div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
