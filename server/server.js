import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import Shopify, { ApiVersion } from "@shopify/shopify-api";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import { route } from "next/dist/next-server/server/router";
import { receiveWebhook } from "@shopify/koa-shopify-webhooks";
const bodyparser = require("koa-bodyparser");
// const Router1 = require("@koa/Router");
// const route = new Router1({ prefix: "/products1" });

dotenv.config();

const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();

Shopify.Context.initialize({
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(","),
  HOST_NAME: process.env.HOST.replace(/https:\/\//, ""),
  API_VERSION: "2021-07",
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
});

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {};
app.prepare().then(async () => {
  const server = new Koa();
  const router = new Router();
  server.keys = [Shopify.Context.API_SECRET_KEY];

  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify;
        const host = ctx.query.host;
        ACTIVE_SHOPIFY_SHOPS[shop] = scope;

        const response = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: `/${host}/webhooks/product/create`,
          topic: "PRODUCTS_CREATE",
          webhookHandler: async (topic, shop, body) =>
            delete ACTIVE_SHOPIFY_SHOPS[shop],
        });

        if (!response.success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${response.result}`
          );
        } else {
          console.log("register product create successfully");
        }
        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`);
      },
    })
  );

  const webhook = receiveWebhook({ secret: process.env.SHOPIFY_API_SECRET });

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  };

  router.post("/webhooks/product/create", webhook, async (ctx) => {
    console.log("recive webhook");

    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res);
      console.log(`Webhook processed, returned status code 200`);
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`);
    }
  });

  router.post(
    "/graphql",
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res);
    }
  );

  router.get("/products/:id", async (ctx) => {
    const id = ctx.params.id;
    console.log(id);
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    // Create a new client for the specified shop.
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    // Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.
    const products = await client.get({
      path: `products/${id}`,
    });
    ctx.body = products;
    ctx.status = 200;
    console.log(ctx.body.products);
  });
  router.delete("/products/:id", async (ctx) => {
    const id = ctx.params.id;
    console.log(id);
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    // Create a new client for the specified shop.
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    // Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.
    const products = await client.delete({
      path: `products/${id}`,
    });
    ctx.body = products;
    ctx.status = 200;
    console.log(ctx.body.products);
  });
  router.put("/products/:id", async (ctx) => {
    const id = ctx.params.id;
    console.log(id);
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    // Create a new client for the specified shop.
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    // Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.
    const data = ctx.request.body;
    const products = await client.put({
      path: `products/${id}`,
      data: { product: data },
      type: DataType.JSON,
    });
    ctx.body = products;
    ctx.status = 200;
    console.log(ctx.body.products);
  });

  router.get("/products", async (ctx) => {
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    // Create a new client for the specified shop.
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    // Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.

    const products = await client.get({
      path: "products",
    });
    ctx.body = products;
    ctx.status = 200;
  });

  router.get("/webhook", async (ctx) => {
    const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
    // Create a new client for the specified shop.
    const client = new Shopify.Clients.Rest(session.shop, session.accessToken);
    // Use `client.get` to request the specified Shopify REST API endpoint, in this case `products`.

    const products = await client.get({
      path: "webhooks",
    });
    ctx.body = products;
    ctx.status = 200;
  });

  router.get(`/insta`, async (ctx) => {
    console.log("shop", ctx.query.shop);
  });

  router.get("(/_next/static/.*)", handleRequest); // Static content is clear
  router.get("/_next/webpack-hmr", handleRequest); // Webpack content is clear

  router.get("(.*)", async (ctx) => {
    const shop = ctx.query.shop;

    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`);
    } else {
      await handleRequest(ctx);
      const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res);
      console.log(session.accessToken);
      ctx.body = "Hello";
    }

    console.log(ctx);
  });
  server.use(bodyparser());
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
