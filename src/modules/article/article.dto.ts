import { NextFunction } from "express";
import mongoose from "mongoose";
import { z } from "zod"
export const FeedCodeSchema = z.enum(["elpais", "elmundo"]);
export type FeedCode = z.infer<typeof FeedCodeSchema>;
import { Request } from "express";

export const ArticleSchema = z.object({
    _id : z.string().or(z.undefined()),
    url: z.string().url(),
    author : z.string().or(z.undefined()),
    place : z.string().or(z.undefined()),
    headline : z.string().optional(),
    summary : z.string().optional(),
    content : z.array(z.string()).optional(),
    feed : FeedCodeSchema,
    date: z.string().datetime(),
    image: z.string().optional()
});
const IdentifiedSchema = z.object({
    _id : z.string()
}).passthrough();
const UnidentifiedSchema = z.object({
    _id : z.undefined()
}).passthrough();

export type Article = z.infer<typeof ArticleSchema>
export type SearchableArticle = Article & z.infer<typeof IdentifiedSchema>

export const ArticleDbSchema = new mongoose.Schema<Article>({
    url: { type: String, required: true },
    author: String,
    place: String,
    content: [String],
    image: String,
    feed : { type: String, enum: Object.values(FeedCodeSchema.Values) },
    headline: { type: String, required: true },
    summary: { type: String, required: true },
    date: { type: String, required: true },
});

// Define a model based on the schema
export const ArticleDocument = mongoose.model<Article>('Article', ArticleDbSchema);
export type DbArticle = typeof ArticleDocument<Article>;

const ObjectIdSchema = z.string().refine(value => /^[0-9a-fA-F]{24}$/.test(value), {
    message: 'ID is not of valid format'
});

export const createValidator= (req:Request, res: Response, next: NextFunction) => {
    ArticleSchema.and(UnidentifiedSchema).parse(req.body);
    next();
}

export const idParamsValidator= (req:Request, res: Response, next: NextFunction) => {
    ObjectIdSchema.parse(req.params.id);
    next();
}
export const updateValidator= (req:Request, res: Response, next: NextFunction) => {
    ObjectIdSchema.parse(req.params.id);
    ArticleSchema.and(IdentifiedSchema).parse(req.body);
    next();
}
