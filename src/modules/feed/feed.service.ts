import { Article, FeedCode } from "../article/article.dto";
import articleModule from "../article/article.module";
import { ExtendedService } from "../base.module";
import { Feed } from "./feed.dto";
import elMundoFeeder from "./inputs/elmundo.feed";
import elPaisFeeder from "./inputs/elpais.feed";

export class FeedService implements ExtendedService{
    private crawlers : Feed[] = []
    constructor(){
        this.crawlers.push(elPaisFeeder);
        this.crawlers.push(elMundoFeeder);
    }
    async getAll(code?:FeedCode) {
        if (code)
            return await articleModule.service.findByFeed(code);
        else
            return await articleModule.service.findMany();
    }

    async crawl(code?:FeedCode) {
        let crawlers
        let crawledArticles:Article[] = [];
        if (code){
            crawlers = this.crawlers.filter(crawler =>{crawler.type === code});
        }else{
            crawlers = this.crawlers;
        }
        for (let i=0; i<crawlers.length;i++){
            const crawler = crawlers[i];
            await crawler.aggregator();
            if (crawler.articles){
                for (let j= 0; j< crawler.articles.length;j++){
                    const article = crawler.articles[j];
                    await articleModule.service.replaceOrCreateByURL(article)
                    crawledArticles.push(article);
                };
            }
        }
        return crawledArticles;
    }

}