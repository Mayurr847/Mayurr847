export interface MenuItem {
  id: string;
  name: string;
  category: 'coffee' | 'matcha' | 'specials' | 'pastries';
  price: number;
  description: string;
  image: string;
  badge?: string;
  badgeColor?: 'matcha' | 'butter' | 'cherry' | 'espresso';
  isPopular?: boolean;
  calories?: number;
  dietary?: string[]; // e.g. ['Vegan', 'Gluten-Free', 'Dairy-Free', 'Nut-Free']
  defaultMilk?: string;
  customizable?: boolean;
}

export interface JournalArticle {
  id: string;
  slug: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  excerpt: string;
  content: string[];
  image: string;
  tags: string[];
  likes: number;
}

export interface InstagramPost {
  id: string;
  image: string;
  caption: string;
  likes: number;
  comments: number;
  tag: string;
  rotation?: string;
}

export interface GoogleReview {
  id: string;
  author: string;
  role?: string;
  rating: number;
  timeAgo: string;
  text: string;
  highlight?: string;
}

export const GOOGLE_REVIEWS: GoogleReview[] = [
  {
    id: 'rev-1',
    author: 'Teena Aranha',
    role: 'Local Guide · 21 reviews',
    rating: 5,
    timeAgo: 'Google Review',
    text: 'A great place with excellent service. They have a wide range of drinks, and their coffee is rich and full of flavor. The desserts make the perfect match for their drinks. The baristas are friendly and welcoming.',
    highlight: 'Rich & full of flavor'
  },
  {
    id: 'rev-2',
    author: 'Jason Borges',
    role: '11 reviews',
    rating: 5,
    timeAgo: 'Google Review',
    text: 'Loved the food at the café! Lovely experience! The pastry was delicious and the Sunrise Cold Brew is too amazing!',
    highlight: 'Sunrise Cold Brew is too amazing'
  },
  {
    id: 'rev-3',
    author: 'Nilima Tirthe',
    role: '5 reviews',
    rating: 5,
    timeAgo: 'Google Review',
    text: 'Great place for official meetings. Vibes are really good. Best coffee ever tried, love the coffee taste. Please try Mocha coffee.',
    highlight: 'Best Coffee Ever Tried'
  },
  {
    id: 'rev-4',
    author: 'Aditi Mane',
    role: '6 reviews',
    rating: 5,
    timeAgo: 'Google Review',
    text: 'Great place for peaceful time. Ambience is really good, coffee and food is really amazing, overall really good experience.',
    highlight: 'Great Ambience & Peaceful Time'
  },
  {
    id: 'rev-5',
    author: 'Pinky Pathak',
    role: '3 reviews',
    rating: 5,
    timeAgo: 'Google Review',
    text: 'It was an amazing experience and loved the vibes of the place. A must visit place.',
    highlight: 'Loved the vibes'
  },
  {
    id: 'rev-6',
    author: 'How I Met My Food',
    role: 'Local Guide · 139 reviews',
    rating: 5,
    timeAgo: 'Google Review',
    text: 'Loved the refreshments: food & beverages. The taste & quality is top notch. Loved the presentation.',
    highlight: 'Top Notch Quality & Taste'
  }
];

export const CAFE_INFO = {
  name: 'The Little Cup',
  tagline: 'GOOD COFFEE. BAD DECISIONS.',
  supportingCopy: 'Specialty coffee, matcha, and a cozy space for your best (and worst) ideas.',
  aboutStory: 'The Little Cup is a Gen-Z owned café built for daydreamers, overthinkers, creatives, and anyone who believes good coffee makes life a little softer (and a lot more fun). We started out with a vintage espresso machine and a dream to make specialty coffee approachable, photogenic, and unpretentious.',
  rating: 5.0,
  reviewCount: 6,
  priceRange: '₹1,000–1,200 for two',
  address: {
    street: 'Iscon Cross Roads, Sarkhej - Gandhinagar Hwy',
    landmark: 'Next to Wide Angle Cinema',
    city: 'Ahmedabad',
    state: 'Gujarat',
    zip: '380015',
    plusCode: '2GF4+HW Ahmedabad, Gujarat',
    full: 'Iscon Cross Roads, Sarkhej - Gandhinagar Hwy, next to Wide Angle Cinema, Ahmedabad, Gujarat 380015',
    googleMapsUrl: 'https://maps.google.com/?q=Iscon+Cross+Roads+Sarkhej+Gandhinagar+Hwy+next+to+Wide+Angle+Cinema+Ahmedabad+Gujarat+380015',
    reserveUrl: 'https://www.google.com/maps/reserve/v/dine/c/ON1Y583iqM4?source=pa&opi=79508299&hl=en-IN&gei=F_XEaumHJeqeseMPkfCw0AE&ahbb=1&sourceurl=https://www.google.com/maps/preview/place?authuser%3D0%26hl%3Den%26gl%3Din%26pb%3D!1m24!1s0x395e9b0c3bd7baa5:0x604cf811790f8d76!3m12!1m3!1d11608.858547043117!2d72.50731379999999!3d23.023963300000005!2m3!1f0!2f0!3f0!3m2!1i598!2i607!4f13.1!4m2!3d23.0239633!4d72.50731379999999!15m6!1m5!1s0x395e9b0c3bd7baa5:0x604cf811790f8d76!4s/g/11y6_4p3w6!5sChIJpbrXOwybXjkRdo0PeRH4TGA!6s7284845332020176894!7s106633089369733527115!6scoffee!12m4!2m3!1i360!2i120!4i8!13m57!2m2!1i203!2i100!3m2!2i4!5b1!6m6!1m2!1i86!2i86!1m2!1i408!2i240!7m33!1m3!1e1!2b0!3e3!1m3!1e2!2b1!3e2!1m3!1e2!2b0!3e3!1m3!1e8!2b0!3e3!1m3!1e10!2b0!3e3!1m3!1e10!2b1!3e2!1m3!1e10!2b0!3e4!1m3!1e9!2b1!3e2!2b1!9b0!15m8!1m7!1m2!1m1!1e2!2m2!1i195!2i195!3i20!14m2!1sCvXEapOVMZavseMPm9Gg8QI!7e81!15m111!1m29!4e2!13m9!2b1!3b1!4b1!6i1!8b1!9b1!14b1!20b1!25b1!18m17!3b1!4b1!5b1!6b1!9b1!13b1!14b1!17b1!20b1!21b1!22b1!30b1!32b1!33m1!1b1!34b1!36e2!10m1!8e3!11m1!3e1!17b1!20m2!1e3!1e6!24b1!25b1!26b1!27b1!29b1!30m1!2b1!36b1!37b1!39m3!2m2!2i1!3i1!43b1!52b1!54m1!1b1!55b1!56m1!1b1!61m2!1m1!1e1!65m5!3m4!1m3!1m2!1i224!2i298!72m22!1m8!2b1!5b1!7b1!12m4!1b1!2b1!4m1!1e1!4b1!8m10!1m6!4m1!1e1!4m1!1e3!4m1!1e4!3sother_user_google_review_posts__and__hotel_and_vr_partner_review_posts!6m1!1e1!9b1!89b1!90m2!1m1!1e2!98m3!1b1!2b1!3b1!103b1!113b1!114m3!1b1!2m1!1b1!117b1!122m1!1b1!126b1!127b1!128m1!1b1!21m0!22m2!1e81!8e4!29m0!30m6!3b1!6m1!2b1!7m1!2b1!9b1!34m5!7b1!10b1!14b1!15m1!1b0!37i798!38sCgZjb2ZmZWVaCCIGY29mZmVlkgEEY2FmZeABAA!39sCaf%25C3%25A9%2BDeli-Tel!41b1%26q%3DCaf%25C3%25A9%2BDeli-Tel',
  },
  phone: '082380 00335',
  email: 'hello@thelittlecup.cafe',
  instagram: 'https://instagram.com/thelittlecupcafe',
  tiktok: 'https://tiktok.com/@thelittlecup',
  spotifyPlaylistUrl: 'https://open.spotify.com',
  hours: [
    { days: 'Every Day (Mon – Sun)', open: '8:00 AM', close: '2:00 AM', openTime: 8, closeTime: 2 },
  ],
  amenities: [
    { icon: 'Wifi', label: 'Ultra-Fast Fiber Wi-Fi' },
    { icon: 'Clock', label: 'Late Night Café (Open till 2 AM)' },
    { icon: 'Plug', label: 'Laptop Friendly & Outlets' },
    { icon: 'Utensils', label: 'Dine-in, Takeaway & Delivery' },
    { icon: 'Dog', label: 'Pups Welcome (Free Pup Cups!)' },
    { icon: 'Music', label: 'Indie Vinyl & Chill Beats' },
  ],
};

export const MENU_ITEMS: MenuItem[] = [
  // COFFEE
  {
    id: 'iced-latte',
    name: 'Iced Latte',
    category: 'coffee',
    price: 5.50,
    description: 'Double shot of house roast espresso poured over chilled organic oat milk and crystal ice.',
    image: '/images/iced_latte.jpg',
    badge: 'COMMUNITY FAVE',
    badgeColor: 'butter',
    isPopular: true,
    calories: 140,
    dietary: ['Vegetarian', 'Oat Milk default'],
    customizable: true,
  },
  {
    id: 'espresso',
    name: 'Espresso',
    category: 'coffee',
    price: 3.50,
    description: 'Single-origin Ethiopian roast with tasting notes of wild honey, blackberry, and dark cacao.',
    image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&w=600&q=80',
    calories: 5,
    dietary: ['Vegan', 'Gluten-Free'],
    customizable: false,
  },
  {
    id: 'americano',
    name: 'Americano',
    category: 'coffee',
    price: 4.00,
    description: 'Fresh espresso pulled over filtered hot or iced mountain spring water. Clean & punchy.',
    image: 'https://images.unsplash.com/photo-1551030173-122aabc4489c?auto=format&fit=crop&w=600&q=80',
    calories: 10,
    dietary: ['Vegan', 'Gluten-Free'],
    customizable: true,
  },
  {
    id: 'cappuccino',
    name: 'Cappuccino',
    category: 'coffee',
    price: 4.75,
    description: 'Equal parts rich espresso, steamed whole milk, and micro-foam with dusted cinnamon dusting.',
    image: 'https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80',
    calories: 120,
    dietary: ['Vegetarian'],
    customizable: true,
  },
  {
    id: 'flat-white',
    name: 'Flat White',
    category: 'coffee',
    price: 4.75,
    description: 'Silky microfoam poured delicately over a smooth double ristretto shot. Bold yet creamy.',
    image: 'https://images.unsplash.com/photo-1577968897966-3d4325b36b61?auto=format&fit=crop&w=600&q=80',
    calories: 130,
    dietary: ['Vegetarian'],
    customizable: true,
  },
  {
    id: 'cold-brew',
    name: 'Cold Brew',
    category: 'coffee',
    price: 4.50,
    description: 'Steeped for 20 hours in cold filtered water. Ultra smooth, low acidity, naturally sweet finish.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    calories: 5,
    dietary: ['Vegan', 'Gluten-Free'],
    customizable: true,
  },
  {
    id: 'rich-mocha',
    name: 'Rich Dark Mocha',
    category: 'coffee',
    price: 5.25,
    description: 'Double espresso blended with rich 70% dark Belgian cocoa and steamed velvety milk, topped with light cocoa dust.',
    image: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?auto=format&fit=crop&w=600&q=80',
    calories: 210,
    dietary: ['Vegetarian'],
    customizable: true,
  },

  // MATCHA
  {
    id: 'matcha-latte',
    name: 'Matcha Latte',
    category: 'matcha',
    price: 5.50,
    description: 'Ceremonial grade Uji green tea whisked fresh to order with velvety steamed or iced oat milk.',
    image: '/images/hero_matcha.jpg',
    badge: 'BEST SELLER',
    badgeColor: 'matcha',
    isPopular: true,
    calories: 150,
    dietary: ['Vegan', 'Organic', 'Antioxidants'],
    customizable: true,
  },
  {
    id: 'classic-matcha',
    name: 'Classic Matcha',
    category: 'matcha',
    price: 5.00,
    description: 'Pure single-origin ceremonial green tea whisked with 80°C mountain water. Pure zen.',
    image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    calories: 15,
    dietary: ['Vegan', 'Gluten-Free', 'Sugar-Free'],
    customizable: false,
  },
  {
    id: 'strawberry-matcha',
    name: 'Strawberry Matcha',
    category: 'matcha',
    price: 6.50,
    description: 'Housemade fresh strawberry puree compote, creamy oat milk, topped with ceremonial green matcha foam.',
    image: '/images/strawberry_matcha.jpg',
    badge: 'STAFF PICK',
    badgeColor: 'cherry',
    isPopular: true,
    calories: 190,
    dietary: ['Vegan', 'Real Fruit'],
    customizable: true,
  },
  {
    id: 'vanilla-matcha',
    name: 'Vanilla Matcha',
    category: 'matcha',
    price: 5.75,
    description: 'Ceremonial grade matcha infused with pure Madagascar vanilla bean syrup and oat milk.',
    image: 'https://images.unsplash.com/photo-1515823662972-da6a2e4d3002?auto=format&fit=crop&w=600&q=80',
    calories: 170,
    dietary: ['Vegan'],
    customizable: true,
  },

  // SPECIALS
  {
    id: 'sunrise-cold-brew',
    name: 'Sunrise Cold Brew',
    category: 'specials',
    price: 6.25,
    description: 'Layered 20-hour steeped slow cold brew over fresh blood orange citrus and a hint of vanilla blossom.',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?auto=format&fit=crop&w=600&q=80',
    badge: 'GUEST FAVE',
    badgeColor: 'butter',
    isPopular: true,
    calories: 110,
    dietary: ['Vegan', 'Gluten-Free'],
    customizable: true,
  },
  {
    id: 'cherry-cold-foam',
    name: 'Cherry Cold Foam',
    category: 'specials',
    price: 6.00,
    description: 'Signature 20-hour dark cold brew topped with thick whipped cherry vanilla cold foam and a maraschino cherry.',
    image: '/images/cherry_cold_foam.jpg',
    badge: 'LIMITED EDITION',
    badgeColor: 'cherry',
    isPopular: true,
    calories: 160,
    dietary: ['Vegetarian'],
    customizable: true,
  },
  {
    id: 'brown-sugar-shaken-espresso',
    name: 'Brown Sugar Shaken Espresso',
    category: 'specials',
    price: 6.25,
    description: 'Blonde espresso shots shaken with dark Muscovado brown sugar, cinnamon, and ice, topped with oat milk.',
    image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80',
    badge: 'VIRAL FAVE',
    badgeColor: 'butter',
    calories: 140,
    dietary: ['Vegan'],
    customizable: true,
  },
  {
    id: 'seasonal-matcha',
    name: 'Seasonal Honey Yuzu Matcha',
    category: 'specials',
    price: 6.50,
    description: 'Sparkling Japanese yuzu citrus infusion with raw wild honey and a layered vibrant matcha float.',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    calories: 130,
    dietary: ['Vegetarian', 'Gluten-Free'],
    customizable: true,
  },

  // PASTRIES
  {
    id: 'croissant',
    name: 'Butter Croissant',
    category: 'pastries',
    price: 4.25,
    description: 'Flaky, 36-layer French butter croissant baked fresh every morning by our partner bakery.',
    image: '/images/pastries.jpg',
    badge: 'BAKED DAILY',
    badgeColor: 'butter',
    calories: 280,
    dietary: ['Vegetarian'],
    customizable: false,
  },
  {
    id: 'chocolate-croissant',
    name: 'Chocolate Croissant (Pain au Chocolat)',
    category: 'pastries',
    price: 4.75,
    description: 'Golden laminated pastry dough filled with double batons of 70% Valrhona dark chocolate.',
    image: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80',
    calories: 320,
    dietary: ['Vegetarian'],
    customizable: false,
  },
  {
    id: 'banana-bread',
    name: 'Warm Espresso Banana Bread',
    category: 'pastries',
    price: 4.50,
    description: 'Moist caramelized banana loaf with toasted walnuts and an espresso glaze drizzle. Served warm.',
    image: 'https://images.unsplash.com/photo-1607958996333-41aef7caefaa?auto=format&fit=crop&w=600&q=80',
    calories: 310,
    dietary: ['Vegetarian', 'Contains Nuts'],
    customizable: false,
  },
  {
    id: 'cinnamon-roll',
    name: 'Brown Butter Cinnamon Roll',
    category: 'pastries',
    price: 5.00,
    description: 'Fluffy brioche swirl packed with Saigon cinnamon, brown butter, and a whipped cream cheese frosting.',
    image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80',
    badge: 'MUST TRY',
    badgeColor: 'cherry',
    calories: 380,
    dietary: ['Vegetarian'],
    customizable: false,
  },
  {
    id: 'seasonal-pastry',
    name: 'Cardamom Pistachio Bun',
    category: 'pastries',
    price: 5.25,
    description: 'Swedish-style knotted cardamom dough topped with crushed Sicilian pistachios and pearl sugar.',
    image: 'https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=600&q=80',
    calories: 340,
    dietary: ['Vegetarian', 'Contains Nuts'],
    customizable: false,
  },
];

export const MILK_OPTIONS = [
  { label: 'Oat Milk (Default)', price: 0 },
  { label: 'Whole Milk', price: 0 },
  { label: 'Almond Milk', price: 0.75 },
  { label: 'Pistachio Milk', price: 1.00 },
  { label: 'Coconut Milk', price: 0.75 },
];

export const SWEETNESS_OPTIONS = [
  'Regular Sweet (100%)',
  'Less Sweet (50%)',
  'Light Sweet (25%)',
  'Unsweetened (0%)',
  'Extra Sweet (125%)',
];

export const TEMP_OPTIONS = [
  'Iced (Standard Ice)',
  'Iced (Light Ice)',
  'Iced (Extra Ice)',
  'Hot (Steamed)',
];

export const EXTRA_OPTIONS = [
  { label: 'Extra Espresso Shot', price: 1.25 },
  { label: 'Add Cherry Cold Foam', price: 1.50 },
  { label: 'Pure Madagascar Vanilla Syrup', price: 0.75 },
  { label: 'House Lavender Syrup', price: 0.75 },
  { label: 'Whipped Cream', price: 0.50 },
];

export const JOURNAL_ARTICLES: JournalArticle[] = [
  {
    id: 'personality-orders',
    slug: '5-coffee-orders-that-reveal-your-personality',
    title: '5 coffee orders that reveal your personality',
    category: 'CAFÉ CULTURE',
    date: 'OCTOBER 2026',
    readTime: '4 min read',
    author: {
      name: 'Leo Chen',
      role: 'Head Barista & Co-Founder',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    },
    excerpt: 'You think you just want caffeine, but your drink choice is broadcasting your deepest emotional state to everyone behind the counter.',
    image: '/images/iced_latte.jpg',
    tags: ['Humor', 'Barista Life', 'Horoscopes'],
    likes: 342,
    content: [
      'We’ve seen thousands of humans walk through the Little Cup doors at 7:15 AM on a Monday morning. After years behind the La Marzocco, we have developed a peer-reviewed, totally scientifically unverifiable system for diagnosing your psychological state purely through your beverage.',
      '1. The Iced Oat Latte in Sub-Zero Winter: You are invincible. Snow outside? Doesn’t matter. You run warm, you have 47 unread tabs open in Chrome, and you believe hydration is an attitude rather than a biological requirement.',
      '2. The Quad-Shot Espresso at 4:30 PM: You are either pitching a venture capital fund, studying for the LSAT, or dealing with a crisis you haven’t told your therapist about yet. We respect you, but please drink some water.',
      '3. The Strawberry Matcha with Extra Foam: You have an aesthetic Notion workspace, an adorable film camera, and you never leave the house without at least three different lip glosses in your tote bag.',
      '4. The Americano, Black: You do not have time for fluff. You send emails that say simply "thx" with no punctuation. You are dangerously efficient and possibly sleep on a yoga mat.',
      '5. The Cherry Cold Foam Connoisseur: You understand that life is too short to drink boring coffee. You romanticize walking down the street with headphones on and pretending you are the main character in an A24 movie. (You are).'
    ]
  },
  {
    id: 'matcha-obsession',
    slug: 'why-everyone-is-suddenly-obsessed-with-matcha',
    title: 'Why everyone is suddenly obsessed with matcha',
    category: 'DEEP DIVE',
    date: 'SEPTEMBER 2026',
    readTime: '6 min read',
    author: {
      name: 'Maya Lin',
      role: 'Creative Director & Co-Founder',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    },
    excerpt: 'It is not just about the chlorophyll and L-theanine. It is about swapping anxiety spikes for calm, steady, luminous energy.',
    image: '/images/hero_matcha.jpg',
    tags: ['Matcha', 'Wellness', 'Taste Notes'],
    likes: 518,
    content: [
      'Take a scroll through any downtown café on a sunny Thursday afternoon, and you will notice a vibrant green revolution taking over the tabletops.',
      'Unlike the jittery rollercoaster spike of conventional dark roasts, ceremonial grade matcha delivers caffeine bound to L-theanine—an amino acid that promotes alpha brainwave activity. In plain English? It makes you feel alert, deeply focused, yet profoundly chill.',
      'At The Little Cup, we source directly from single-harvest shade-grown farms in Uji, Kyoto. We whisk each portion with a traditional bamboo chasen at 80°C before pouring it over cold organic oat milk. When done right, it tastes velvety, grassy, sweet, and comforting like a gentle hug for your nervous system.'
    ]
  },
  {
    id: 'pastry-ranking',
    slug: 'a-very-serious-ranking-of-cafe-pastries',
    title: 'A very serious ranking of café pastries',
    category: 'FOOD & TASTE',
    date: 'AUGUST 2026',
    readTime: '5 min read',
    author: {
      name: 'Samira K.',
      role: 'Pastry Lead',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80',
    },
    excerpt: 'We tasted 24 different buttery, flaky baked goods so you don’t have to. Here is our official, unhinged ranking.',
    image: '/images/pastries.jpg',
    tags: ['Pastries', 'Rankings', 'Butter'],
    likes: 429,
    content: [
      'Café pastry selection is a high-stakes sport. Pick the wrong croissant, and you are left chewing on dry, crumbly cardboard while sipping your artisanal flat white.',
      '#1: The Brown Butter Cinnamon Roll. Warm, gooey center, crisp caramel exterior, tang from real cream cheese. A transcendent spiritual experience.',
      '#2: The 36-Layer Butter Croissant. If it doesn’t shatter into a thousand flakes when you bite into it, we don’t want it.',
      '#3: The Cardamom Pistachio Knotted Bun. For the sophisticated palates who want spice and crunch over cloying sweetness.',
      '#4: Warm Espresso Banana Bread. Nostalgic, dense, and pairs impeccably with cold brew.'
    ]
  },
  {
    id: 'slow-mornings',
    slug: 'slow-mornings-over-productive-mornings',
    title: 'Slow mornings > productive mornings',
    category: 'LIFESTYLE',
    date: 'JULY 2026',
    readTime: '3 min read',
    author: {
      name: 'Maya Lin',
      role: 'Creative Director',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80',
    },
    excerpt: 'In defense of sitting by the window with a ceramic mug for 45 minutes without checking your notifications.',
    image: '/images/cafe_interior.jpg',
    tags: ['Slow Living', 'Mindfulness', 'Morning Routine'],
    likes: 671,
    content: [
      'We live in a world obsessed with 5:00 AM routines, cold plunges, and optimizing every microsecond of existence. But what if the greatest luxury is doing absolutely nothing for the first hour of your day?',
      'Sit on our corner bench. Feel the warm sun hit the wooden table. Smell the freshly ground espresso beans. Listen to the vinyl record spinning. Let your mind wander. Your best ideas don’t come from stress—they come from empty space and great coffee.'
    ]
  }
];

export const INSTAGRAM_POSTS: InstagramPost[] = [
  {
    id: 'ig-1',
    image: '/images/hero_matcha.jpg',
    caption: 'Green magic hour in the corner booth 🌿 oat milk clouds only.',
    likes: 1240,
    comments: 48,
    tag: '#matchalover',
    rotation: '-2deg',
  },
  {
    id: 'ig-2',
    image: '/images/cafe_interior.jpg',
    caption: 'POV: your Saturday morning meeting went 3 hours over because of good banter ☕✨',
    likes: 2480,
    comments: 92,
    tag: '#neighborhoodcafe',
    rotation: '2deg',
  },
  {
    id: 'ig-3',
    image: '/images/cherry_cold_foam.jpg',
    caption: 'cherry on top of a very chaotic week 🍒',
    likes: 1890,
    comments: 63,
    tag: '#cherrycoldfoam',
    rotation: '-1deg',
  },
  {
    id: 'ig-4',
    image: '/images/pastries.jpg',
    caption: 'Croissant crumbs are our love language 🥐✨ fresh out the oven at 7am.',
    likes: 1620,
    comments: 39,
    tag: '#flakycrust',
    rotation: '3deg',
  },
  {
    id: 'ig-5',
    image: '/images/strawberry_matcha.jpg',
    caption: 'Strawberry Matcha season is forever here. Don’t sleep on this 🍓',
    likes: 3100,
    comments: 114,
    tag: '#strawberrymatcha',
    rotation: '-2deg',
  },
  {
    id: 'ig-6',
    image: '/images/iced_latte.jpg',
    caption: 'The golden hour iced oat latte. Zero thoughts, head full of caffeine 🧊',
    likes: 1450,
    comments: 55,
    tag: '#thelittlecup',
    rotation: '1.5deg',
  },
];
