import { CONFIG } from "./config";
import { WebClient } from "@slack/web-api";
import { tenRetriesInAboutThirtyMinutes } from "@slack/web-api/dist/retry-policies";

export const CLIENT = new WebClient(CONFIG.botToken, {
  retryConfig: tenRetriesInAboutThirtyMinutes,
});
