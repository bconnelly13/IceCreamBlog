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

export const MOCK_POSTS: Post[] = [
  {
    id: '1',
    title: 'Brambleberry Bliss at Jeni\'s',
    shopName: "Jeni's Splendid Ice Creams",
    address: '714 N High St',
    city: 'Columbus',
    state: 'OH',
    lat: 39.9762,
    lng: -83.0037,
    date: '2025-07-12',
    flavors: ['Brambleberry Crisp', 'Brown Butter Almond Brittle'],
    price: 6.50,
    photos: [
      'https://images.unsplash.com/photo-1629385701021-fcd568a743e8?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=800&h=600&fit=crop&auto=format',
    ],
    ratings: { taste: 5, vibe: 4, location: 4, value: 3, presentation: 5 },
    description: "Jeni's is the gold standard for a reason. The Brambleberry Crisp hit every note — tart blackberry jam ribbons, buttery oat crumble chunks, and a base so creamy it felt like eating frozen custard. The Short North location buzzes with energy on a warm Saturday afternoon. The line moved fast, staff were incredibly knowledgeable about every flavor. Brown Butter Almond Brittle was my surprise winner: nutty, caramel-forward, with shards of toffee in every bite. Will absolutely be back.",
    tags: ['artisan', 'midwest', 'fruit', 'nutty', 'must-visit'],
    reactions: [{ emoji: '🍦', count: 42 }, { emoji: '❤️', count: 28 }, { emoji: '😍', count: 15 }],
    comments: [
      { id: 'c1', author: 'Maya T.', avatar: 'M', text: "Brambleberry is my all-time favorite! Did you try the Ndali Estate Vanilla?", date: '2025-07-13', reactions: [{ emoji: '👍', count: 4 }] },
      { id: 'c2', author: 'Jake R.', avatar: 'J', text: "The Short North location has the best vibe. So worth the line.", date: '2025-07-14', reactions: [{ emoji: '❤️', count: 2 }] },
    ],
  },
  {
    id: '2',
    title: 'Honey Lavender Dreams at Salt & Straw',
    shopName: 'Salt & Straw',
    address: '838 NW 23rd Ave',
    city: 'Portland',
    state: 'OR',
    lat: 45.5315,
    lng: -122.6982,
    date: '2025-06-28',
    flavors: ['Honey Lavender', 'Sea Salt with Caramel Ribbons'],
    price: 7.00,
    photos: [
      'https://images.unsplash.com/photo-1629385697093-57be2cc97fa6?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1672806945986-9729ed767ec9?w=800&h=600&fit=crop&auto=format',
    ],
    ratings: { taste: 5, vibe: 5, location: 5, value: 3, presentation: 4 },
    description: "Salt & Straw on 23rd is an experience unto itself. Portland does the farm-to-cone ethos better than anyone, and every flavor here proves it. The Honey Lavender is impossibly floral without being soapy — local Bee Local honey shines through, and the lavender is restrained and elegant. The Sea Salt with Caramel Ribbons is the crowd-pleaser for a reason: thick molten ribbons of salted caramel weave through rich vanilla. The neighborhood itself feels tailor-made for a slow afternoon with a scoop.",
    tags: ['pacific-northwest', 'floral', 'artisan', 'farm-to-cone', 'romantic'],
    reactions: [{ emoji: '🌸', count: 31 }, { emoji: '🍦', count: 24 }, { emoji: '😋', count: 19 }],
    comments: [
      { id: 'c3', author: 'Priya S.', avatar: 'P', text: "The lavender one is transcendent. Try the Chocolate Gooey Brownie next time!", date: '2025-06-29', reactions: [{ emoji: '🌸', count: 6 }] },
    ],
  },
  {
    id: '3',
    title: 'Black Coconut Ash at Morgenstern\'s',
    shopName: "Morgenstern's Finest Ice Cream",
    address: '2 Rivington St',
    city: 'New York',
    state: 'NY',
    lat: 40.7206,
    lng: -73.9882,
    date: '2025-08-03',
    flavors: ['Black Coconut Ash', 'New York Cheesecake'],
    price: 8.50,
    photos: [
      'https://images.unsplash.com/photo-1560801619-01d71da0f70c?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1710683994911-c59ddf25c5c0?w=800&h=600&fit=crop&auto=format',
    ],
    ratings: { taste: 4, vibe: 5, location: 4, value: 2, presentation: 5 },
    description: "Morgenstern's is high concept ice cream — Nick Morgenstern treats his flavor development like a chef. The Black Coconut Ash is striking visually (jet black, activated charcoal) and the flavor is haunting: smoky coconut with a subtle brininess. Not for everyone, but if you want to be challenged by ice cream, this is it. The New York Cheesecake is the comfort counterpart — cream cheese tang, graham cracker base, bright lemon zest. The price point stings, but you're paying for an idea.",
    tags: ['nyc', 'avant-garde', 'high-concept', 'splurge', 'instagrammable'],
    reactions: [{ emoji: '🖤', count: 37 }, { emoji: '🤯', count: 22 }, { emoji: '🍦', count: 18 }],
    comments: [
      { id: 'c4', author: 'Sam K.', avatar: 'S', text: "The black ash one is so polarizing but I love it. Very NYC.", date: '2025-08-04', reactions: [{ emoji: '🤯', count: 3 }] },
      { id: 'c5', author: 'Lei W.', avatar: 'L', text: "Worth every penny for the experience alone!", date: '2025-08-05', reactions: [{ emoji: '❤️', count: 5 }] },
    ],
  },
  {
    id: '4',
    title: 'Turkish Coffee Magic at McConnell\'s',
    shopName: "McConnell's Fine Ice Creams",
    address: '201 W Mission St',
    city: 'Santa Barbara',
    state: 'CA',
    lat: 34.4208,
    lng: -119.7025,
    date: '2025-05-19',
    flavors: ['Turkish Coffee', 'Eureka Lemon & Marionberry'],
    price: 7.50,
    photos: [
      'https://images.unsplash.com/photo-1657225953401-5f95007fc8e0?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1559703248-dcaaec9fab78?w=800&h=600&fit=crop&auto=format',
    ],
    ratings: { taste: 5, vibe: 4, location: 5, value: 4, presentation: 4 },
    description: "McConnell's has been churning since 1949 and you taste the history. The Turkish Coffee is a revelation — bold, cardamom-laced, genuinely complex in a way most coffee ice creams aren't. It doesn't taste like cold coffee; it tastes like a memory of a perfect cup. The Eureka Lemon & Marionberry is summer in a cone: bright and citrusy with jammy berry ripples. The Santa Barbara farmers market location is outdoors, sun-drenched, and perfectly suited for slow afternoon scoops.",
    tags: ['california', 'heritage', 'coffee', 'fruit', 'outdoor'],
    reactions: [{ emoji: '☕', count: 29 }, { emoji: '🍦', count: 21 }, { emoji: '✨', count: 14 }],
    comments: [
      { id: 'c6', author: 'Ana M.', avatar: 'A', text: "McConnell's Turkish Coffee is the reason I started this whole ice cream journey!", date: '2025-05-20', reactions: [{ emoji: '☕', count: 8 }] },
    ],
  },
  {
    id: '5',
    title: 'The Munchies at Ample Hills',
    shopName: 'Ample Hills Creamery',
    address: '305 Nevins St',
    city: 'Brooklyn',
    state: 'NY',
    lat: 40.6817,
    lng: -73.9956,
    date: '2025-07-26',
    flavors: ['The Munchies', 'Ooey Gooey Butter Cake'],
    price: 7.00,
    photos: [
      'https://images.unsplash.com/photo-1633881613747-e98695066141?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1636564499112-6113e73c504a?w=800&h=600&fit=crop&auto=format',
    ],
    ratings: { taste: 4, vibe: 5, location: 3, value: 4, presentation: 3 },
    description: "Ample Hills is Brooklyn's most fun ice cream shop and The Munchies is their magnum opus. Imagine a salty-sweet pretzel ice cream studded with potato chips, Ritz crackers, and chocolate-covered pretzels. It sounds chaotic. It works completely. The Gowanus location has an open kitchen so you can watch them make everything, which adds a great theatrical energy. Ooey Gooey Butter Cake tastes exactly as promised: rich, dense, buttery, with chunks of actual cake throughout.",
    tags: ['brooklyn', 'fun', 'sweet-salty', 'kids-love-it', 'open-kitchen'],
    reactions: [{ emoji: '🥨', count: 25 }, { emoji: '😂', count: 18 }, { emoji: '🍦', count: 33 }],
    comments: [
      { id: 'c7', author: 'Tom B.', avatar: 'T', text: "The Munchies is an experience. Brought my nephew here and he cried happy tears.", date: '2025-07-27', reactions: [{ emoji: '😂', count: 11 }] },
    ],
  },
  {
    id: '6',
    title: 'Secret Breakfast at Humphry Slocombe',
    shopName: 'Humphry Slocombe',
    address: '2790 Harrison St',
    city: 'San Francisco',
    state: 'CA',
    lat: 37.7512,
    lng: -122.4151,
    date: '2025-04-14',
    flavors: ['Secret Breakfast', 'Blue Bottle Vietnamese Coffee'],
    price: 6.50,
    photos: [
      'https://images.unsplash.com/photo-1702564696095-ba5110856bf2?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1752962638413-a2f2432b67f9?w=800&h=600&fit=crop&auto=format',
    ],
    ratings: { taste: 5, vibe: 4, location: 4, value: 4, presentation: 3 },
    description: "Secret Breakfast is perhaps the most-talked-about flavor in American ice cream: bourbon ice cream packed with corn flake clusters. It tastes like the morning after a very good night — boozy, sweet, crunchy. It's completely irreverent and completely perfect. The Blue Bottle Vietnamese Coffee is SF in a cup: excellent coffee pedigree, sweet condensed milk notes, deeply caffeinating. The Mission location is small and unpretentious, which feels exactly right for ice cream this thoughtful.",
    tags: ['san-francisco', 'boozy', 'mission-district', 'quirky', 'coffee'],
    reactions: [{ emoji: '🥃', count: 44 }, { emoji: '🍦', count: 36 }, { emoji: '🌟', count: 20 }],
    comments: [
      { id: 'c8', author: 'Rosa G.', avatar: 'R', text: "Secret Breakfast changed my life. This is not an exaggeration.", date: '2025-04-15', reactions: [{ emoji: '🥃', count: 14 }] },
      { id: 'c9', author: 'Dev P.', avatar: 'D', text: "The Blue Bottle collab is incredible. Two SF icons in one scoop.", date: '2025-04-16', reactions: [{ emoji: '☕', count: 7 }] },
    ],
  },
  {
    id: '7',
    title: 'Strawberry Balsamic at Sweet Rose',
    shopName: 'Sweet Rose Creamery',
    address: '225 26th St',
    city: 'Los Angeles',
    state: 'CA',
    lat: 34.0323,
    lng: -118.4543,
    date: '2025-06-07',
    flavors: ['Strawberry Balsamic', 'Toasted Coconut'],
    price: 7.50,
    photos: [
      'https://images.unsplash.com/photo-1752962638381-b5e04cebed12?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1629385744299-74b9cf013f52?w=800&h=600&fit=crop&auto=format',
    ],
    ratings: { taste: 5, vibe: 4, location: 4, value: 3, presentation: 5 },
    description: "Sweet Rose is the Brentwood gem that the food world keeps raving about, and it earns every word. The Strawberry Balsamic uses Peak California strawberries with aged balsamic vinegar — the acidity transforms the flavor from simple fruit to something genuinely sophisticated. The Toasted Coconut is my sleeper pick: golden brown coconut flakes throughout a luscious base that smells like a tropical vacation. The shop is small, the line spills onto the sidewalk on weekends, and everyone in line looks perfectly happy about it.",
    tags: ['los-angeles', 'brentwood', 'sophisticated', 'local-ingredients', 'weekend-line'],
    reactions: [{ emoji: '🍓', count: 38 }, { emoji: '❤️', count: 27 }, { emoji: '🌴', count: 12 }],
    comments: [
      { id: 'c10', author: 'Nina F.', avatar: 'N', text: "The Strawberry Balsamic is the best thing I've eaten all year. Not just ice cream — everything.", date: '2025-06-08', reactions: [{ emoji: '🍓', count: 9 }] },
    ],
  },
  {
    id: '8',
    title: 'Miso Cherry at OddFellows',
    shopName: 'OddFellows Ice Cream Co.',
    address: '175 Kent Ave',
    city: 'Brooklyn',
    state: 'NY',
    lat: 40.7135,
    lng: -73.9680,
    date: '2025-08-17',
    flavors: ['Miso Cherry', 'Everything Bagel'],
    price: 7.00,
    photos: [
      'https://images.unsplash.com/photo-1752962641819-f5ac83fd213d?w=800&h=600&fit=crop&auto=format',
      'https://images.unsplash.com/photo-1718713680365-b2731302d64f?w=800&h=600&fit=crop&auto=format',
    ],
    ratings: { taste: 4, vibe: 5, location: 4, value: 4, presentation: 4 },
    description: "OddFellows earns its name. Miso Cherry is umami-sweet in the best way — white miso gives the cherry a deep, savory undertow that makes you keep going back for another bite. The Everything Bagel is equal parts gimmick and triumph: sesame, poppy seed, onion, cream cheese. It absolutely shouldn't work. It works. The Williamsburg waterfront location has views of Manhattan and the kind of industrial-cool vibe that feels very 2024 Brooklyn. Outdoor seating makes it perfect on a summer evening.",
    tags: ['brooklyn', 'williamsburg', 'experimental', 'savory', 'waterfront'],
    reactions: [{ emoji: '🍒', count: 31 }, { emoji: '🤔', count: 16 }, { emoji: '🍦', count: 28 }],
    comments: [
      { id: 'c11', author: 'Chris Y.', avatar: 'C', text: "Everything Bagel ice cream is the most Brooklyn thing I've ever eaten. 10/10.", date: '2025-08-18', reactions: [{ emoji: '🤔', count: 7 }] },
      { id: 'c12', author: 'Mia L.', avatar: 'M', text: "Miso Cherry is so underrated. The umami-sweet combo is genius.", date: '2025-08-19', reactions: [{ emoji: '🍒', count: 5 }] },
    ],
  },
];

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
