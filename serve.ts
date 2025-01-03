const BASE_PATH = "./build";

const server = Bun.serve({
  port: 9999,
  async fetch(req) {
    const filePath = BASE_PATH + new URL(req.url).pathname;
    const file = Bun.file(filePath);
    return new Response(file);
  },
  error() {
    return new Response(null, { status: 404 });
  },
});

console.log(`Listening on ${server.url}`);
