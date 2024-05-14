import { Article } from "./article.models";
import { ArticleModule } from "./article.module";
import { faker } from '@faker-js/faker';

const article1 : Article = {
    url: faker.internet.url(),
    author : faker.person.fullName(),
    place : faker.location.country(),
    headline : faker.lorem.sentence(),
    summary : faker.lorem.lines(),
    date: faker.date.recent().toDateString(),
    feed: faker.database.mongodbObjectId()
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