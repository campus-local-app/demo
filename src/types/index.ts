export type Category = '전체' | '카페' | '식당' | '주점' | '생활' | '제휴';

export interface Store {
  id: string;
  name: string;
  category: Category;
  address: string;
  phone: string;
  description: string;
  introduction?: string;
  rating: number;
  reviewCount: number;
  isAffiliated: boolean;
  affiliationDepartments: string[];
  lat: number;
  lng: number;
  distance?: number;
  images: string[];
  hours: {
    weekday: string;
    weekend: string;
    holiday?: string;
  };
  tags: string[];
  menuItems: MenuItem[];
}

export interface MenuItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  description?: string;
}

export interface Benefit {
  id: string;
  storeId: string;
  title: string;
  description: string;
  discount: string;
  condition: string;
  validUntil: string;
  department: string;
}

export interface Review {
  id: string;
  storeId: string;
  userId: string;
  userName: string;
  userDepartment: string;
  rating: number;
  content: string;
  tags: string[];
  date: string;
  images?: string[];
  likes: number;
  isFriend?: boolean;
  visitCount?: number;
}

export interface User {
  id: string;
  name: string;
  studentId: string;
  department: string;
  university: string;
  isVerified: boolean;
  profileImage?: string;
}

export interface Friend {
  id: string;
  name: string;
  department: string;
  profileImage?: string;
  lastVisited?: {
    storeName: string;
    date: string;
  };
}

export interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  isPinned: boolean;
}

export interface Event {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  storeId?: string;
  image?: string;
}

export type SchoolEventCategory = '총학생회' | '단과대' | '주점' | '공연' | '동아리' | '학과';

export interface SchoolEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  location: string;
  category: SchoolEventCategory;
  college?: string;
  isHighlighted?: boolean;
  emoji: string;
}

export interface StampCard {
  id: string;
  storeId: string;
  current: number;
  goal: number;
  reward: string;
}

export interface StampTourEvent {
  id: string;
  title: string;
  description: string;
  storeIds: string[];
  visitedStoreIds: string[];
  prize: string;
  sponsor: string;
  endDate: string;
  emoji: string;
}

export interface FavoritePlace {
  storeId: string;
  privateNote: string;
  addedDate: string;
}

export interface FranchiseEvent {
  id: string;
  brand: string;
  emoji: string;
  branch: string;
  distance: string;
  title: string;
  description: string;
  badge: string;
  validUntil: string;
}

export interface EditorPickStore {
  storeId: string;
  votes: number;
}

export interface EditorPick {
  id: string;
  week: string;
  title: string;
  subtitle: string;
  emoji: string;
  bgColor: string;
  stores: EditorPickStore[];
  author: string;
  totalVotes: number;
}

export interface PartnerBenefit {
  id: string;
  title: string;
  description: string;
  source: string;
  discount?: string;
  condition?: string;
  date: string;
  emoji: string;
}

export type FeedItemType = 'visited' | 'saved' | 'reviewed';

export interface FeedItem {
  id: string;
  userId: string;
  userName: string;
  userDepartment: string;
  type: FeedItemType;
  storeId: string;
  note?: string;
  photoUrl?: string;
  rating?: number;
  timeAgo: string;
  date: string;
}
