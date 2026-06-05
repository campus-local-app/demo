import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/home/HomePage';
import { MapPage } from './pages/map/MapPage';
import { SchoolPage } from './pages/school/SchoolPage';
import { FriendsPage } from './pages/friends/FriendsPage';
import { MyPage } from './pages/mypage/MyPage';
import { StoreDetailPage } from './pages/store/StoreDetailPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/home" replace />,
  },
  {
    path: '/',
    element: <AppShell />,
    children: [
      { path: 'home', element: <HomePage /> },
      { path: 'map', element: <MapPage /> },
      { path: 'school', element: <SchoolPage /> },
      { path: 'friends', element: <FriendsPage /> },
      { path: 'mypage', element: <MyPage /> },
    ],
  },
  {
    path: '/store/:id',
    element: <StoreDetailPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
