import { App, app } from "../app";

export interface BaseController{

}

export interface BaseModule{
    controller: BaseController,
    service: BaseService,
}

export interface BaseService {

}