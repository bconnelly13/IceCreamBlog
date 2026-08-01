export interface Ratings {
  taste: number;
  vibe: number;
  location: number;
  value: number;
  presentation: number;
}

export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  date: string;
  reactions: { emoji: string; count: number }[];
}

export interface Post {
  id: string;
  title: string;
  shopName: string;
  address: string;
  city: string;
  state: string;
  lat: number;
  lng: number;
  date: string;
  flavors: string[];
  price: number;
  photos: string[];
  ratings: Ratings;
  description: string;
  tags: string[];
  reactions: { emoji: string; count: number }[];
  comments: Comment[];
}