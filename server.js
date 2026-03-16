const kv = await Deno.openKv();

const COUNTER_KEY = ["counter", "profile"];

async function getAndIncrement() {
  const result = await kv.get(COUNTER_KEY);
  const current = result.value ?? 0;
  const next = current + 1;
  await kv.set(COUNTER_KEY, next);
  return next;
}

// --- Badge-style counter ---

function renderBadgeSvg(count) {
  const label = "views";
  const value = String(count);

  const labelWidth = label.length * 7 + 10;
  const valueWidth = value.length * 7.5 + 10;
  const totalWidth = labelWidth + valueWidth;

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalWidth}" height="20">
  <linearGradient id="s" x2="0" y2="100%">
    <stop offset="0" stop-color="#bbb" stop-opacity=".1"/>
    <stop offset="1" stop-opacity=".1"/>
  </linearGradient>
  <clipPath id="r">
    <rect width="${totalWidth}" height="20" rx="3" fill="#fff"/>
  </clipPath>
  <g clip-path="url(#r)">
    <rect width="${labelWidth}" height="20" fill="#555"/>
    <rect x="${labelWidth}" width="${valueWidth}" height="20" fill="#4c1"/>
    <rect width="${totalWidth}" height="20" fill="url(#s)"/>
  </g>
  <g fill="#fff" text-anchor="middle" font-family="Verdana,Geneva,DejaVu Sans,sans-serif" font-size="11">
    <text x="${labelWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${label}</text>
    <text x="${labelWidth / 2}" y="14">${label}</text>
    <text x="${labelWidth + valueWidth / 2}" y="15" fill="#010101" fill-opacity=".3">${value}</text>
    <text x="${labelWidth + valueWidth / 2}" y="14">${value}</text>
  </g>
</svg>`;
}

// --- Robot pixel-art counter ---

// Each sprite: 9 wide x 13 tall, '#' = filled pixel
const ROBOT_SPRITES = [
  // 0: Standing neutral, ball antenna
  [
    "....#....",
    "...###...",
    "..#####..",
    "..#.#.#..",
    "..#####..",
    "...xxx...",
    ".##x#x##.",
    "##.x#x.##",
    "##.x#x.##",
    "..#xxx#..",
    "...#.#...",
    "...#.#...",
    "..##.##..",
  ],
  // 1: Spike antenna, right arm waving
  [
    "....#....",
    "....#....",
    "..#####..",
    "..#.#.#..",
    "..##.##.#",
    "...##x..#",
    ".####x##.",
    ".#.##x...",
    "#..##x...",
    "..###x#..",
    "...#.#...",
    "...#.#...",
    "..##.##..",
  ],
  // 2: V-antenna, both arms up
  [
    "#.....#..",
    ".#...#...",
    "..#####..",
    "..#.#.#..",
    "..#####..",
    "...xxx...",
    ".####x##.",
    "##.xxx.##",
    "...x##...",
    "..#xxx#..",
    "...#.#...",
    "...#.#...",
    "..##.##..",
  ],
  // 3: Triple prongs antenna
  [
    ".#.#.#...",
    ".#.#.#...",
    "..#####..",
    "..#.#.#..",
    "..#####..",
    "...xxx...",
    ".####x##.",
    "##.xxx.##",
    "##.##x.##",
    "..#xxx#..",
    "...#.#...",
    "...#.#...",
    "..##.##..",
  ],
  // 4: Square antenna, sitting down
  [
    "...###...",
    "...###...",
    "..#####..",
    "..#.#.#..",
    "..#####..",
    "...x#x...",
    ".##x#x##.",
    "##.xxx.##",
    "##.##x.##",
    "..###x#..",
    ".#######.",
    ".#.....#.",
    ".#######.",
  ],
  // 5: Star antenna, big eyes
  [
    "..#.#.#..",
    "...###...",
    "..#####..",
    ".##.#.##.",
    "..#####..",
    "...xxx...",
    ".##x####.",
    "##.xxx.##",
    "##.##x.##",
    "..#xxx#..",
    "...#.#...",
    "...#.#...",
    "..##.##..",
  ],
  // 6: Curved antenna, dancing (one leg kick)
  [
    "....#....",
    "...##....",
    "..#####..",
    "..#.#.#..",
    "..##.##..",
    "...xxx...",
    ".##x####.",
    ".#.xxx.#.",
    "#..x#x.#.",
    "..#xxx#..",
    "...#.#...",
    "...#..#..",
    "..##..##.",
  ],
  // 7: Lightning antenna, hand on hip
  [
    "...##....",
    "....#....",
    "..#####..",
    "..#.#.#..",
    "..#####..",
    "...xxx...",
    ".####x##.",
    ".#.##x#.#",
    ".#.##x#..",
    "..###x#..",
    "...#.#...",
    "...#.#...",
    "..##.##..",
  ],
  // 8: Wide body, big eyes
  [
    "....#....",
    "...###...",
    "..#####..",
    ".##.#.##.",
    "..#####..",
    "...xxx...",
    "###x#x###",
    "##.xxx.##",
    "##.x#x.##",
    ".##xxx##.",
    "..##.##..",
    "..#...#..",
    ".##...##.",
  ],
  // 9: Tall antenna, jumping (legs spread)
  [
    "....#....",
    "...###...",
    "....#....",
    "..#####..",
    "..#.#.#..",
    "..#####..",
    "...xxx...",
    ".##x#x##.",
    "##.xxx.##",
    "..###x#..",
    "...xxx...",
    "..#...#..",
    ".#.....#.",
  ],
];

const ROBOT_COLORS = [
  "#e58989",
  "#86d8d8",
  "#e2be88",
  "#86a6d6",
  "#cee088",
  "#ce84b0",
  "#98dd87",
  "#c285d1",
  "#87dba9",
  "#9585d3",
];

function renderRobotsSvg(count) {
  const digits = String(count).split("").map(Number);
  const px = 4;
  const spriteW = 9;
  const spriteH = 13;
  const gap = 2 * px;
  const robotW = spriteW * px;
  const totalW = digits.length * robotW + (digits.length - 1) * gap;
  const totalH = spriteH * px;

  let rects = "";
  for (let i = 0; i < digits.length; i++) {
    const digit = digits[i];
    const ox = i * (robotW + gap);
    const sprite = ROBOT_SPRITES[digit];
    const color = ROBOT_COLORS[digit];
    for (let y = 0; y < sprite.length; y++) {
      const row = sprite[y];
      for (let x = 0; x < row.length; x++) {
        const cell = row[x];
        if (cell === "#") {
          rects += `<rect x="${ox + x * px}" y="${y * px}" width="${px}" height="${px}" fill="${color}"/>`;
        } else if (cell === "x") {
          const subColor = ROBOT_COLORS[(digit + 1) % 10];
          rects += `<rect x="${ox + x * px}" y="${y * px}" width="${px}" height="${px}" fill="${subColor}"/>`;
        }
      }
    }
  }

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${totalW}" height="${totalH}">${rects}</svg>`;
}

// --- HTML page ---

const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>kawarimidoll</title>
<style>
body {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  margin: 0;
  font-family: sans-serif;
  text-align: center;
  color: #333;
}
a {
  color: #0969da;
  font-weight: bold;
}
</style>
</head>
<body>
<div>
<p>This site has moved.</p>
<p><a href="https://kawarimidoll.github.io">kawarimidoll.github.io</a></p>
</div>
</body>
</html>`;

// --- Server ---

const svgHeaders = {
  "content-type": "image/svg+xml",
  "cache-control": "no-cache, no-store, must-revalidate",
  "expires": "0",
  "pragma": "no-cache",
};

Deno.serve(async (req) => {
  const { pathname } = new URL(req.url);

  if (pathname === "/counter.svg") {
    const count = await getAndIncrement();
    return new Response(renderBadgeSvg(count), { headers: svgHeaders });
  }

  if (pathname === "/counter-robots.svg") {
    const count = await getAndIncrement();
    return new Response(renderRobotsSvg(count), { headers: svgHeaders });
  }

  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
});
