import { Application, NextFunction, Request, Response } from 'express';
import 'reflect-metadata';
import { BaseController } from '../../modules/base.module';
import { Logger } from '../logger/logger';

// Define a metadata key for storing route information
const ROUTE_METADATA_KEY = Symbol('route');

// Define types for route information
interface RouteInfo {
    method: 'get' | 'post' | 'delete' | 'put';
    route: string;
    validator?: (req:Request, res: Response, next: NextFunction) => void;
}

// Decorator factory for @Get decorator
export function Get(route: string, validator?:Function) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(ROUTE_METADATA_KEY, { method: 'get', route, validator }, target, propertyKey);
    };
}

// Decorator factory for @Post decorator
export function Post(route: string, validator:Function) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(ROUTE_METADATA_KEY, { method: 'post', route, validator }, target, propertyKey);
    };
}

// Decorator factory for @Delete decorator
export function Delete(route: string, validator?:Function) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(ROUTE_METADATA_KEY, { method: 'delete', route, validator }, target, propertyKey);
    };
}

// Decorator factory for @Put decorator
export function Put(route: string, validator?:Function) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(ROUTE_METADATA_KEY, { method: 'put', route, validator }, target, propertyKey);
    };
}

// Function to initialize routes based on decorators
export const  initializeRoutes = (app: Application, controller: BaseController) => {
    const prototype = Object.getPrototypeOf(controller);
    const methods = Object.getOwnPropertyNames(prototype);

    methods.forEach(methodName => {
        const routeInfo: RouteInfo = Reflect.getMetadata(ROUTE_METADATA_KEY, prototype, methodName);
        if (routeInfo) {
            const { method, route, validator } = routeInfo;
            const handler = prototype[methodName].bind(controller);
            if (validator){
                switch(method) {
                    case "get":
                        app.get(route,validator,handler);
                        break;
                    case "post":
                        app.post(route,validator,handler);
                        break;
                    case "delete":
                        app.delete(route,validator,handler);
                    case "put":
                        app.put(route,validator,handler);
                }
            }
            else{
                switch(method) {
                    case "get":
                        app.get(route,handler);
                        break;
                    case "post":
                        app.post(route,handler);
                        break;
                    case "delete":
                        app.delete(route,handler);
                    case "put":
                        app.put(route,handler);
                }
            }
            Logger.info("green", method, " - ", route);
        }
    });
}
