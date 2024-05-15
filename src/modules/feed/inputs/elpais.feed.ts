import { PlaywrightCrawler } from "crawlee";
import { Article, FeedCode } from "../../article/article.dto";
import { Feed } from "../feed.models";
import articleModule from "../../article/article.module";
import { Logger } from "../../../lib/logger/logger";
import { ObjectId } from "mongodb";

export class ElPaisFeeder implements Feed {
    title = "El País";
    url = "https://www.elpais.com";
    links :string[]= [];
    type:FeedCode = "elpais";
    _id: string | undefined = undefined;
    aggregator = async() => {
        const crawler = new PlaywrightCrawler({
            requestHandler: async ({ page, request, enqueueLinks }) => {
                Logger.info("blue", `Processing: ${request.url}`);
                    if (request.url == this.url){
                        const scrappedArticles = page.locator('article');
                        for(let i=0;i<=4; i++){
                            const scrappedArticle = scrappedArticles.nth(i);
                            const header = scrappedArticle.locator("h2");
                            const url = await header.locator("a").getAttribute("href") as string;
                            this.links.push(url);
                            crawler.addRequests([url]);
    
                        }
                    } else {
                        const all = page.locator("article");
                        const header = all.locator("header");
                        const headline = await header.locator("h1").innerText();
                        const summary = await header.locator("h2").innerText();
                        const content = await all.locator("div.a_c").allTextContents();
                        const image = await header.locator("span.a_m_w img").getAttribute("src");
                        const author = await all.locator(".a_md .a_md_txt .a_md_a a").innerText();
                        const place = (await (all.locator(".a_md .a_md_txt .a_md_f").innerText())).split("-")[0];
                        const date = await all.locator(".a_md .a_md_txt .a_md_f span time").getAttribute("datetime");
                        const feed = this.type;
                        const article : Article = { headline , summary, content , image:image || "", author, place, date:date || "", url:request.url, feed };
                        console.log(article);
                        
                    }
                    Logger.info("blue", "Processing links: ", this.links)                
            }
        }); 
        await crawler.run([this.url]);
    }
}
const elPaisFeeder = new ElPaisFeeder();
export default elPaisFeeder;