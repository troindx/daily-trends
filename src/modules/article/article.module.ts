
import { Logger } from "../../lib/logger/logger";
import { BaseModule } from "../base.module";
import { Article } from "./article.models";
import ArticleService from "./article.service";


export class ArticleModule implements BaseModule<Article>{
    service = new ArticleService();
    hasInitialized = false;

    async init(){
        try {
            await this.service.init();
            this.hasInitialized = true;
        } catch (error) {
            Logger.error("red","Error when initializing Article Module: ", error) 
        } 
    }

    async end(){
        if (this.hasInitialized)
            await this.service.end();
    }
}
const articleModule = new ArticleModule();
export default articleModule;