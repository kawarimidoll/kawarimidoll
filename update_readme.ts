import { parseFeed } from "rss";

const feed = await parseFeed(
  await fetch("https://zenn.dev/kawarimidoll/feed").then((r) => r.text()),
);

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

const filename = "./README.md";
const text = await Deno.readTextFile(filename);

const replaceFlg = "<!-- zenn-article-link-next-line -->";
const regex = new RegExp(`${replaceFlg}\n.*`);

const dst = `${replaceFlg}\n<a href="${link}"><img alt="Zenn" src="${url}" style="width:480px"></a>`;
await Deno.writeTextFile(filename, text.replace(regex, dst));
