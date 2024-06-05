
import { Request,Response, NextFunction } from "express";
import { Get } from "../../lib/routes/routes.handler";
import { FeedCode } from "../article/article.dto";
import articleModule from "../article/article.module";
import { BaseController } from "../base.module";
import { paginationValidator, typeParamsValidator , PaginationSchema} from "./feed.dto";
import { Logger } from "../../lib/logger/logger";
import feedModule from "./feed.module";
import appConfig from "../../app.config";

interface FeedRequest extends Request {
    params: {
        type: FeedCode
    },
    query: {
        page : string,
        pageSize: string,
    }
}

export class FeedController implements BaseController{
    @Get("/feed/:type/", typeParamsValidator)
    async findByFeed(req: FeedRequest, res:Response, next: NextFunction){
        try {
            let page, pageSize;
            page = Number.parseInt(req.query.page);
            pageSize = Number.parseInt(req.query.pageSize)
            if(!page) page = 1;
            if(!pageSize) pageSize = appConfig.DEFAULT_PAGE_SIZE;
            const articles = await articleModule.service.findByFeed(req.params.type , { page, pageSize});
            return res.status(200).json(articles);
        } catch (error) {
            Logger.error("red",error);
            next(error);
        }
    }

    @Get("/feed/",paginationValidator)
    async getAll(req: FeedRequest, res:Response, next: NextFunction){
        try {
            let page, pageSize;
            page = Number.parseInt(req.query.page);
            pageSize = Number.parseInt(req.query.pageSize)
            if(!page) page = 1;
            if(!pageSize) pageSize = appConfig.DEFAULT_PAGE_SIZE;
            const articles = await articleModule.service.findMany(page,pageSize);
            return res.status(200).json(articles);
        } catch (error) {
            Logger.error("red",error);
            next(error);
        }
    }

    @Get("/crawl/:type", typeParamsValidator)
    async crawlByFeed(req: FeedRequest, res:Response, next: NextFunction){
        try {
            const articles = await feedModule.service.crawl(req.params.type);
            return res.status(200).json(articles);
        } catch (error) {
            Logger.error("red",error);
            next(error);
        }
    }

    @Get("/crawl/")
    async crawlAll(req: FeedRequest, res:Response, next: NextFunction){
        try {
            const articles = await feedModule.service.crawl();
            return res.status(200).json(articles);
        } catch (error) {
            Logger.error("red",error);
            next(error);
        }
    }
}