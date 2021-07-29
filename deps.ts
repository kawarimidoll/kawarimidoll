import ky from "https://cdn.skypack.dev/ky@0.28.5?dts";
import {
  deserializeFeed,
  Feed,
  FeedType,
  RSS1,
  RSS2,
} from "https://deno.land/x/rss@0.4.0/mod.ts";
import { download } from "https://deno.land/x/download@v1.0.1/mod.ts";

export { deserializeFeed, download, FeedType, ky };
export type { Feed, RSS1, RSS2 };
