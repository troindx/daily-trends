import { BaseModule } from "../base.module";
import { FeedController } from "./feed.controller";
import { FeedService } from "./feed.service.";

export class FeedModule implements BaseModule{
    controller = new FeedController();
    service = new FeedService();
}