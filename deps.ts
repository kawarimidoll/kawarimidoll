import ky from "https://cdn.skypack.dev/ky@0.28.5?dts";
import { parseFeed } from "https://deno.land/x/rss@1.0.4/mod.ts";
import { download } from "https://deno.land/x/download@v2.0.2/mod.ts";

import { outdent } from "https://deno.land/x/outdent@v0.8.0/mod.ts";

export { download, ky, outdent, parseFeed };
