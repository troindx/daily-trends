import app from "../../app";
import request from 'supertest';
import { Article } from "../article/article.dto";

describe("Feed module e2e Test", () => {
    beforeAll( async() => {
        await app.init()
    },700000);

    it("GET /feed", async() => {
        const response = await request(app.server).get("/feed")
        .send();
        expect(response.status).toBe(200);
        const results = response.body as Article[];
        expect(results.length).toEqual(10);
    },700000);

    it("GET /crawl", async() => {
        const response = await request(app.server).get("/crawl")
        .send();
        expect(response.status).toBe(200);
    },700000);
    
    it("GET /feed/:type", async() => {
        const response = await request(app.server).get("/feed/elpais")
        .send();
        expect(response.status).toBe(200);
        const results = response.body as Article[];
        expect(results.length).toBeGreaterThan(1);
    },700000);
    
    afterAll( async() =>{
        await app.end();
    })
});