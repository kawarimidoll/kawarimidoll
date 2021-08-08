import { decode } from "https://deno.land/std@0.103.0/encoding/base64.ts";import { gunzip } from "https://raw.githubusercontent.com/kt3k/compress/bbe0a818d2acd399350b30036ff8772354b1c2df/gzip/gzip.ts";const pageData = [decode("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"), '"49f7132a44df4f57d122bddd7d4ce589"', "private"];addEventListener("fetch", (e) => {const { pathname, origin } = new URL(e.request.url);if (pathname !== "/") {e.respondWith(Response.redirect(origin));return;}const [bytes, etag, cacheControl] = pageData;if (e.request.headers.get("if-none-match") === etag) {e.respondWith(new Response(null, { status: 304, statusText: "Not Modified" }));return;}const headers = {etag,"cache-control": cacheControl,"content-type": "text/html",};if (e.request.headers.get("accept-encoding")?.split(/[,;]s*/).includes("gzip")) {e.respondWith(new Response(bytes, {headers: { ...headers, "content-encoding": "gzip" },}));} else {e.respondWith(new Response(gunzip(bytes), { headers }));}return;});