# KOA

Created by the same folks as express the syntax is largely the same. However, where express takes res and req as a parameter KOA will take a context. a context is an object from which both responses and requests can be called. 

Koa is lightweight, it does not come with a router, json formatter, templates or the ability to parse the body of a response. It does have an an entire ecosystem of related packages that can be used to fold those pieces of functionality into an api. i.e. koa-router, koa-json, koa-ejs, etc.

The big difference between these JS examples and Java APIs is that everything is built into a singular file. Middleware, business logic, routes and DB call can all be placed fairly sussinctly in a file. This is not remotely practical for real world applicaiton. Breaking these features up into separate files and making them look like a real api is the next and most valuable exercise. 

Note the convention to call the Koa object app. app.use, therefore, is reserved for packages or other objects that 'app' (KOA) uses to complete the task of creating this api. app is referenced with the ocntext call which adds a env variable to the app and in the render since it is the app that is being rendered by means of koas architecture. Routes and functions on the other hand call ctx (context).

app.use(router.routes().....) router.routes is simply telling koa-router to use the routes that have been created or called in this file. 
.use(router.allowedMethods()) is indecating that all RESTful methods are permitted.

Note on line 53 how a request is interacted with. ctx.request.body;

templating using koa-ejs is very similar to many opinionated templating frameworks
<%= %>
<%- %>

index.html shows how looping and dymanic values are handled.
