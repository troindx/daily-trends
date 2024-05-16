import mongoose from "mongoose";
import config from "../../app.config";
import { Logger } from "../../lib/logger/logger";
import { ExtendedService, Initiable } from "../base.module";
import { InternalServerErrorException } from "../../lib/error/error.handler";


export default class DbService implements ExtendedService, Initiable{
    private URI: string;
    private connection: mongoose.Connection | undefined;
    hasInitialized = false;

    /**
     * @throws InternalServerErrorException if .env not set
     */
    constructor(){
        const username = config.MONGO_TEST_USER;
        const password = config.MONGO_TEST_PASSWORD;
        const host = config.MONGODB_HOST;
        const port = config.MONGODB_PORT;
        const database = config.MONGODB_DATABASE_NAME;
        if (!username || ! password || ! host || !port || !database)
            throw new InternalServerErrorException("Set MongoDB env variables in .env file.")
        const uri = `mongodb://${username}:${password}@${host}:${port}/${database}`;
        this.URI = uri;

    }

    /**
     * @throws InternalServerErrorException 
     */
    async init(){
        if (this.hasInitialized) return;
        try {
            Logger.info("white", "Connecting to mongo.");
            await mongoose.connect(this.URI);
            this.connection = mongoose.connection;
            this.hasInitialized = true;
            Logger.info("green", "Mongo Connection successful!");
        } catch (error) {
            Logger.error("red",error);
            throw new InternalServerErrorException("Error while initializing mongo");
        }
    }

    async end(){
        if (!this.hasInitialized) return;
        if (this.connection){
            Logger.info("white", "Ending mongo Connection");
            await this.connection?.close();
            this.hasInitialized = false;
            Logger.info("white", "Connection to mongo endeds");
        }
    }
}