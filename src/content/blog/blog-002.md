---
isDraft: false
title: Building Pump Factory's Gym App (part 1)
excerpt: "I decided to \"IKEA\" my way to building my gym's application. This is part 1... "
slug: building-pump-factorys-gym-app-part-1
publishDate: 2023-10-28
author: AndyP
tags: [Web Development, NodeJS, Javascript, GraphQL, Express]
sortOrder: 2
---

# Building Pump Factory's Gym Application
\
I recently started delving into GraphQL, and I figured what better way to learn it than implementing it directly in a project. The first idea that came to mind is to build Pump Factory's gym app with it.\
*this project is inspired by Brad Traversy's and Ben Awad's Youtube videos.*
<br/>
<br/>
## Project Overview and JS Technologies Used

The plan is to have an Express-GraphQL middleware that would handle the backend/authentication logic and use MongoDB Atlas as a database:
```bash
npm install express graphql express-graphql mongoose morgan helmet cors dotenv ansi-colors-es6 vhost
```
Let's not forget nodemon:
```bash
npm install -D nodemon
```
\
Let's go throgh some of them:\
**express-graphql** - the middleware I plan on using for my queries and mutations.\
**mongoose** - will handle our connection to MongoDB Atlas.\
**morgan** - logs traffic on our backend.\
**helmet** - helps set the HTTP headers being passed to and from our backend.\
**cors** - since I plan on separating the client side application.\
**dotenv** - will host all our environment variables.\
**vhost** - since I want to use a single domain for both the website and the app itself. This will enable us to use a subdomain in-app.\
**ansi-colors-es6** - adds ANSI colors to our terminal.\
**nodemon** - handles hot reload in dev mode.\
Since I will be using es-style module imports as well as deploying in Azure, so I added type: module and engine values as well:
```bash
{
  "name": "pumpfactory-app",
  "type": "module",
  "version": "1.0.0",
  "description": "Pump Factory's Management System",
  "main": "index.js",
  "engines": {
    "node": ">=18.0.0"
  },

```
<br/>

### 1. My index.js

Let's begin by setting our entry point and importing all the modules we need:
```bash
import express from "express";
import { graphqlHTTP } from "express-graphql";
import dotenv from "dotenv"; //see #2
import connectDB from './config/db.js'; //see #3
import ansi from '../node_modules/ansi-colors-es6/index.js';
import morgan from "morgan";
import helmet from "helmet";
import vhost from "vhost";

const port = process.env.PORT || 5000
dotenv.config()
const app = express()
connectDB()

app.use(morgan('common'));
app.use(helmet({ contentSecurityPolicy: (process.env.NODE_ENV === 'production') ? undefined : false }));
app.use(vhost('api.localhost', graphqlHTTP({
    schema,
    graphiql: process.env.NODE_ENV === 'development'
})))
app.listen(port, () => console.log(ansi.green.bold.underline(`server running on port ${port}`)));
```
<br/>

*note how different the import-style is as well as some other subtleties from CommonJS.*\
\
In the code above, I'm using port 5000. I'm also emphasizing our development environment for GraphiQL to work (this disables Graphiql access in the production environment). Same deal with Helmet in order for it not to error out during development.
<br/>
### 2. Setting our .env file
```bash
PORT=5000
NODE_ENV='development'
MONGO_URI='your-mongodb-uri-goes-here'
```
<br/>

### 3. Creating our Mongoose connection

```bash
import mongoose from "mongoose";
import ansi from '../../node_modules/ansi-colors-es6/index.js'
const connectDB = async () => {
const db = await mongoose.connect(process.env.MONGO_URI)
console.log(ansi.cyan.underline.bold(`MongoDB Connected: ${db.connection.host}`))
}
export default connectDB
```
<br/>
In the next part, we will create our Mongoose models as well as start coding our schema which is the core of this project.
<br/>
Stay tuned! 🦾