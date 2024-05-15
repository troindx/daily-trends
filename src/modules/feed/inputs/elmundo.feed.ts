import { PlaywrightCrawler } from "crawlee";
import { Article, FeedCode } from "../../article/article.dto";
import { Feed } from "../feed.models";
import articleModule from "../../article/article.module";
import { Logger } from "../../../lib/logger/logger";

export class ElMundoFeeder implements Feed {
    title = "El Mundo";
    url = "https://www.elmundo.es";
    links :string[]= [];
    type:FeedCode = "elmundo";
    _id: string | undefined = undefined;
    aggregator = async() => {
        const crawler = new PlaywrightCrawler({
            requestHandler: async ({ page, request, enqueueLinks }) => {
                Logger.info("white", `Processing: ${request.url}`);
                    if (request.url == this.url){
                        const scrappedArticles = page.locator('article');
                        for(let i=0;i<=4; i++){
                            const scrappedArticle = scrappedArticles.nth(i);
                            const header = scrappedArticle.locator("header");
                            const headline = await header.locator("h2").innerText();
                            const url = await header.locator(".ue-c-cover-content__link").getAttribute("href") as string;
                            this.links.push(url);
                            crawler.addRequests([url]);   
                        }
                    } else {
                        const header = page.locator(".ue-l-article .ue-l-article__header-content");
                        const body = page.locator(".ue-l-article .ue-l-article__body");
                        const headline = await header.locator("h1").innerText() || await header.locator("h2").innerText();
                        const summary = await header.locator(".ue-c-article__standfirst").innerText();
                        const content = await page.locator(".ue-c-article__body").allTextContents();
                        const image = await page.locator(".ue-c-article__image").getAttribute("src");
                        const author = await body.locator(".ue-c-article__author-name-item a").innerText();
                        const place = await body.locator(".ue-c-article__author-name-item span").innerText();
                        const date = await page.locator(".ue-c-article__bar-footer time").getAttribute("datetime");
                        const feed = this.type;
                        const article : Article = { headline , summary, content, image:image || "", author, place, date:date || "", url:request.url, feed };
                        console.log(article);
                        
                    }
                    console.log(this.links);
                    
            }
        });
        await crawler.run([this.url]);
    }
}
const elMundoFeeder = new ElMundoFeeder();
export default elMundoFeeder;