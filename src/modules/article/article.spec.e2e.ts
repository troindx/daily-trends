import { ObjectId } from "mongodb";
import app from "../../app";
import { Article, FeedCodeSchema } from "./article.dto";
import { faker } from '@faker-js/faker';
import request from 'supertest';

const article1 : Article = {
    url: faker.internet.url(),
    author : faker.person.fullName(),
    place : faker.location.country(),
    headline : faker.lorem.sentence(),
    summary : faker.lorem.lines(),
    date: faker.date.recent().toISOString(),
    feed: "elpais",
    image : faker.internet.url(),
}
const objectIdExample = new ObjectId().toString();
describe("Article module e2e Test", () => {
    beforeAll( async() => {
        await app.init()
    });

    it("POST /Article with no body returns 400 bad request", async() => {
        const response = await request(app.server).post("/article")
        .send();
        expect(response.status).toBe(400);
    });

    it("POST /Article with no id returns 200 and article", async() => {;
        const response = await request(app.server).post("/article")
        .send(article1);
        expect(response.status).toBe(200);
        expect(response.body._id).toBeTruthy();
        article1._id = response.body._id;
    });

    it("POST /Article with id returns 400 and bad request", async() => {;
        const response = await request(app.server).post("/article")
        .send(article1);
        expect(response.status).toBe(400);
    });

    it("PUT /Article/:id with no body returns 400 malformed", async() => {
        const response = await request(app.server).put(`/article/${objectIdExample}`)
        .send();
        expect(response.status).toBe(400);
    });

    it("PUT /Article/:id with inexistent id  , 404", async() => {
        const response = await request(app.server).put(`/article/${objectIdExample}`)
        .send(article1);
        expect(response.status).toBe(404);
    });

    it("PUT /Article/:id with body returns 200 ok", async() => {
        article1.author ="Juan Vilar";
        const response = await request(app.server).put(`/article/${article1._id}`)
        .send(article1);
        expect(response.status).toBe(200);
        expect(response.body.author).toEqual(article1.author);
        expect(response.body._id).toEqual(article1._id);
    });

    it("GET /Article/:id with wrong id returns 404 not found", async() => {
        const response = await request(app.server).get(`/article/${objectIdExample}`)
        .send();
        expect(response.status).toBe(404);
    });
    it("GET /Article/:id with malformed id returns 400 ", async() => {
        const response = await request(app.server).get(`/article/34902i`)
        .send();
        expect(response.status).toBe(400);
    });
    it("GET /Article/:id  returns 400 ok", async() => {
        const response = await request(app.server).get(`/article/${article1._id}`)
        .send();
        expect(response.status).toBe(200);
    });

    it("DELETE /Article/:id with no correct id returns 400 malformed", async() => {
        const response = await request(app.server).delete(`/article/sidsjis`)
        .send();
        expect(response.status).toBe(400);
    });

    it("DELETE /Article/:id with wrong id returns 404 not found", async() => {
        const response = await request(app.server).delete(`/article/${objectIdExample}`)
        .send();
        expect(response.status).toBe(404);
    });

    it("DELETE /Article/:id with wrong id returns 200 ", async() => {
        const response = await request(app.server).delete(`/article/${article1._id}`)
        .send();
        expect(response.status).toBe(200);
    });

    afterAll(async()=>{
        await app.end();
    });
});