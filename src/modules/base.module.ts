export interface BaseController{
}

export interface BaseModule<T> {
    controller?: BaseController;
    service?: T extends BaseService<infer U> ? BaseService<U> | ExtendedService : ExtendedService;
    init : () => Promise<void>,
    hasInitialized: boolean;
}

export interface ExtendedService{
    init :() => Promise<void>;
}

export interface BaseService<T> {
    create : (item: T) => Promise<T>,
    read : (id:string) => Promise<T>,
    update : (changes:T) => Promise<T>,
    delete : (id: string)=> Promise<T>,
    init : () => Promise<void>,
    findMany:(page:number, pageSize:number)=>Promise<T[]>
}