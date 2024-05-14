import { Application } from 'express';
import 'reflect-metadata'; // Import the polyfill
import { BaseController } from '../../modules/base.module';
import { Logger } from '../logger/logger';

// Define a metadata key for storing route information
const ROUTE_METADATA_KEY = Symbol('route');

// Decorator factory for @Get decorator
export function Get(route: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(ROUTE_METADATA_KEY, { method: 'get', route }, target, propertyKey);
    };
}

// Decorator factory for @Post decorator
export function Post(route: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        Reflect.defineMetadata(ROUTE_METADATA_KEY, { method: 'post', route }, target, propertyKey);
    };
}

// Function to initialize routes based on decorators
export function initializeRoutes(app: Application, controller: BaseController) {
    const prototype = Object.getPrototypeOf(controller);
    const methods = Object.getOwnPropertyNames(prototype);

    methods.forEach(methodName => {
        const routeInfo = Reflect.getMetadata(ROUTE_METADATA_KEY, prototype, methodName);
        if (routeInfo) {
            const { method, route } = routeInfo;
            const handler = prototype[methodName].bind(controller);
            app[method as 'get' | 'post'](route, handler);
            Logger.info("green", method," - ", route ," route has been loaded.");
        }
    });
}