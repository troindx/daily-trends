import dotenv from 'dotenv';

export interface AppConfig {
    DEFAULT_PORT: number;
    MONGODB_DATABASE_NAME: string;
    MONGODB_ROOT_USERNAME: string;
    MONGODB_ROOT_PWD: string;
    MONGODB_HOST : string;
    MONGODB_PORT : number;
    MONGO_TEST_USER: string;
    MONGO_TEST_PASSWORD: string;
}

const config = dotenv.config()
if (config.error)
    throw config.error;
export default config.parsed as unknown as AppConfig;
