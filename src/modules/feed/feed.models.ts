import { z } from 'zod';
import mongoose from 'mongoose';
import { ArticleSchema } from '../article/article.models';
const FeedType = z.enum(["elpais", "elmundo"]);

export const FeedSchema = z.object({
    title: z.string(),
    url : z.string().url(),
    type : FeedType,
    aggregator: z.function(z.tuple([]), z.promise(z.boolean())).optional(),
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

