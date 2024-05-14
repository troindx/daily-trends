import {  PlaywrightCrawler } from 'crawlee';
import { Article } from './src/modules/article/article.models';

async function testCrawler(){
    const crawler = new PlaywrightCrawler({
        requestHandler: async ({ page, request, enqueueLinks }) => {
            console.log(`Processing: ${request.url}`);
                const scrappedArticles = page.locator('article');
                for(let i=0;i<=4; i++){
                    const scrappedArticle = scrappedArticles.nth(i);
                    console.log(await scrappedArticle.innerHTML());
                    const header = scrappedArticle.locator("header");
                    const headline = await header.locator("h2").innerText();
                    const url = await header.locator(".ue-c-cover-content__link").getAttribute("href") as string;                    const hasAuthor = await scrappedArticle.locator(".c_a").count();
                    const authorAndPlace = hasAuthor ? await scrappedArticle.locator(".c_a").innerText() : undefined;
                    const author = authorAndPlace? authorAndPlace.split("|")[0] : undefined;
                    const place = authorAndPlace? authorAndPlace.split("|")[1] : undefined;
                    const summary =  await scrappedArticle.locator("p").textContent() as string;
                    const date = Date.now().toLocaleString();
                    const feed ="temporal";
                    const article: Article = { url , author, place, headline, summary, date, feed}*/
                }
        }
    });

    await crawler.run(['https://www.elmundo.es']);
}

testCrawler();
