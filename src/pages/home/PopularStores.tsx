import { stores } from '../../data/mock';
import { StoreCard } from '../../components/ui/StoreCard';

const popular = [...stores].sort((a, b) => b.rating - a.rating).slice(0, 6);

export function PopularStores() {
  return (
    <section>
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="font-bold text-gray-900">인기 가게</h2>
        <button className="text-xs text-primary-500 font-medium">전체보기</button>
      </div>
      <div className="flex gap-3 overflow-x-auto px-4 pb-1 scrollbar-hide">
        {popular.map((store) => (
          <StoreCard key={store.id} store={store} variant="horizontal" />
        ))}
      </div>
    </section>
  );
}
