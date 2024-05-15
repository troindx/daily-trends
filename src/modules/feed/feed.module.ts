import articleModule from "../article/article.module";
import { BaseModule, Initiable } from "../base.module";
import { FeedController } from "./feed.controller";
import { FeedService } from "./feed.service";

export class FeedModule implements BaseModule<any>, Initiable{
    controller = new FeedController();
    service = new FeedService();
    hasInitialized = false;

    async init(){
        if (this.hasInitialized) return;
        await articleModule.init();
        this.hasInitialized = true;
    }

    async end(){
        if (this.hasInitialized){
            await articleModule.end();
            this.hasInitialized=false;
        }
    }
}
const feedModule = new FeedModule();
export default feedModule;