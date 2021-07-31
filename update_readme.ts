import {
  deserializeFeed,
  download,
  Feed,
  FeedType,
  ky,
  RSS1,
  RSS2,
} from "./deps.ts";

const rss = async (url: string) => await deserializeFeed(await ky(url).text());

const isRss2 = (
  feed: Feed | RSS1 | RSS2,
  feedType: FeedType.Atom | FeedType.Rss1 | FeedType.Rss2,
): feed is RSS2 => feed && feedType === FeedType.Rss2;

const { feed, feedType } = await rss("https://zenn.dev/kawarimidoll/feed");
if (!isRss2(feed, feedType)) {
  throw new Error("Invalid feed type");
}

const item = feed.channel?.items[0];
if (!item) {
  throw new Error("Item not found");
}

const { title, link, enclosure } = item;
if (!link) {
  throw new Error("Link not found");
}
const url = enclosure?.url;
if (!url) {
  throw new Error("URL not found");
}

console.log({ title, link, url });
const file = "zenn.png";
const dir = "./assets";
await download(url, { file, dir });

const readme = "./README.md";
const text = await Deno.readTextFile(readme);

const urlStr = "https?:\/\/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+";
const replaceFlg = "<!-- zenn-article-link-next-line -->";
const regex = new RegExp(`(${replaceFlg}\n.*)${urlStr}`);
await Deno.writeTextFile(readme, text.replace(regex, `$1${link}`));

// const linkRegex = new RegExp(
//   "https?:\/\/zenn.dev/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+",
// );
// const imageRegex = new RegExp(
//   "https?:\/\/res.cloudinary.com/[-_.!~*'()a-zA-Z0-9;\/?:\@&=+\$,%#]+",
// );
// await Deno.writeTextFile(
//   readme,
//   text.replace(linkRegex, link).replace(imageRegex, url),
// );
