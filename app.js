const Koa = require("koa");
const KoaRouter = require("koa-router");
const json = require("koa-json");
const path = require("path");
const bodyParser = require("koa-bodyparser");

// Utilizing Koa EJS:
const render = require("koa-ejs");

// Declare Koa App:
const app = new Koa();
const router = new KoaRouter();

// Auth: Will utilize bcrypt for auth demo:
const bcrypt = require('bcrypt');
const password = "password1234";
// const saltRounds = 10;
// const myPlaintextPassword = 's0/\/\P4$$w0rD';
// const password = 'password1234';


// With no DB its futile..
const auth = require('koa-basic-auth');
//This is what the authentication would be checked against
const credentials = { name: 'testUser', pass: 'password1234' }

// Replace with db:
const hashedPass = []; 
const mathProbs = ["2+2"];

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
    cache: false,
    debug: false
})

// Routes: --------------
router.get("/", index);

// router.get("/", ctx => (ctx.body = "Hello World!"));
router.get("/show", showItems);
router.get("/add", showAdd);
router.post("/add", add);
router.get("/auth", showAuth);
router.post("/auth", checkAuth);

// Test routes while pulling params:
// router.get("/test", ctx => (ctx.body = `Hello ${ctx.user}`));
router.get("/test2/:name", ctx => (ctx.body = `Hello ${ctx.params.name} `));

//Renders-------
// Show Root:
async function index(ctx) {
    console.log("Hello World");
    await ctx.render("index", {
        title: "Root Message: ",
        body: "Hello World!"
    });
};

// // Auth Section: ---------------------
async function showAuth(ctx) {
    await ctx.render("auth", {
        title: "Auth Section:",
        body: "Enter Your Info!"
    });
};

// Add Problem:
async function checkAuth(ctx) {
    const body = ctx.request.body;
    // console.log(body);
    const username = body.username;
    // const password = body.password;
   
    // console.log(username);
    // console.log(password);

    // Hashing:
    bcrypt.hash(password, 10)
    .then(hashed_password => {
        console.log("hash:", hash)
        
    })
    .catch(error => {
        
    });

    // mathProbs.push(problem);
    ctx.redirect("/show");
};



// Math Section: ---------------------
// List of Problems:
async function showItems(ctx) {
    await ctx.render("showItems", {
        title: "Problems Submitted:",
        body: "Your results have been sent to the front end!",
        mathProbs: mathProbs
    });
};

// Show add page:
async function showAdd(ctx) {
    await ctx.render("add", {
        title: "Welcome to The math Section! ",
        body: "This Section allows you to do rudementary math operations!\n Please Enter your math problem Below! \n "
    });
};

// Add Problem:
async function add(ctx) {
    const body = ctx.request.body;
    const valueOne = parseInt(body.valueOne); // Converting string value to integer
    const operator = body.operator;
    const valueTwo = parseInt(body.valueTwo); // Converting string value to integer
    const problem = valueOne+operator+valueTwo;
    let result = 0;

    switch(operator){
        case "+":
            console.log("Addition Operator");
            result = valueOne + valueTwo;
            console.log("Result is: ", result);
            ctx.body = {result: result}
            break;
        case "-":
            console.log("Subtraction Operator");
            result = valueOne - valueTwo;
            console.log("Result is: ", result);
            ctx.body = {result: result}
            break;
        case "*":
            console.log("Multiplication Operator");
            result = valueOne * valueTwo;
            console.log("Result is: ", result);
            ctx.body = {result: result}
            break;
        case "/":
            console.log("Division Operator");
            result = valueOne / valueTwo;
            console.log("Result is: ", result);
            ctx.body = {result: result}
            break;
        default:
            console.log("Please Input Valid Operator");
    }
    mathProbs.push(problem);
    ctx.redirect("/show");
};
// End Renders-----------------

// Router middleware:
app.use(router.routes()).use(router.allowedMethods());

// App Listening/ports:
app.listen(3000, () => console.log("server Started... "));