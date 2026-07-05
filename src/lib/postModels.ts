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

export const FLAVOR_OPTIONS = [
  'Brambleberry Crisp', 'Brown Butter Almond Brittle', 'Honey Lavender',
  'Sea Salt with Caramel Ribbons', 'Black Coconut Ash', 'New York Cheesecake',
  'Turkish Coffee', 'Eureka Lemon & Marionberry', 'The Munchies',
  'Ooey Gooey Butter Cake', 'Secret Breakfast', 'Blue Bottle Vietnamese Coffee',
  'Strawberry Balsamic', 'Toasted Coconut', 'Miso Cherry', 'Everything Bagel',
];

export const TAG_OPTIONS = [
  'artisan', 'fruit', 'nutty', 'coffee', 'floral', 'boozy', 'savory',
  'sweet-salty', 'must-visit', 'splurge', 'instagrammable', 'outdoor',
];