
import { Logger } from "../../lib/logger/logger";
import { BaseModule, Initiable } from "../base.module";
import DbService from "./db.service";


export class DbModule implements BaseModule<any>, Initiable{
    service = new DbService();
    hasInitialized = false;

    async init(){
        if (this.hasInitialized) return;
        try {
            await this.service.init();
            this.hasInitialized = true;
        } catch (error) {
            Logger.error("red","Error when initializing Db Module: ", error) 
        } 
    }

    async end(){
        if (this.hasInitialized){
            await this.service.end();
            this.hasInitialized = false;
        }
    }
}
const dbModule = new DbModule();
export default dbModule;