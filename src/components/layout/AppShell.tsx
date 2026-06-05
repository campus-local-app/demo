import { Outlet } from 'react-router-dom';
import { BottomTabBar } from './BottomTabBar';

export function AppShell() {
  return (
    <div className="flex justify-center min-h-full bg-gray-100">
      <div className="relative w-full max-w-[430px] min-h-full bg-white flex flex-col shadow-xl">
        <main className="flex-1 overflow-y-auto pb-16">
          <Outlet />
        </main>
        <BottomTabBar />
      </div>
    </div>
  );
}
