import { z } from 'zod';
const FeedType = z.enum(["elpais", "elmundo"]);

export const FeedSchema = z.object({
    title: z.string(),
    url : z.string().url(),
    type : FeedType,
    aggregator: z.function(z.tuple([]), z.promise(z.boolean()))
});

export type Feed = z.infer<typeof FeedSchema>;

export const ArticleSchema = z.object({
    url: z.string().url(),
    author : z.string().or(z.undefined()),
    place : z.string().or(z.undefined()),
    headline : z.string(),
    summary : z.string(),
    date: z.string().datetime()
})

export type Article = z.infer<typeof ArticleSchema>

