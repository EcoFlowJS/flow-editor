import mount from "koa-mount";
import serve from "koa-static";
import koaRouter from "@koa/router";
import fs from "fs";
import { fileURLToPath } from "url";
import path from "path";

export default function (server) {
  const router = new koaRouter({ prefix: "/editor/flow" });
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  router.get("/(.*)", async (ctx, next) => {
    var html = fs.readFileSync(__dirname + "/dist/index.html");
    ctx.type = "html";
    ctx.body = html;
  });

  server.use(mount("/editor/flow", serve(__dirname + "/dist")));
  server.use(router.routes()).use(router.allowedMethods());
}
