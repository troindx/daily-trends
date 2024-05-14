import { z } from 'zod';
import mongoose from 'mongoose';
import { ArticleSchema } from '../article/article.models';
import { ObjectId } from 'mongodb';
const FeedTypeSchema = z.enum(["elpais", "elmundo"]);
export type FeedType = z.infer<typeof FeedTypeSchema>;

const ObjectIdSchema = z.string().refine((value: string) => {
    try {
        new ObjectId(value);
        return true;
    } catch {
        return false;
    }
}, 'Not a valid MongoDB ObjectID');


export const FeedSchema = z.object({
    title: z.string(),
    _id : ObjectIdSchema.optional(),
    url : z.string().url(),
    type : FeedTypeSchema,
    aggregator: z.function(z.tuple([]), z.promise(z.void())).optional(),
    articles: z.array(ArticleSchema).optional()
});

export type Feed = z.infer<typeof FeedSchema>;

export const FeedDbSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String, enum: ["elpais", "elmundo"], required: true }, 
    articles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }]
});

export const FeedDocument = mongoose.model('Feed', FeedDbSchema);
export type DbFeed = typeof FeedDocument<Feed>;

