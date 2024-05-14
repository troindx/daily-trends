//System and Default
import express, { Request, Response } from 'express';
import cors from 'cors';

import fs from 'fs';
import path from 'path';
import { BaseModule } from './modules/base.module';
import { errorHandler } from './lib/error/error.handler';
import config, { AppConfig } from './app.config';
import { Logger } from './lib/logger/logger';


export default class App{
  server: express.Application = express();
  private config : AppConfig = config;
  uid: string | undefined = undefined;
  modules: BaseModule<any>[] = [];

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

  start(){
    this.server.use(express.json({limit: '540kb'}));
    this.server.use(cors({
      credentials: true,
      preflightContinue: true,
      exposedHeaders: ['Token', 'user_id'],
      allowedHeaders: 'Token, content-type, user_id'
    }));
    this.server.options('*', (req, res) => {res.json({status: 'OK'});});
    this.server.use(errorHandler);
  }
 

  constructor(){
    Logger.log("yellow","Starting Daily Trends Application.")
    this.uid = process.env.UID;
    if (!this.config) throw new Error("Config not loaded properly. Set the .env file properly.")
    this.init();
    this.start();
  }

  private async initModules() : Promise<void> {
    for (let i = 0; i< this.modules.length; i++){
      await this.modules[i].init();
      Logger.log("magenta",this.modules[i].constructor.name, " has been initialized");
    }
  }
  private async init(): Promise<void> {
    const directoryPath = path.join(__dirname, 'modules');
    try {
      await this.loadModules(directoryPath);
      await this.initModules();
      this.loadRoutes();
      this.server.use(errorHandler);
      this.server.get('/health', (req:Request, res:Response) => {
        return res.status(200).json({ status: 200, message: "Everything seems to be working fine!" });
      });
      this.server.listen(this.config.DEFAULT_PORT,  () => {
        Logger.log("green", 'App listening on port: ', this.config.DEFAULT_PORT);
      });
    } catch (error) {
        console.error(error);
    }
    
  }

  loadRoutes(){
    //set all routes
    //this.server.post('/auth/login', this.authController.loginValidator, this.authController.login);
    //this.app.get('/auth/logout', this.authController.logout);
    //this.app.put('/users/:id/update', [UserController.updateUserValidator, TokenService.checkToken], UserController.update);
    //this.app.post('/users/:id/delete', [UserController.deleteUserValidator, TokenService.checkToken], UserController.erase);
  }

}

export const app = new App()






