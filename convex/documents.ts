import { v } from "convex/values";

import { mutation, query } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";
//* get all documents function
export const get = query({
  handler: async (ctx) => {
    //* check if user is authenticated
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("User not Authenticated");
    //* query all documents and return it
    const documents = await ctx.db.query("documents").collect();
    return documents;
  },
});

//* to use it for the list of documents
export const getSidebar = query({
  args: {
    parentDocument: v.optional(v.id('documents'))
  },
  handler: async (ctx, args) => {
    //*Checks if Authenticated
    const identity = await ctx.auth.getUserIdentity()
    if (!identity) throw new Error("Authentication Failed")
    //* Get user Id if true
    const userId = identity.subject;
    //* Appropriate data (child documents by parent)
    const documents = ctx.db
      .query('documents')
      .withIndex('by_user_parent', q =>
        q
          .eq('userId', userId)
          .eq('parentDocument', args.parentDocument))
      .filter(q => q.eq(q.field('isArchieved'), false))
      .order('desc')
      .collect()
    return documents;
  }
})

//* create note function 
export const create = mutation({
  args: {
    title: v.string(),
    parentDocument: v.optional(v.id('documents')),
  },
  //* ctx == context containing useful database related objects
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity)
      //* temporary soln
      throw new Error("Not Authorized");

    const userId = identity.subject;

    const document = await ctx.db.insert("documents", {
      title: args.title,
      parentDocument: args.parentDocument,
      userId,
      isArchieved: false,
      isPublished: false
    });
    return document;
  },
});
