import mongoose from "mongoose";
import config from "../../app.config";
import { Article, ArticleDocument } from "./article.models";
import { Logger } from "../../lib/logger/logger";
import { InternalServerErrorException, NotFoundException } from "../../lib/error/error.handler";
import { BaseService } from "../base.module";


export default class ArticleService implements BaseService<Article>{
    private URI: string;
    private connection: mongoose.Connection | undefined;
    constructor(){
        const username = config.MONGO_TEST_USER;
        const password = config.MONGO_TEST_PASSWORD;
        const host = config.MONGODB_HOST;
        const port = config.MONGODB_PORT;
        const database = config.MONGODB_DATABASE_NAME;
        if (!username || ! password || ! host || !port || !database)
            throw new Error("Set MongoDB env variables in .env file.")
        const uri = `mongodb://${username}:${password}@${host}:${port}/${database}`;
        this.URI = uri;

    }

    async init(){
        Logger.info("white", "Connecting to mongo: ", this.URI);
        await mongoose.connect(this.URI);
        this.connection = mongoose.connection;
    }

    async end(){
        if (this.connection){
            Logger.info("white", "Ending mongo Connection");
            await this.connection?.close();
        }
    }

    async create(a: Article) : Promise<Article>{
        try {
            const doc = new ArticleDocument<Article>(a);
            await doc.save();
            return doc.toObject() as Article;
        } catch (error) {
            throw new InternalServerErrorException("Could not create Article", error)
        }
    }

    async read(id:string) : Promise<Article>{
        try {
            const article = await ArticleDocument.findById(id);
            if (!article) {
                throw new NotFoundException("Article not found");
            } else {
                return article;
            }
        } catch (error) {
            throw new InternalServerErrorException("Could not read Article", error);
        }
    }

    async update(changes:Article) : Promise<Article>{
        try {
            const updatedArticle = await ArticleDocument.findByIdAndUpdate(changes._id, changes, { new: true });
            if (!updatedArticle) {
                throw new NotFoundException("Article not found");
            } else {
               return updatedArticle.toObject() as Article;
            }
        } catch (error) {
            throw new InternalServerErrorException("Could not update Article", error);
        }
    }
    async delete(id: string):Promise<Article> {
        try {
            const deletedArticle = await ArticleDocument.findByIdAndDelete(id);
            if (!deletedArticle) {
                throw new NotFoundException("Article not found");
            } else {
                return deletedArticle.toObject() as Article
            }
        } catch (error) {
            throw new InternalServerErrorException("Could not delete article", error);
        }
    }

    async  findMany(page = 1, pageSize = 10):Promise<Article[]> {
        const skip = (page - 1) * pageSize;
        try {
            const items = await ArticleDocument.find().skip(skip).limit(pageSize);
            return items;
        } catch (error) {
            throw new InternalServerErrorException("Unable to find items", error);
        }
    }
    
}