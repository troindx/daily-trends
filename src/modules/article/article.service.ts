import config from "../../app.config";
import { Article, ArticleDocument, FeedCode } from "./article.dto";
import { NotFoundException } from "../../lib/error/error.handler";
import { BaseService } from "../base.module";


export default class ArticleService implements BaseService<Article>{
    constructor(){

    }
    async create(a: Article) : Promise<Article>{
        const doc = new ArticleDocument<Article>(a);
        await doc.save();
        return doc.toObject() as Article;
    }

    async read(id:string) : Promise<Article>{
        const article = await ArticleDocument.findById(id);
        if (!article) {
            throw new NotFoundException("Article not found");
        } else {
            return article;
        } 
    }

    async update( changes:Article) : Promise<Article>{
        const updatedArticle = await ArticleDocument.findByIdAndUpdate(changes._id, changes, { new: true });
        if (!updatedArticle) {
            throw new NotFoundException("Article not found");
        } else {
            return updatedArticle.toObject() as Article;
        }
    }
    async delete(id: string):Promise<Article> {
        const deletedArticle = await ArticleDocument.findByIdAndDelete(id);
        if (!deletedArticle) {
            throw new NotFoundException("Article not found");
        } else {
            return deletedArticle.toObject() as Article
        }
    }

    async findMany(page = 1, pageSize = 10):Promise<Article[]> {
        const skip = (page - 1) * pageSize;
        const items = await ArticleDocument.find().skip(skip).limit(pageSize);
        return items;
    }

    async findByFeed(feed: FeedCode, options= {page:1, pageSize:config.DEFAULT_PAGE_SIZE}): Promise<Article[]> {
        const skip = (options.page - 1) * options.pageSize;
        return await ArticleDocument.find({ feed }).skip(skip).limit(options.pageSize);
    }

    async findAndUpdate(articleData: Article): Promise<Article> {
        const existingArticle = await ArticleDocument.findOne({ url: articleData.url });  
        if (existingArticle) {
            existingArticle.set(articleData);
            return await existingArticle.save();
        } else {
            const newArticle = new ArticleDocument(articleData);
            return await newArticle.save();
        }
    }

    async replaceOrCreateByURL(article: Article): Promise<Article> {
        let existingArticle = await ArticleDocument.findOne({ url: article.url });

        if (existingArticle) {
            // If article exists, update it with the new article data
            existingArticle.set(article);
            existingArticle = await existingArticle.save();
            return existingArticle;
        } else {
            // If article doesn't exist, create a new one
            const newArticle = await ArticleDocument.create(article);
            return newArticle;
        }
    }
}