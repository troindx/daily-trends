//System and Default
import express, { Request, Response } from 'express';
import cors from 'cors';

import fs from 'fs';
import path from 'path';
import { BaseModule, Initiable } from './modules/base.module';
import { validationErrorHandler } from './lib/error/error.handler';
import config, { AppConfig } from './app.config';
import { Logger } from './lib/logger/logger';
import { initializeRoutes } from './lib/routes/routes.handler';
import { IncomingMessage, Server, ServerResponse } from 'http';
import bodyParser from 'body-parser';


export class App implements Initiable{
  server: express.Application = express();
  private loadRoutes = initializeRoutes;
  private config : AppConfig = config;
  uid: string | undefined = undefined;
  modules:  BaseModule<any>[] = [];
  hasInitialized: boolean = false;
  private endPoint:Server<typeof IncomingMessage, typeof ServerResponse> | undefined;

  private async loadModules(directoryPath: string): Promise<void> {
    
    const files = await fs.promises.readdir(directoryPath);
    
    for (const file of files) {
        const filePath = path.join(directoryPath, file);
        const stats = await fs.promises.stat(filePath);
        
        if (stats.isDirectory()) {
            // Recursively explore subdirectories
            await this.loadModules(filePath);
        } else if (file.endsWith('.module.ts')) {
            // Load the module
            const module = await import(filePath);
            const instance = module.default as BaseModule<any>
            if (instance){
              this.modules.push(instance);
              Logger.log("blue",instance.constructor.name, " has been loaded");
            }
        }
    }
  }

  constructor(){
    Logger.log("yellow","Starting Daily Trends Application.")
    this.uid = process.env.UID;
    if (!this.config) throw new Error("Config not loaded properly. Set the .env file properly.")
    this.server.use(bodyParser.json());
    this.server.use(cors({
      credentials: true,
      preflightContinue: true,
      exposedHeaders: ['Token', 'user_id'],
      allowedHeaders: 'Token, content-type, user_id'
    }));
    this.server.options('*', (req, res) => {res.json({status: 'OK'});});
  }

  private async initModules() : Promise<void> {
    if (this.hasInitialized) return;
    for (let i = 0; i< this.modules.length; i++){
      const module = this.modules[i] as Initiable
      if (typeof module.init !== "undefined"){
        await module.init();
        Logger.log("magenta",this.modules[i].constructor.name, " has been initialized");
      }
      const controller = this.modules[i].controller;
      if (controller){
        Logger.info("white", `Routes for ${controller.constructor.name}`)
        this.loadRoutes(this.server, controller);
      }
    }
  }

  /** 
   * @throws error if problem on listening
   */
  start(){
    if (this.hasInitialized) return;
    try {
      this.server.get('/health', (req:Request, res:Response) => {
        return res.status(200).json({ status: 200, message: "Everything seems to be working fine!" });
      });
      this.endPoint=this.server.listen(this.config.DEFAULT_PORT,  () => {
        Logger.log("green", 'App listening on port: ', this.config.DEFAULT_PORT);
      });
    } catch (error) {
      Logger.error("red", error);
      throw error;
    }
  }
    

  private async endModules() : Promise<void> {
    for (let i = 0; i< this.modules.length; i++){
      const module = this.modules[i] as Initiable
      if (typeof module.end !== "undefined"){
        await module.end();
        Logger.log("blue",this.modules[i].constructor.name, " has ended");
      }    
    }
  }

  async init(): Promise<void> {
    if (this.hasInitialized) return;
    try {
      const directoryPath = path.join(__dirname, 'modules');
      await this.loadModules(directoryPath);
      await this.initModules();
      this.server.use(validationErrorHandler);
      this.start();
      this.hasInitialized=true;
    } catch (error) {
        console.error(error);
        throw error;
    }
  }

  async end() : Promise<void>{
    if (!this.hasInitialized) return;
    try {
      await this.endModules();
      if (this.endPoint)
        this.endPoint.close(()=> {
          Logger.info("green", "Endpoint stopped listening");
      });
      this.hasInitialized=false;
    } catch (error) {
      Logger.error("red", error);
      throw error;
    }
  }
}

const app = new App()
export default app;






