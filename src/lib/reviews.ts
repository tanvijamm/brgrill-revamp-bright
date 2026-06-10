import type { Location } from "./locations";

export type ReviewSource = {
  platform: "google" | "yelp";
  label: string;
  rating: number;
  reviewCount: number;
  profileUrl: string;
  embedUrl?: string;
};

export type FeaturedReview = {
  author: string;
  rating: number;
  platform: "google" | "yelp";
  text: string;
  location: string;
  date: string;
};

/** Per-location review profiles — update counts periodically or wire to Places/Yelp APIs later. */
export const LOCATION_REVIEWS: Record<
  Location["slug"],
  { google: ReviewSource; yelp: ReviewSource }
> = {
  ashburn: {
    google: {
      platform: "google",
      label: "Google",
      rating: 4.3,
      reviewCount: 420,
      profileUrl: "https://www.google.com/maps/search/?api=1&query=Blue+Ridge+Grill+Ashburn+VA",
      embedUrl:
        "https://maps.google.com/maps?q=Blue+Ridge+Grill+Ashburn+VA&output=embed",
    },
    yelp: {
      platform: "yelp",
      label: "Yelp",
      rating: 4.0,
      reviewCount: 180,
      profileUrl: "https://www.yelp.com/biz/blue-ridge-grill-ashburn",
    },
  },
  brambleton: {
    google: {
      platform: "google",
      label: "Google",
      rating: 4.4,
      reviewCount: 510,
      profileUrl: "https://www.google.com/maps/search/?api=1&query=Blue+Ridge+Grill+Brambleton+VA",
      embedUrl:
        "https://maps.google.com/maps?q=Blue+Ridge+Grill+Brambleton+VA&output=embed",
    },
    yelp: {
      platform: "yelp",
      label: "Yelp",
      rating: 4.0,
      reviewCount: 210,
      profileUrl: "https://www.yelp.com/biz/blue-ridge-grill-brambleton",
    },
  },
  leesburg: {
    google: {
      platform: "google",
      label: "Google",
      rating: 4.2,
      reviewCount: 390,
      profileUrl: "https://www.google.com/maps/search/?api=1&query=Blue+Ridge+Grill+Leesburg+VA",
      embedUrl:
        "https://maps.google.com/maps?q=Blue+Ridge+Grill+Leesburg+VA&output=embed",
    },
    yelp: {
      platform: "yelp",
      label: "Yelp",
      rating: 4.0,
      reviewCount: 165,
      profileUrl: "https://www.yelp.com/biz/blue-ridge-grill-leesburg",
    },
  },
};

export const FEATURED_REVIEWS: FeaturedReview[] = [
  {
    author: "Sarah M.",
    rating: 5,
    platform: "google",
    text: "Consistently great food and friendly staff. The crab cakes and salmon are always on point — our family's go-to spot in Loudoun.",
    location: "Leesburg",
    date: "Recent",
  },
  {
    author: "James T.",
    rating: 5,
    platform: "yelp",
    text: "Reliable casual dining with generous portions and fair prices. Call-ahead seating works great on busy weekends.",
    location: "Brambleton",
    date: "Recent",
  },
  {
    author: "Maria L.",
    rating: 4,
    platform: "google",
    text: "Warm atmosphere, excellent service from Rachel and the team. Wine night on Mondays is a hidden gem.",
    location: "Ashburn",
    date: "Recent",
  },
  {
    author: "David K.",
    rating: 5,
    platform: "yelp",
    text: "Been coming here for years. The bar menu, brunch, and to-go orders make it easy to visit often.",
    location: "Leesburg",
    date: "Recent",
  },
  {
    author: "Jennifer R.",
    rating: 5,
    platform: "google",
    text: "Outstanding brunch and attentive staff every time. The portions are generous and the whole family leaves happy.",
    location: "Brambleton",
    date: "Recent",
  },
  {
    author: "Chris P.",
    rating: 5,
    platform: "yelp",
    text: "A Loudoun County staple — great value, consistent quality, and a welcoming neighborhood feel.",
    location: "Ashburn",
    date: "Recent",
  },
];
