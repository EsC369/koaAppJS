const Koa = require("koa");
const KoaRouter = require("koa-router");
const json = require("koa-json");
const path = require("path");
const bodyParser = require("koa-bodyparser");
var session = require('koa-session');

// Utilizing Koa EJS:
const render = require("koa-ejs");

// Declare Koa App:
const app = new Koa();
const router = new KoaRouter();

// Koa-Session:
app.keys = ['its a secret!'];
const CONFIG = {
    key: 'koa:sess',
    maxAge: 8000,
    autoCommit: true,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
  };
app.use(session(CONFIG, app));  // Include the session middleware

// Auth: Will utilize bcrypt for auth demo:
const bcrypt = require('bcrypt');
//This is what the authentication would be checked against
const hashed_password = "$2b$10$XdRov6qQqPHIAtnHroKzge4dEAEQ6tk1cH3zUozm4YHpjFYkezKyC"; // Hashed from password1234

// Replace with db:
const users =[{ "username": "testUser" }];
const mathProbs = ["2+2"];

// Outputs in Json foramatting:
app.use(json());

// Body Parser middleware:
app.use(bodyParser());

// Add additional properties to context:
app.context.user = "Ryan Smith";

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
router.get("/show", showItems);
router.get("/add", showAdd);
router.post("/add", add);
router.get("/auth", showAuth);
router.post("/auth", checkAuth);
router.get("/success", success);

// Renders And Functions: ---------
async function resetSess(ctx) {
    // Reset session:
    ctx.session = {};
}

// Show Root:
async function index(ctx) {
    await resetSess(ctx);
    console.log("Hello World");
    await ctx.render("index", {
        title: "Root Message: ",
        body: "Hello World!"
    });
};

// // Auth Section: ---------------------
async function showAuth(ctx) {
    // Reset session:
    await resetSess(ctx);
    await ctx.render("auth", {
        title: "Auth Section:",
        body: "Enter Your Info!"
    });
};

// Check Auth:
async function checkAuth(ctx, next) {
    // Reset session:
    await resetSess(ctx);
    const body = ctx.request.body;
    const username = body.username;
    const password = body.password;

    // User check
    const desiredUser = users[0].username;
    const currentUser = username;
    if (desiredUser === currentUser){
        console.log("User Exists!")
        // Bcrypt:
        const correct = await bcrypt.compare(password, hashed_password);
        if (correct) {
        ctx.status = 200;
        ctx.body = 'success';

        // Create Koa session:
        ctx.session.userinfo = 1;

        // // Redirect
        ctx.redirect("/success");
        }
        else {
        ctx.status = 401;
        ctx.body = {
            errors:['wrong credentials']
        }
        console.log("Password Invalid!")
        ctx.redirect("/auth")
        }
    }
    else {
        console.log("User doesnt exist!")
        ctx.redirect("/auth");
    }
  };

  // Success page checks for valid session:
async function success(ctx) {
    userSess = ctx.session.userinfo;
    if(userSess > 0){
        console.log("Session Verified");
    }
    else{
        console.log("Failed Session Check");
        ctx.redirect("/auth");
    }

    await ctx.render("success", {
        title: "Access Granted!",
        body: "You are in the secured zone!",
    });
}// End Auth Section------------------

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
            mathProbs.push(problem);
            console.log("Result is: ", result);
            return ctx.body = {result: result}
        case "-":
            console.log("Subtraction Operator");
            result = valueOne - valueTwo;
            mathProbs.push(problem);
            console.log("Result is: ", result);
            return ctx.body = {result: result}
        case "*":
            console.log("Multiplication Operator");
            result = valueOne * valueTwo;
            mathProbs.push(problem);
            console.log("Result is: ", result);
            return ctx.body = {result: result}
        case "/":
            console.log("Division Operator");
            result = valueOne / valueTwo;
            mathProbs.push(problem);
            console.log("Result is: ", result);
            ctx.body = {result: result}
        default:
            console.log("Please Input Valid Operator");
    }
    ctx.redirect("/show");
};
// End Renders-----------------

// Router middleware:
app.use(router.routes()).use(router.allowedMethods());

// App Listening/ports:
const port = 3000;
app.listen(port, () => console.log("Server Started on port:", port));