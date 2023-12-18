---
isDraft: true
title: Building Pump Factory's Gym App (Part 2)
excerpt: "I continue my build by defining my models and outlining my schema."
slug: building-pump-factorys-gym-app-part-2
publishDate: 2023-11-03
author: AndyP
tags: [Web Development, NodeJS, JavaScript, GraphQL, JWT]
sortOrder: 2
---

# Building Pump Factory's Gym Application (Part 2)

This is a continuation of the Pump Factory App build process. Here, we take a closer look at our Mongoose models as well as our GraphQL schema...

<br/>
<br/>

## Our Mongoose Models

We first draft how our initial models would look. We currently have two: the customer model (called *Client*) and our package model (called *Product*):

```javascript
// clientModel.js
import mongoose from "mongoose";

const ClientSchema = new mongoose.Schema({
    name: { type: String },
    email: { type: String },
    phone: { type: String },
    birthdate: { type: Date },
    age: { type: Number },
    membershipStatus: { type: String, enum: ["active", "inactive"] },
    waiver: { type: Boolean },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' }
}, { timestamps: true });

export default mongoose.model('Client', ClientSchema);

// productModel.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: { type: String },
    description: { type: String },
    price: { type: Number },
}, { timestamps: true });

export default mongoose.model('Product', ProductSchema);
```
The code above is pretty self-explanatory; the client data should have their names, emails, birthdates, etc. The same goes for the product data.

## GraphQL Schema
We begin by defining our primary schema types here.

```javascript

import { GraphQLObjectType, GraphQLID, GraphQLEnumType, GraphQLString, GraphQLBoolean, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull, Kind, GraphQLScalarType } from 'graphql';
const DateType = new GraphQLScalarType({
    name: 'Date',
    description: 'Custom date scalar type',
    parseValue(value) {
        if (typeof value === 'number') {
            return new Date(value)}
        throw new Error('GraphQL Date Scalar parser expected a `number`')},
    serialize(value) {
        if (value instanceof Date) {
            const year = value.getFullYear();
            const month = String(value.getMonth() + 1).padStart(2, '0'); // Month is zero-based, so add 1 and pad with leading zero
            const day = String(value.getDate()).padStart(2, '0');
            return `${year}-${month}-${day}`;
        }
        throw new Error('Invalid Date value');
    },
    parseLiteral(ast) {
        if (ast.kind === Kind.STRING) {
            const dateParts = ast.value.split('-');
            if (dateParts.length === 3) {
                const year = dateParts[2];
                const month = dateParts[0];
                const day = dateParts[1];
                return `${year}-${month}-${day}`;
            }
        }
        throw new Error('Invalid Date literal');
    },
});
const MembershipStatusType = new GraphQLEnumType({
    name: 'MembershipStatus',
    values: {
        active: { value: 'active' },
        inactive: { value: 'inactive' }
    },
    defaultValue: 'inactive'
});
const ProductType = new GraphQLObjectType({
    name: 'Product',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        description: { type: GraphQLString},
        price: { type: GraphQLInt}
    })
})
const ClientType = new GraphQLObjectType({
    name: 'Client',
    fields: () => ({
        id: { type: GraphQLID},
        name: { type: GraphQLString},
        email: { type: GraphQLString},
        phone: { type: GraphQLString},
        birthdate: { type: DateType},
        age: {type: GraphQLInt},
        waiver: { type: GraphQLBoolean},
        membershipStatus: {
            type: MembershipStatusType, 
            resolve: async (parent) => {
                const product = await Product.findById(parent.productId);
                if (product) {
                    return 'active';
                }
                return 'inactive';
            },
        },
        product: {
            type: ProductType,
            resolve(parent, args) {
                return Product.findById(parent.productId)
            }
}})
})
```
<br/>
It's worth noting that Date type is a custom scalar type since it doesn't fall under the default types like String or Integer. We also reference our Product type in our client type.
<br/>
In part 3, we will define our queries and mutations.
<br/>
See you, friends!