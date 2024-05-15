import { Article, FeedCodeSchema } from "./article.dto";
import { ArticleModule } from "./article.module";
import { faker } from '@faker-js/faker';

const article1 : Article = {
    url: faker.internet.url(),
    author : faker.person.fullName(),
    place : faker.location.country(),
    headline : faker.lorem.sentence(),
    summary : faker.lorem.lines(),
    date: faker.date.recent().toDateString(),
    feed: faker.helpers.arrayElement(FeedCodeSchema._def.values),
    image : faker.internet.url(),
}
let dbArticle : Article;

describe("Article Module Integration Test", () => {
    const module = new ArticleModule();
    const service = module.service;
    beforeAll( async() => {
        await module.init();
    });
    it("Module initializes with service", () => {
        expect(service).toBeTruthy()
        expect(module.hasInitialized).toBe(true);
    });
    it("Module creates an article", async () => {
        dbArticle = await service.create(article1);
        expect(dbArticle._id).toBeTruthy();
    });

    it("Module updates an article", async () => {
        dbArticle.author="Juan Vilar";
        const updatedArticle = await service.update(dbArticle);
        expect(updatedArticle._id).toBeTruthy();
        expect (updatedArticle._id).toEqual(dbArticle._id);
        expect(updatedArticle.author).toEqual("Juan Vilar");
    });
    it("Finds many articles (only one)", async () => {
        const manyArticles = await service.findMany();
        expect(manyArticles[0]._id).toBeTruthy();
        expect (manyArticles[0]._id).toEqual(dbArticle._id);
        expect(manyArticles[0].author).toEqual("Juan Vilar");
    });
    it("Finds by feed (only one)", async () => {
        const manyArticles = await service.findByFeed(article1.feed);
        expect(manyArticles[0]._id).toBeTruthy();
        expect (manyArticles[0]._id).toEqual(dbArticle._id);
        expect(manyArticles[0].author).toEqual("Juan Vilar");
    });

    it ("Module deletes article", async () => {
        if (!dbArticle._id) fail("Article introduced into database does not have _id")
        const deleted = await service.delete(dbArticle._id);
        expect(deleted).toBeTruthy();
        expect(deleted._id).toEqual(dbArticle._id);
    })

    afterAll(async()=>{
        module.end();
    });
});