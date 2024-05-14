import { PlaywrightCrawler } from "crawlee";
import { Article } from "../../article/article.models";
import { Feed, FeedType } from "../feed.models";
import articleModule from "../../article/article.module";
import { Logger } from "../../../lib/logger/logger";

export class ElPaisFeeder implements Feed {
    title = "El País";
    url = "https://www.elpais.com";
    type:FeedType = "elpais";
    _id: string | undefined = undefined;
    aggregator = async() => {
        const crawler = new PlaywrightCrawler({
            requestHandler: async ({ page, request, enqueueLinks }) => {
                Logger.info("white", `Processing: ${request.url}`);
                    const scrappedArticles = page.locator('article');
                    for(let i=0;i<=4; i++){
                        const scrappedArticle = scrappedArticles.nth(i);
                        const header = scrappedArticle.locator("h2");
                        const url = await header.locator("a").getAttribute("href") as string;
                        const headline = await header.innerText();
                        const hasAuthor = await scrappedArticle.locator(".c_a").count();
                        const authorAndPlace = hasAuthor ? await scrappedArticle.locator(".c_a").innerText() : undefined;
                        const author = authorAndPlace? authorAndPlace.split("|")[0] : undefined;
                        const place = authorAndPlace? authorAndPlace.split("|")[1] : undefined;
                        const summary =  await scrappedArticle.locator("p").textContent() as string;
                        const date = Date.now().toLocaleString();
                        const feed = this._id;
                        if (feed){
                            const article: Article = { url , author, place, headline, summary, date, feed}
                            articleModule.service.create(article);
                        }
                        
                    }
            }
        });
    
        await crawler.run([this.url]);
    }
    

}