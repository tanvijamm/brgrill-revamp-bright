import { createServerFn } from "@tanstack/react-start";

import { fetchLiveReviews } from "../reviews.server";

export const getLiveReviews = createServerFn({ method: "GET" }).handler(async () => {
  return fetchLiveReviews();
});
