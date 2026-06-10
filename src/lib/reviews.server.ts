import type { FeaturedReview, ReviewSource } from "./reviews";
import { FEATURED_REVIEWS, LOCATION_REVIEWS } from "./reviews";
import type { Location } from "./locations";

type LocationSlug = Location["slug"];

const GOOGLE_PLACE_IDS: Record<LocationSlug, string | undefined> = {
  ashburn: process.env.GOOGLE_PLACE_ID_ASHBURN,
  brambleton: process.env.GOOGLE_PLACE_ID_BRAMBLETON,
  leesburg: process.env.GOOGLE_PLACE_ID_LEESBURG,
};

const YELP_BUSINESS_IDS: Record<LocationSlug, string | undefined> = {
  ashburn: process.env.YELP_BUSINESS_ID_ASHBURN ?? "blue-ridge-grill-ashburn",
  brambleton: process.env.YELP_BUSINESS_ID_BRAMBLETON ?? "blue-ridge-grill-brambleton",
  leesburg: process.env.YELP_BUSINESS_ID_LEESBURG ?? "blue-ridge-grill-leesburg",
};

export type LiveReviewsPayload = {
  locationReviews: typeof LOCATION_REVIEWS;
  featuredReviews: FeaturedReview[];
  fetchedAt: string;
  live: { google: boolean; yelp: boolean };
};

async function fetchGooglePlace(
  slug: LocationSlug,
  fallback: ReviewSource,
): Promise<ReviewSource> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = GOOGLE_PLACE_IDS[slug];
  if (!apiKey || !placeId) return fallback;

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "rating,userRatingCount,reviews",
      },
    });
    if (!res.ok) return fallback;
    const data = (await res.json()) as {
      rating?: number;
      userRatingCount?: number;
      reviews?: { text?: { text?: string }; authorAttribution?: { displayName?: string }; rating?: number }[];
    };

    return {
      ...fallback,
      rating: data.rating ?? fallback.rating,
      reviewCount: data.userRatingCount ?? fallback.reviewCount,
    };
  } catch {
    return fallback;
  }
}

async function fetchYelpBusiness(
  slug: LocationSlug,
  fallback: ReviewSource,
): Promise<{ source: ReviewSource; reviews: FeaturedReview[] }> {
  const apiKey = process.env.YELP_API_KEY;
  const businessId = YELP_BUSINESS_IDS[slug];
  if (!apiKey || !businessId) return { source: fallback, reviews: [] };

  try {
    const res = await fetch(`https://api.yelp.com/v3/businesses/${businessId}`, {
      headers: { Authorization: `Bearer ${apiKey}` },
    });
    if (!res.ok) return { source: fallback, reviews: [] };
    const data = (await res.json()) as { rating?: number; review_count?: number; url?: string };

    const reviewsRes = await fetch(
      `https://api.yelp.com/v3/businesses/${businessId}/reviews?limit=3&sort_by=yelp_sort`,
      { headers: { Authorization: `Bearer ${apiKey}` } },
    );
    const reviewItems: FeaturedReview[] = [];
    if (reviewsRes.ok) {
      const reviewsData = (await reviewsRes.json()) as {
        reviews?: { user?: { name?: string }; rating?: number; text?: string }[];
      };
      const locName = slug.charAt(0).toUpperCase() + slug.slice(1);
      for (const r of reviewsData.reviews ?? []) {
        if (!r.text) continue;
        reviewItems.push({
          author: r.user?.name ?? "Yelp Guest",
          rating: r.rating ?? 5,
          platform: "yelp",
          text: r.text,
          location: locName,
          date: "Recent",
        });
      }
    }

    return {
      source: {
        ...fallback,
        rating: data.rating ?? fallback.rating,
        reviewCount: data.review_count ?? fallback.reviewCount,
        profileUrl: data.url ?? fallback.profileUrl,
      },
      reviews: reviewItems,
    };
  } catch {
    return { source: fallback, reviews: [] };
  }
}

async function fetchGoogleReviews(
  slug: LocationSlug,
): Promise<FeaturedReview[]> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = GOOGLE_PLACE_IDS[slug];
  if (!apiKey || !placeId) return [];

  try {
    const res = await fetch(`https://places.googleapis.com/v1/places/${placeId}`, {
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "reviews",
      },
    });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      reviews?: { text?: { text?: string }; authorAttribution?: { displayName?: string }; rating?: number }[];
    };
    const locName = slug.charAt(0).toUpperCase() + slug.slice(1);
    return (data.reviews ?? [])
      .filter((r) => r.text?.text)
      .slice(0, 2)
      .map((r) => ({
        author: r.authorAttribution?.displayName ?? "Google Guest",
        rating: r.rating ?? 5,
        platform: "google" as const,
        text: r.text!.text!,
        location: locName,
        date: "Recent",
      }));
  } catch {
    return [];
  }
}

export async function fetchLiveReviews(): Promise<LiveReviewsPayload> {
  const slugs: LocationSlug[] = ["ashburn", "brambleton", "leesburg"];
  let googleLive = false;
  let yelpLive = false;

  const locationReviews = { ...LOCATION_REVIEWS };
  const liveFeatured: FeaturedReview[] = [];

  await Promise.all(
    slugs.map(async (slug) => {
      const fallback = LOCATION_REVIEWS[slug];
      const [google, yelpResult, googleReviews] = await Promise.all([
        fetchGooglePlace(slug, fallback.google),
        fetchYelpBusiness(slug, fallback.yelp),
        fetchGoogleReviews(slug),
      ]);

      if (google.reviewCount !== fallback.google.reviewCount || google.rating !== fallback.google.rating) {
        googleLive = googleLive || !!process.env.GOOGLE_PLACES_API_KEY;
      }
      if (yelpResult.source.reviewCount !== fallback.yelp.reviewCount) {
        yelpLive = yelpLive || !!process.env.YELP_API_KEY;
      }

      locationReviews[slug] = { google, yelp: yelpResult.source };
      liveFeatured.push(...googleReviews, ...yelpResult.reviews);
    }),
  );

  const featuredReviews =
    liveFeatured.length >= 4
      ? liveFeatured.slice(0, 6)
      : FEATURED_REVIEWS;

  return {
    locationReviews,
    featuredReviews,
    fetchedAt: new Date().toISOString(),
    live: {
      google: googleLive || !!process.env.GOOGLE_PLACES_API_KEY,
      yelp: yelpLive || !!process.env.YELP_API_KEY,
    },
  };
}
