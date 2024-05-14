import mongoose from "mongoose";
import { z } from "zod"

export const ArticleSchema = z.object({
    _id : z.string().or(z.undefined()),
    url: z.string().url(),
    author : z.string().or(z.undefined()),
    place : z.string().or(z.undefined()),
    headline : z.string(),
    summary : z.string(),
    feed : z.string(),
    date: z.string().datetime()
})

export type Article = z.infer<typeof ArticleSchema>

export const ArticleDbSchema = new mongoose.Schema<Article>({
    url: { type: String, required: true },
    author: String,
    place: String,
    headline: { type: String, required: true },
    summary: { type: String, required: true },
    date: { type: String, required: true },
    feed: { type: String, ref: 'Feed' }
});

// Define a model based on the schema
export const ArticleDocument = mongoose.model<Article>('Article', ArticleDbSchema);
export type DbArticle = typeof ArticleDocument<Article>;