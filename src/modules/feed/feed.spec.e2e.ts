import app from "../../app";
import request from 'supertest';
import { Article } from "../article/article.dto";

describe("Feed module e2e Test", () => {
    beforeAll( async() => {
        await app.init()
    });

    it("GET /crawl", async() => {
        const response = await request(app.server).get("/crawl")
        .send();
        expect(response.status).toBe(200);
    },50000);

    it("GET /feed/?page=1&pageSize=2", async() => {
        const response = await request(app.server).get("/feed/?page=1&pageSize=2")
        .send();
        expect(response.status).toBe(200);
        const results = response.body as Article[];
        expect(results.length).toEqual(2);
    });
    
    it("GET /feed/:type", async() => {
        const response = await request(app.server).get("/feed/elpais")
        .send();
        expect(response.status).toBe(200);
        const results = response.body as Article[];
        expect(results.length).toBeGreaterThan(1);
    });

    it("GET /feed/:type?page=1&pageSize=2", async() => {
        const response = await request(app.server).get("/feed/elpais/?page=1&pageSize=2")
        .send();
        expect(response.status).toBe(200);
        const results = response.body as Article[];
        expect(results.length).toBe(2);
    });
    
    afterAll( async() =>{
        await app.end();
    })
});