import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LOCATION_LIST } from "@/lib/locations";
import { getLiveReviews } from "@/lib/api/reviews.functions";
import { FEATURED_REVIEWS, LOCATION_REVIEWS, type FeaturedReview } from "@/lib/reviews";

type Tab = "all" | "google" | "yelp";

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "Overview" },
  { id: "google", label: "Google" },
  { id: "yelp", label: "Yelp" },
];

function getAggregateStats(locationReviews: typeof LOCATION_REVIEWS) {
  const sources = Object.values(locationReviews).flatMap((r) => [r.google, r.yelp]);
  const totalReviews = sources.reduce((sum, s) => sum + s.reviewCount, 0);
  const avgRating =
    sources.reduce((sum, s) => sum + s.rating * s.reviewCount, 0) / totalReviews;
  const googleTotal = Object.values(locationReviews).reduce(
    (sum, r) => sum + r.google.reviewCount,
    0,
  );
  const yelpTotal = Object.values(locationReviews).reduce(
    (sum, r) => sum + r.yelp.reviewCount,
    0,
  );
  const googleAvg =
    Object.values(locationReviews).reduce(
      (sum, r) => sum + r.google.rating * r.google.reviewCount,
      0,
    ) / googleTotal;
  const yelpAvg =
    Object.values(locationReviews).reduce(
      (sum, r) => sum + r.yelp.rating * r.yelp.reviewCount,
      0,
    ) / yelpTotal;

  return {
    avgRating: Math.round(avgRating * 10) / 10,
    totalReviews,
    googleAvg: Math.round(googleAvg * 10) / 10,
    googleTotal,
    yelpAvg: Math.round(yelpAvg * 10) / 10,
    yelpTotal,
  };
}

export function ReviewsSection() {
  const [tab, setTab] = useState<Tab>("all");
  const [mapSlug, setMapSlug] = useState<(typeof LOCATION_LIST)[number]["slug"]>("ashburn");

  const { data } = useQuery({
    queryKey: ["live-reviews"],
    queryFn: () => getLiveReviews(),
    staleTime: 1000 * 60 * 60,
    placeholderData: {
      locationReviews: LOCATION_REVIEWS,
      featuredReviews: FEATURED_REVIEWS,
      fetchedAt: "",
      live: { google: false, yelp: false },
    },
  });

  const locationReviews = data?.locationReviews ?? LOCATION_REVIEWS;
  const featuredReviews = data?.featuredReviews ?? FEATURED_REVIEWS;
  const stats = getAggregateStats(locationReviews);

  return (
    <section id="reviews" className="scroll-mt-24 border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p
            className="text-sm font-semibold uppercase tracking-widest"
            style={{ color: "var(--brand-green)" }}
          >
            What Guests Are Saying
          </p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">
            Review & Reputation
          </h2>
          <p className="mt-3 text-muted-foreground">
            Fresh reviews from Google and Yelp across all three locations
            {data?.live.google || data?.live.yelp ? " — updated automatically." : "."}
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Overall rating"
            value={stats.avgRating.toFixed(1)}
            sub={`${stats.totalReviews.toLocaleString()} reviews`}
            icon="★"
          />
          <StatCard
            label="Google"
            value={stats.googleAvg.toFixed(1)}
            sub={`${stats.googleTotal.toLocaleString()} reviews`}
            icon="G"
          />
          <StatCard
            label="Yelp"
            value={stats.yelpAvg.toFixed(1)}
            sub={`${stats.yelpTotal.toLocaleString()} reviews`}
            icon="Y"
          />
        </div>

        <div className="mt-10 flex flex-wrap gap-2 border-b border-border pb-px">
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className="rounded-t-md px-4 py-2.5 text-sm font-semibold transition-colors"
              style={
                tab === t.id
                  ? { backgroundColor: "var(--brand-blue)", color: "white" }
                  : { color: "var(--foreground)" }
              }
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "all" && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {featuredReviews.map((review, i) => (
                <ReviewCard key={`${review.author}-${review.location}-${i}`} review={review} />
              ))}
            </div>
          )}

          {tab === "google" && (
            <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">
              <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
                <div className="flex flex-wrap gap-2 border-b p-3">
                  {LOCATION_LIST.map((loc) => (
                    <button
                      key={loc.slug}
                      type="button"
                      onClick={() => setMapSlug(loc.slug)}
                      className="rounded-md px-3 py-1.5 text-xs font-semibold transition-colors"
                      style={
                        mapSlug === loc.slug
                          ? { backgroundColor: "var(--brand-blue)", color: "white" }
                          : { backgroundColor: "var(--muted)" }
                      }
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
                <div className="aspect-[4/3] w-full">
                  <iframe
                    title={`Google reviews — ${locationReviews[mapSlug].google.label} ${mapSlug}`}
                    src={locationReviews[mapSlug].google.embedUrl}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
              <div className="space-y-4">
                {LOCATION_LIST.map((loc) => {
                  const g = locationReviews[loc.slug].google;
                  return (
                    <a
                      key={loc.slug}
                      href={g.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="block rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <div className="font-display font-semibold">{loc.name}</div>
                      <div className="mt-1 flex items-center gap-2 text-sm">
                        <Stars rating={g.rating} />
                        <span className="text-muted-foreground">
                          {g.reviewCount.toLocaleString()} reviews on Google
                        </span>
                      </div>
                      <span
                        className="mt-2 inline-block text-xs font-semibold"
                        style={{ color: "var(--brand-blue)" }}
                      >
                        View on Google Maps →
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          )}

          {tab === "yelp" && (
            <div className="grid gap-4 md:grid-cols-3">
              {LOCATION_LIST.map((loc) => {
                const y = locationReviews[loc.slug].yelp;
                const locReviews = featuredReviews.filter(
                  (r) => r.platform === "yelp" && r.location === loc.name,
                );
                return (
                  <div key={loc.slug} className="rounded-xl border bg-card p-5 shadow-sm">
                    <div className="font-display text-lg font-semibold">{loc.name}</div>
                    <div className="mt-2 flex items-center gap-2">
                      <Stars rating={y.rating} />
                      <span className="text-sm text-muted-foreground">
                        {y.reviewCount.toLocaleString()} Yelp reviews
                      </span>
                    </div>
                    {locReviews[0] && (
                      <p className="mt-4 text-sm text-muted-foreground line-clamp-4">
                        "{locReviews[0].text}"
                      </p>
                    )}
                    <a
                      href={y.profileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="mt-4 inline-flex rounded-md px-4 py-2 text-xs font-semibold text-white"
                      style={{ backgroundColor: "#d32323" }}
                    >
                      Read on Yelp
                    </a>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
}: {
  label: string;
  value: string;
  sub: string;
  icon: string;
}) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-start justify-between gap-2">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {label}
          </div>
          <div className="mt-1 font-display text-3xl font-bold" style={{ color: "var(--brand-blue)" }}>
            {value}
          </div>
          <div className="mt-1 text-xs text-muted-foreground">{sub}</div>
        </div>
        <span className="text-2xl opacity-40" aria-hidden>
          {icon}
        </span>
      </div>
    </div>
  );
}

function Stars({ rating }: { rating: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span className="inline-flex text-amber-500" aria-label={`${rating} out of 5 stars`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < full ? "" : half && i === full ? "opacity-60" : "opacity-25"}>
          ★
        </span>
      ))}
    </span>
  );
}

function ReviewCard({ review }: { review: FeaturedReview }) {
  return (
    <div className="rounded-xl border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <Stars rating={review.rating} />
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {review.platform === "google" ? "Google" : "Yelp"} · {review.location}
        </span>
      </div>
      <p className="mt-3 text-sm text-muted-foreground">"{review.text}"</p>
      <div className="mt-3 text-xs font-semibold text-foreground">— {review.author}</div>
    </div>
  );
}
