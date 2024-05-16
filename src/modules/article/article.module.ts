
import { Logger } from "../../lib/logger/logger";
import { BaseModule, Initiable } from "../base.module";
import dbModule from "../db/db.module";
import { ArticleController } from "./article.controller";
import { Article } from "./article.dto";
import ArticleService from "./article.service";


export class ArticleModule implements BaseModule<Article>, Initiable{
    service = new ArticleService();
    controller = new ArticleController();
    hasInitialized = false;

    /**
     * @throws Error if it fails to initialize 
     */
    async init(){
        if (this.hasInitialized) return;
        try {
            await dbModule.init();
            this.hasInitialized = true;
        } catch (error) {
            Logger.error("red","Error when initializing Article Module: ", error) 
            throw error;
        } 
    }

    async end(){
        if (this.hasInitialized){
            await dbModule.end();
            this.hasInitialized = false;
        }

    }
}
const articleModule = new ArticleModule();
export default articleModule;