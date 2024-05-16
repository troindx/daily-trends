# Daily Trends Scrapper.
Installation: To install you must have nodejs installed. Project has been created using node v22.
Remember to copy the .env.dist file into the .env file  and modify the environment variables there to match your setup
```
npm install
cp .env.dist .env
npx playwright install 
npm run build
```
## Development environment
This repo uses docker for containers and for testing purposes. You must have docker installed. Then
```
docker compose up
```
Will launch the development environment you need in order for the framework to work properly

## Starting the application
```
npm start
```
With all of the services defined in docker compose up and running this dev environment should work for testing.
The project only relies on an internet connection (for scrapping) and a mongo database, so if you don't have Docker installed, please install it because it's about time, but you can also run a mongo db in your own host or using mongo db atlas.

### Dev environment - Docker compose with both nodes
Make sure that if you run this for production, you change the .env file to fit your needs. env.dist should connect you to a default setting but this is for testing and dev purposes only

```
docker compose -f ./full.docker-compose.yml up -d
```

# Usage
first call the endpoint via /crawl to crawl the news
then /feed to read the news
/feed/<elmundo | elpais> to get each of the news from each of the newspapers

## Testing
Integration tests and e2e tests require development environment.
```
npm test //Launches all tests. requires development environment
npm test:e2e //e2e tests. launches dev environment automatically
npm test:unit
npm test:int //Integration tests. launches dev environment automatically
```

### Testing with nodemon
You can run tests individually with dev mode so that they restart every time you change a file.
```
npm dev:test:e2e 
npm dev:test:int
```

### Modules and configuration
Configuration file is loaded from .env file and available via process.env and via app.config  for all the modules to reuse.
Modules are to be stored in the modules folder, and follow the base.module.ts interface for them to be loaded correctly.
Modules (and services) must have an init() async function that is used to connect asynchronusly to any 3rd party data mechanism before the application is spin up.