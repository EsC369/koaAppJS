const Koa = require("koa");
const KoaRouter = require("koa-router");
const json = require("koa-json");
const path = require("path");
const bodyParser = require("koa-bodyparser");

//Utilizing Koa EJS:
const render = require("koa-ejs");

const app = new Koa();
const router = new KoaRouter();

// Replace with db
const things = ["My family", "Programming", "Music"]

// Outputs in Json foramatting:
app.use(json());

// Body Parser middleware:
app.use(bodyParser());

// Add additional properties to context:
app.context.user = "Ryan Smith";

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

// Routes:
router.get("/", index);
router.get("/add", showAdd);
router.post("/add", add);

// List of things:
async function index(ctx) {
    await ctx.render("index", {
        title: "Things I Love:",
        things: things
    });
};

// Show add page:
async function showAdd(ctx) {
    await ctx.render("add");
};

// Add Thing:
async function add(ctx) {
    const body = ctx.request.body;
    things.push(body.thing);
    ctx.redirect("/");
};
///-----------------

router.get("/test", ctx => (ctx.body = `Hello ${ctx.user}`));
router.get("/test2/:name", ctx => (ctx.body = `Hello ${ctx.params.name} `));

// Router middleware:
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log("server Started... "));