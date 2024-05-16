import { PlaywrightCrawler } from "crawlee";
import { Article, FeedCode } from "../../article/article.dto";
import { Feed } from "../feed.dto";
import { Logger } from "../../../lib/logger/logger";
import appConfig from "../../../app.config";

export class ElPaisFeeder implements Feed {
    title = "El País";
    url = "https://www.elpais.com";
    links :string[]= [];
    articles: Article[] = [];
    type:FeedCode = "elpais";
    _id: string | undefined = undefined;
    aggregator = async() => {
        const crawler = new PlaywrightCrawler({
            requestHandler: async ({ page, request, enqueueLinks }) => {
                Logger.info("blue", `Processing: ${request.url}`);
                    if (request.url == this.url){
                        const scrappedArticles = page.locator('article');
                        for(let i=0;i<appConfig.CRAWL_ARTICLES; i++){
                            const scrappedArticle = scrappedArticles.nth(i);
                            const header = scrappedArticle.locator("h2");
                            const url = await header.locator("a").getAttribute("href").catch() as string;
                            this.links.push(url);
                            crawler.addRequests([url]);
                        } Logger.info("blue", "Processing links: ", this.links)
                    } else {
                        const all = page.locator("article");
                        const header = all.locator("header");
                        const headline = await header.locator("h1").nth(0).innerText().catch();
                        const summary = await header.locator("h2").nth(0).innerText().catch();
                        const content = await all.locator("div.a_c").allTextContents().catch();
                        const imageLocator = header.locator("span.a_m_w img");
                        let image
                        if (await imageLocator.count())
                            image = await header.locator("span.a_m_w img").getAttribute("src").catch();
                        else{
                            image = await header.locator("a.posicionador img").getAttribute("src").catch();
                        }
                        const author = await all.locator(".a_md .a_md_txt .a_md_a a").nth(0).innerText().catch();
                        const place = (await (all.locator(".a_md .a_md_txt .a_md_f").innerText()).catch()).split("-")[0];
                        const date = await all.locator(".a_md .a_md_txt .a_md_f span time").getAttribute("datetime").catch();
                        const feed = this.type;
                        const article : Article = { headline , summary, content , image:image || "", author, place, date:date || "", url:request.url, feed };
                        this.articles.push(article);
                        
                    }                
            }
        }); 
        await crawler.run([this.url]);
    }
}
const elPaisFeeder = new ElPaisFeeder();
export default elPaisFeeder;