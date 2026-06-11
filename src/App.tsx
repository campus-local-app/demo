import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { HomePage } from './pages/home/HomePage';
import { MapPage } from './pages/map/MapPage';
import { FriendsPage } from './pages/friends/FriendsPage';
import { MyPage } from './pages/mypage/MyPage';
import { StoreDetailPage } from './pages/store/StoreDetailPage';
import { MyReviewsPage } from './pages/mypage/MyReviewsPage';
import { MyStampsPage } from './pages/mypage/MyStampsPage';
import { MyVerificationsPage } from './pages/mypage/MyVerificationsPage';

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
      { path: 'friends', element: <FriendsPage /> },
      { path: 'mypage', element: <MyPage /> },
    ],
  },
  {
    path: '/store/:id',
    element: <StoreDetailPage />,
  },
  {
    path: '/my/reviews',
    element: <MyReviewsPage />,
  },
  {
    path: '/my/stamps',
    element: <MyStampsPage />,
  },
  {
    path: '/my/verifications',
    element: <MyVerificationsPage />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
