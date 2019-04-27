const Koa = require("koa");
const KoaRouter = require("koa-router");
const json = require("koa-json");
const path = require("path");
const bodyParser = require("koa-bodyparser");
var auth = require('koa-basic-auth');
// const koaBetterBody = require('koa-better-body');
const jwt = require('koa-jwt');

// Utilizing Koa EJS:
const render = require("koa-ejs");

// Declare Koa App:
const app = new Koa();
const router = new KoaRouter();

// Auth: Will utilize bcrypt for auth demo:
const bcrypt = require('bcrypt');
const password = "password1234";
//This is what the authentication would be checked against
const hashed_password = "$2b$10$XdRov6qQqPHIAtnHroKzge4dEAEQ6tk1cH3zUozm4YHpjFYkezKyC"
const credentials = { name: 'testUser', pass: 'password1234' }
const checkUser = "testUser";
const checkPass = "password1234";

// Replace with db:
var results = [];
const mathProbs = ["2+2"];

// app.use(koaBetterBody({fields: 'body'}));
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
// router.post("/auth", checkAuth);

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

// Check Auth:
// TESTING GROUNDS:----------------------

// app.
// async function checkAuth(ctx) {
//     await ctx.render("auth", {
        

//     });
// };


// Failed...  Generators deprecated...
// async function checkAuth(ctx) {
//     //Error handling middleware
//     app.use(function *(next){
//         try {
//         yield next;
//         } catch (err) {
//         if (401 == err.status) {
//             this.status = 401;
//             this.set('WWW-Authenticate', 'Basic');
//             this.body = 'You have no access here';
//         } else {
//             throw err;
//         }
//         }
//     });
    
//     // Set up authentication here as first middleware. 
//     // This returns an error if user is not authenticated.
//     router.get('/auth', auth(credentials), function *(){
//         this.body = 'Access Granted!';
//         yield next;
//     });
    
//     // No authentication middleware present here.
//     router.get('/unprotected', function*(next){
//         this.body = "Anyone can access this area";
//         yield next;
//     });
// };

// ENDTESTING GROUNDS:----------------------// TESTING GROUNDS:----------------------



 // Auth / bcrypt: ------------------------------
// async function checkAuth(ctx) {
//     const body = ctx.request.body;
//     const username = body.username;
//     const password = body.password;
//     bcrypt.compare(password, hashed_password)
//     .then(result => {
//         console.log("True or False: Was your password correct?");
//         console.log(result);

//     })
//     .catch(error => {
//         console.log(error);
//     })
//     ctx.redirect("/");
// };



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
            return ctx.body = {result: result}
        case "-":
            console.log("Subtraction Operator");
            result = valueOne - valueTwo;
            console.log("Result is: ", result);
            return ctx.body = {result: result}
        case "*":
            console.log("Multiplication Operator");
            result = valueOne * valueTwo;
            console.log("Result is: ", result);
            return ctx.body = {result: result}
        case "/":
            console.log("Division Operator");
            result = valueOne / valueTwo;
            console.log("Result is: ", result);
            ctx.body = {result: result}
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