import { FeedCode } from "../article/article.dto";
import { ExtendedService } from "../base.module";
import elPaisFeeder from "./inputs/elpais.feed";

export class FeedService implements ExtendedService{
    async getAll(feed:FeedCode){
        elPaisFeeder
    }
}