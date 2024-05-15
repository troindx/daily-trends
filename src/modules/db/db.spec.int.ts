import { DbModule } from "./db.module"

describe ("Db Integration test", ()=>{
    const module = new DbModule();
    it("Initializes properly", async() =>{
        await module.init();
        expect (module.hasInitialized).toBe(true);
    })

    it("ends properly", async() =>{
        await module.end();
        expect (module.hasInitialized).toBe(false);
    })
})