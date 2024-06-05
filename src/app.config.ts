import dotenv from 'dotenv';
import { z } from 'zod';


export const appConfigSchema = z.object({
    DEFAULT_PORT: z.preprocess((val) => parseInt(val as string), z.number()),
    MONGODB_DATABASE_NAME: z.string(),
    MONGODB_ROOT_USERNAME: z.string(),
    MONGODB_ROOT_PWD: z.string(),
    MONGODB_HOST : z.string(),
    MONGODB_PORT : z.preprocess((val) => parseInt(val as string), z.number()),
    MONGO_TEST_USER: z.string(),
    MONGO_TEST_PASSWORD: z.string(),
    DEFAULT_PAGE_SIZE:  z.preprocess((val) => parseInt(val as string), z.number()),
    CRAWL_ARTICLES:  z.preprocess((val) => parseInt(val as string), z.number()),
});
export type AppConfig = z.infer<typeof appConfigSchema>;

const config = dotenv.config()
const parsed = appConfigSchema.parse(config.parsed);
if (config.error)
    throw config.error;
export default parsed ;
