import { download, ky, parseFeed } from "./deps.ts";

const rss = async (url: string) => await parseFeed(await ky(url).text());

const feed = await rss("https://zenn.dev/kawarimidoll/feed");

const item = feed.entries[0];
if (!item) {
  throw new Error("Item not found");
}

const { title, links, attachments } = item;
if (!links || !links[0] || !links[0].href) {
  throw new Error("Page link not found");
}
const link = links[0].href;
if (!attachments || !attachments[0] || !attachments[0].url) {
  throw new Error("Image URL not found");
}
const url = attachments[0].url;

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
