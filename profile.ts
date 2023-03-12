import { tag as h } from "https://deno.land/x/markup_tag@0.3.0/mod.ts";
import { ensureDir } from "https://deno.land/std@0.179.0/fs/mod.ts";
import { main as deployDir } from "https://deno.land/x/deploy_dir@v0.3.2/cli.ts";

const css = (cssObject: Record<string, Record<string, unknown>>) =>
  Object.entries(cssObject).map(([selector, attributes]) =>
    selector + "{" +
    Object.entries(attributes).map(([k, v]) => `${k}:${v}`).join(";") +
    "}"
  ).join("");

const title = "kawarimidoll profile";
const avatarURL = "https://avatars.githubusercontent.com/u/8146876?v=4";
const faviconURL =
  "https://raw.githubusercontent.com/kawarimidoll/kawarimidoll/master/assets/kawarimi_chip_icon.svg";
const styles = css({
  body: {
    display: "flex",
    "justify-content": "center",
    margin: "0",
    "text-align": "center",
    "scroll-behavior": "smooth",
    "font-family": "sans-serif,monospace",
  },
  a: { "text-decoration": "none" },
  h2: {
    "margin-block-start": "-2rem",
    "margin-block-end": "0",
    "padding-top": "4rem",
  },
  img: { display: "block", margin: "0 auto" },
  "#main": { width: "100%", "max-width": "800px", padding: "1rem 0.5rem" },
  ".avatar": { "border-radius": "50%", height: "auto" },
  ".list-group": { "max-width": "500px", margin: "0 auto" },
  ".list-item": {
    "border-radius": "5px",
    "border-style": "solid",
    "border-width": "thin",
    margin: "0.5rem auto",
    padding: "0.5rem 2rem",
  },
  ".nav-box": {
    "background-color": "#fff",
    position: "sticky",
    top: "0",
    "border-bottom": "1px solid #222",
  },
  ".nav": {
    display: "flex",
    "justify-content": "space-around",
    margin: "0 auto",
    padding: "0.5rem",
    width: "100%",
    "max-width": "300px",
  },
  ".nav>a": {
    display: "block",
  },
});

const icongram = (name: string, size = 20) =>
  h("img", {
    src: `https://icongr.am/${
      name.replace(/(^[^\/]*$)/, "feather/$1")
    }.svg?size=${size}`,
    alt: name,
  });

const iconText = (icon: string, text: string) =>
  h("div", { class: "list-item" }, icongram(icon), h("div", text));

const iconLink = (icon: string, text: string, href: string) =>
  h("a", { href }, iconText(icon, text));

const html = "<!DOCTYPE html>" +
  h(
    "html",
    h(
      "head",
      { prefix: "og:http://ogp.me/ns#" },
      h("meta", { charset: "utf-8" }),
      h("meta", {
        name: "viewport",
        content: "width=device-width,initial-scale=1.0",
      }),
      h("meta", {
        property: "og:url",
        content: "https://kawarimidoll.deno.dev",
      }),
      h("meta", { property: "og:type", content: "website" }),
      h("meta", { property: "og:title", content: title }),
      h("meta", { property: "og:description", content: "About kawarimidoll" }),
      h("meta", { property: "og:site_name", content: title }),
      h("meta", { property: "og:image", content: avatarURL }),
      h("meta", { name: "twitter:card", content: "summary" }),
      h("meta", { name: "twitter:site", content: "@kawarimidoll" }),
      h("title", title),
      h("style", styles),
      h("link", { rel: "icon", type: "image/svg+xml", href: faviconURL }),
    ),
    h(
      "body",
      h(
        "div",
        { id: "main" },
        h("img", {
          alt: "avatar",
          width: "260",
          class: "avatar",
          src: avatarURL,
        }),
        h("h1", "kawarimidoll"),
        h(
          "div",
          { style: "margin-bottom:2rem" },
          "Aim to be a hacker and a painter.",
        ),
        h("div", "Click to jump..."),
        h(
          "div",
          { class: "nav-box" },
          h(
            "div",
            { class: "nav" },
            h("a", { href: "#profiles" }, icongram("smile", 26)),
            h("a", { href: "#tools" }, icongram("tool", 26)),
            h("a", { href: "#links" }, icongram("link", 26)),
            h("a", { href: "#supports" }, icongram("gift", 26)),
          ),
        ),
        h(
          "div",
          { class: "list-group" },
          h("h2", { id: "profiles" }, icongram("smile", 40)),
          iconText("cpu", "Software developer"),
          iconText("scissors", "Yak shaver"),
          iconText("life-buoy", "Wheel reinventor"),
          iconText("triangle", "Indoor climber"),
          iconText("trending-up", "Long-term investor"),
          iconText("map-pin", "Room 101, Japan"),
          h("h2", { id: "tools" }, icongram("tool", 40)),
          iconText("monitor", "macOS"),
          iconText("smartphone", "iPhone"),
          iconText("simple/neovim", "Neovim"),
          iconText("simple/deno", "Deno"),
          h("h2", { id: "links" }, icongram("link", 40)),
          iconLink(
            "twitter",
            "Twitter",
            "https://twitter.com/kawarimidoll",
          ),
          iconLink(
            "github",
            "GitHub",
            "https://github.com/kawarimidoll",
          ),
          iconLink("grid", "Pixela", "https://pixe.la/@kawarimidoll"),
          iconLink("book", "Zenn", "https://zenn.dev/kawarimidoll"),
          iconLink(
            "search",
            "Qiita",
            "https://qiita.com/kawarimidoll",
          ),
          iconLink(
            "coffee",
            "Buy me a coffee",
            "https://www.buymeacoffee.com/kawarimidoll",
          ),
          iconLink(
            "globe",
            "My site [under construction]",
            "https://kawarimidoll.com",
          ),
          iconLink(
            "gitlab",
            "GitLab [stale]",
            "https://gitlab.com/kawarimidoll",
          ),
          iconLink(
            "package",
            "npm [stale]",
            "https://www.npmjs.com/~kawarimidoll",
          ),
          h("h2", { id: "supports" }, icongram("gift", 40)),
          iconLink(
            "simple/ubereats",
            "Uber Eats promotion code: eats-2j5di9k7b0",
            "https://ubereats.com/feed?promoCode=eats-2j5di9k7b0",
          ),
          iconLink(
            "dollar-sign",
            "Moppy invitation code: rUK7e101",
            "https://pc.moppy.jp/entry/invite.php?invite=rUK7e101",
          ),
          iconLink(
            "shopping-bag",
            "Rakuma invitation code: GHMt4",
            "https://fril.jp/download",
          ),
        ),
      ),
    ),
  );

if (Deno.args.includes("--build") || Deno.args.includes("-b")) {
  await ensureDir("./build");
  await Deno.writeTextFile("./build/index.html", html);
  await deployDir(["build", "-y", "-o", "server.js"]);
  Deno.exit(0);
}

const port = 8080;
const server = Deno.listen({ port });
console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);
for await (const conn of server) {
  (async () => {
    const httpConn = Deno.serveHttp(conn);
    for await (const requestEvent of httpConn) {
      requestEvent.respondWith(
        new Response(html, {
          status: 200,
          headers: { "content-type": "text/html" },
        }),
      );
    }
  })();
}
