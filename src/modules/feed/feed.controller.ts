
import { Request,Response, NextFunction } from "express";
import { Get } from "../../lib/routes/routes.handler";
import { Article, FeedCode } from "../article/article.dto";
import articleModule from "../article/article.module";
import { BaseController } from "../base.module";
import { paginationValidator, typeParamsValidator } from "./feed.dto";
import { Logger } from "../../lib/logger/logger";
import feedModule from "./feed.module";
import appConfig from "../../app.config";

export class FeedController implements BaseController{
    @Get("/feed/:type/", typeParamsValidator)
    async findByFeed(req: Request, res:Response, next: NextFunction){
        try {
            let page, pageSize;
            page = Number.parseInt(req.query.page as string);
            pageSize = Number.parseInt(req.query.pageSize as string)
            if(!page) page = 1;
            if(!pageSize) pageSize = appConfig.DEFAULT_PAGE_SIZE;
            const articles = await articleModule.service.findByFeed(req.params.type as FeedCode, { page, pageSize});
            return res.status(200).json(articles);
        } catch (error) {
            Logger.error("red",error);
            next(error);
        }
    }

    @Get("/feed/",paginationValidator)
    async getAll(req: Request, res:Response, next: NextFunction){
        try {
            let page, pageSize;
            page = Number.parseInt(req.query.page as string);
            pageSize = Number.parseInt(req.query.pageSize as string)
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
    async crawlByFeed(req: Request, res:Response, next: NextFunction){
        try {
            const articles = await feedModule.service.crawl(req.params.type as FeedCode);
            return res.status(200).json(articles);
        } catch (error) {
            Logger.error("red",error);
            next(error);
        }
    }

    @Get("/crawl/")
    async crawlAll(req: Request, res:Response, next: NextFunction){
        try {
            const articles = await feedModule.service.crawl();
            return res.status(200).json(articles);
        } catch (error) {
            Logger.error("red",error);
            next(error);
        }
    }
}