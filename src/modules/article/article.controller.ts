import { Logger } from "../../lib/logger/logger";
import { Delete, Get, Post, Put } from "../../lib/routes/routes.handler";
import { BaseController } from "../base.module";
import { Article, createValidator, idParamsValidator, updateValidator } from "./article.dto";
import articleModule from "./article.module";
import { NextFunction, Request, Response } from "express";

interface ArticleRequest extends Request {
    body : Article;
}

export class ArticleController implements BaseController{

    @Post("/article", createValidator)
    async create(req: ArticleRequest, res:Response, next: NextFunction){
        try {
            const article = req.body;
            const created = await articleModule.service.create(article);
            return res.status(200).json( created );
        } catch (error) {
            Logger.error("red",error);
            next(error);
        }
    }

    @Get("/article/:id", idParamsValidator)
    async get(req: Request, res:Response, next:NextFunction){
        try {
            const id = req.params.id;
            const article = await articleModule.service.read(id);
            return res.status(200).json( article );
        } catch (error) {
            Logger.error("red",error);
            next(error);
        }
        
    }

    @Put("/article/:id", updateValidator)
    async update(req: ArticleRequest, res:Response, next:NextFunction){
        try {
            const article = req.body;
            article._id = req.params.id;
            const updated = await articleModule.service.update(article);
            return res.status(200).json( updated );
        } catch (error) {
            Logger.error("red",error);
            next(error);
        }
    }

    @Delete("/article/:id", idParamsValidator)
    async delete(req: Request, res:Response, next:NextFunction){
        try {
            const deleted = await articleModule.service.delete(req.params.id);
            return res.status(200).json( deleted );
        } catch (error) {
            Logger.error("red",error);
            next(error);
        }
    
    }
}