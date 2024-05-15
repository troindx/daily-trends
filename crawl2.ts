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
                if (request.url == "https://www.elmundo.es"){
                    const scrappedArticles = page.locator('article');
                    for(let i=0;i<=4; i++){
                        const scrappedArticle = scrappedArticles.nth(i);
                        const header = scrappedArticle.locator("header");
                        const headline = await header.locator("h2").innerText();
                        const url = await header.locator(".ue-c-cover-content__link").getAttribute("href") as string;
                        links.push(url);
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
                    const feed = "elmundo";
                    const article : Article = { headline , summary, content, image:image || "", author, place, date:date || "", url:request.url, feed };
                    console.log(article);
                    
                }
                console.log(links);
                
        }
    });

    await crawler.run(['https://www.elmundo.es']);
}

testCrawler();
