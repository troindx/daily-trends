//System and Default
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv, { DotenvConfigOutput } from 'dotenv';

export class App{
  app: express.Application = express();
  config: DotenvConfigOutput = dotenv.config();
  uid: string | undefined = undefined;
  private server;

  getUuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  startupConfig(){
    this.app.use(express.json({limit: '540kb'}));
    this.app.use(cors({
      credentials: true,
      preflightContinue: true,
      exposedHeaders: ['Token', 'user_id'],
      allowedHeaders: 'Token, content-type, user_id'
    }));
    this.app.options('*', (req, res) => {res.json({status: 'OK'});});

    if (this.config.error)
    {
      this.uid = this.getUuidv4();
      console.log("[NTF]Error while retrieving .env file");
    }
    else{
      this.uid = process.env.UID;
    }
  }
 

  constructor(){
    this.startupConfig();
    this.loadRoutes();
    this.server = this.app.listen(1984, function () {
      console.log('[NTF] App listening on port 1984!');
    });
  }

  loadRoutes(){
    //set all routes
    //this.app.post('/auth/login', this.authController.loginValidator, this.authController.login);
    //this.app.get('/auth/logout', this.authController.logout);

    //this.app.put('/users/:id/update', [UserController.updateUserValidator, TokenService.checkToken], UserController.update);
    //this.app.post('/users/:id/delete', [UserController.deleteUserValidator, TokenService.checkToken], UserController.erase);
    this.app.get('/', function (req:Request, res:Response) {
      return res.status(200).json({ status: 200, message: "Everything seems to be working fine!" });

    });
  }

  close(){
    this.server.close();
  }
}

export const app = new App()






