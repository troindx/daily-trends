import {  PlaywrightCrawler } from 'crawlee';
import { Article } from './src/modules/article/article.dto';
import { Logger } from './src/lib/logger/logger';
import { ObjectId } from 'mongodb';
//DEPRECATED
const links: string[] = [];
async function testCrawler(){
    
    const crawler = new PlaywrightCrawler({
        requestHandler: async ({ page, request, enqueueLinks }) => {
            console.log(`Processing: ${request.url}`);
                if (request.url == "https://www.elpais.com"){
                    const scrappedArticles = page.locator('article');
                    for(let i=0;i<=4; i++){
                        const scrappedArticle = scrappedArticles.nth(i);
                        const header = scrappedArticle.locator("h2");
                        const url = await header.locator("a").getAttribute("href") as string;
                        links.push(url);
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
                    const feed = "elpais";
                    const article : Article = { headline , summary, content , image:image || "", author, place, date:date || "", url:request.url, feed };
                    console.log(article);
                    
                }
                console.log(links);
            
        }
    });

    await crawler.run(['https://www.elpais.com']);
}

testCrawler();
