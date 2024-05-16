import { z } from 'zod';
import { ArticleSchema, FeedCodeSchema } from '../article/article.dto';
import {NextFunction, Request} from 'express';


export const FeedSchema = z.object({
    title: z.string(),
    url : z.string().url(),
    type : FeedCodeSchema,
    aggregator: z.function(z.tuple([]), z.promise(z.void())),
    articles: z.array(ArticleSchema).optional()
});

export type Feed = z.infer<typeof FeedSchema>;
export const typeParamsValidator= (req:Request, res: Response, next: NextFunction) => {
    FeedCodeSchema.parse(req.params.type);
    next();
}