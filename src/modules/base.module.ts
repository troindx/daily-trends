export interface BaseController{
}

export interface BaseModule<T> {
    controller?: BaseController;
    service?: T extends BaseService<infer U> ? BaseService<U> : ExtendedService;
}

export interface ExtendedService{
}

export interface Initiable{
    init :() => Promise<void>;
    end : () => Promise<void>;
    hasInitialized: boolean;
}

export interface BaseService<T> {
    create : (item: T) => Promise<T>,
    read : (id:string) => Promise<T>,
    update : (changes:T) => Promise<T>,
    delete : (id: string)=> Promise<T>,
    findMany:(page:number, pageSize:number)=>Promise<T[]>
}