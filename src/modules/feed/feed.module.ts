import { BaseModule } from "../base.module";
import { FeedController } from "./feed.controller";
import { FeedService } from "./feed.service";

export class FeedModule implements BaseModule<any>{
    controller = new FeedController();
    service = new FeedService();
    hasInitialized = false;

    async init(){
        await this.service.init();
        this.hasInitialized = true;
    }
}
const feedModule = new FeedModule();
export default feedModule;