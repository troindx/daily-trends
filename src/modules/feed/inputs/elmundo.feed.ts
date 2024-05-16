import { PlaywrightCrawler } from "crawlee";
import { Article, FeedCode } from "../../article/article.dto";
import { Feed } from "../feed.dto";
import { Logger } from "../../../lib/logger/logger";
import appConfig from "../../../app.config";

export class ElMundoFeeder implements Feed {
    title = "El Mundo";
    url = "https://www.elmundo.es";
    links :string[]= [];
    articles: Article[] = [];
    type:FeedCode = "elmundo";
    _id: string | undefined = undefined;

    aggregator = async() => {
        const crawler = new PlaywrightCrawler({
            requestHandler: async ({ page, request, enqueueLinks }) => {
                Logger.info("white", `Processing: ${request.url}`);
                    if (request.url == this.url){
                        const scrappedArticles = page.locator('article');
                        for(let i=0;i<appConfig.CRAWL_ARTICLES; i++){
                            const scrappedArticle = scrappedArticles.nth(i);
                            const header = scrappedArticle.locator("header");
                            const headline = await header.locator("h2").nth(0).innerText();
                            const url = await header.locator(".ue-c-cover-content__link").getAttribute("href") as string;
                            this.links.push(url);
                            crawler.addRequests([url]);   
                        }
                        Logger.info("blue", "Processing links: ", this.links)
                    } else {
                        const header = page.locator(".ue-l-article .ue-l-article__header-content");
                        const body = page.locator(".ue-l-article .ue-l-article__body");
                        const headline = await header.locator("h1").nth(0).innerText().catch() || await header.locator("h2").nth(0).innerText().catch();
                        const summary = await header.locator(".ue-c-article__standfirst").innerText().catch();
                        const content = await page.locator(".ue-c-article__body").allTextContents().catch();
                        const imageCount = await page.locator("img.ue-c-article__image").count().catch();
                        let image;
                        if (imageCount)
                            image = await page.locator("img.ue-c-article__image").getAttribute("src").catch();
                        else   
                            image = "";
                        const author = await body.locator(".ue-c-article__author-name-item").nth(0).innerText().catch();
                        const place = await body.locator(".ue-c-article__author-name-item span").nth(0).innerText().catch();
                        const date = await page.locator(".ue-c-article__bar-footer time").getAttribute("datetime").catch();
                        const feed = this.type;
                        const article : Article = { headline , summary, content, image:image || "", author, place, date:date || "", url:request.url, feed };
                        this.articles.push(article);              
                    }
                   
                    
            }
        });
        await crawler.run([this.url]);
    }
}
const elMundoFeeder = new ElMundoFeeder();
export default elMundoFeeder;