const Koa = require('koa');
const KoaRouter = require('koa-router')
const json = require('koa-json');
const path = require('path');
const render = require('koa-ejs');
// required for POSTS
const bodyParser = require('koa-bodyparser');

const app = new Koa();
const router = new KoaRouter();

// Replace With DB
const things = ['Shoes', 'Planes', 'Bobcats', 'Baguettes']

// Json Prettier Middleware 
app.use(json());
// body parser middleware
app.use(bodyParser());

// Add properties to context. This is used in the test path.
app.context.user = 'Ryan'
/*
Simple Middleware
app.use(async ctx => (ctx.body = {msg: 'Hello World'}));
if building an API a ton of JSON might go here
*/
render(app,{
    root: path.join(__dirname, 'views'),
    layout: 'layout',
    viewExt: 'html',
    cache: false,
    debug: false
})

//Routes
router.get('/', index)
router.get('/add', showAdd)
router.post('/add', add)

//List of things. Index function called in router.get above
async function index(ctx) {
    await ctx.render('index', {
        title: 'Things that are and have been',
        things: things
    });
}

async function showAdd(ctx) {
    await ctx.render('add');
}

async function add(ctx) {
    const body = ctx.request.body;
    // why is it body.thing? becuase thing is the name we gave the input in the html file!!
    things.push(body.thing);
    ctx.redirect('/');
}

/*
Original index route
creating routes seperately and then creating a method for each route is advisable as seen above.
router.get('/', async ctx => {
    await ctx.render('index', {
        title: 'Things that are and have been',
        things: things
    });
})
*/
router.get('/test', ctx => (ctx.body = `Hello ${ctx.user}`));
//parameters in the URL
router.get('/testmore/:name', ctx => (ctx.body = `Hello ${ctx.params.name}`));

// Router Middleware
app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log('server started...'))