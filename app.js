const Koa = require("koa");
const KoaRouter = require("koa-router");
const json = require("koa-json");
const path = require("path");

//Utilizing Koa EJS:
const render = require("koa-ejs");

const app = new Koa();
const router = new KoaRouter();

// Outputs in Json foramatting:
app.use(json());

// // Simple Middleware Example:
// app.use(async ctx => ctx.body = "Hello world");

// Rendering app:
render(app, {
    root: path.join(__dirname, "views"),
    layout: "layout",
    viewExt: "html",
    cach: false,
    debug: false
})

// Index:
router.get("/", async ctx => {
    await ctx.render("index");
})

router.get("/test", ctx => (ctx.body = "Hello test"));

// Router middleware:
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log("server Started... "));