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

Deno.serve(() => new Response(html, {
  headers: { "content-type": "text/html; charset=utf-8" },
}));
