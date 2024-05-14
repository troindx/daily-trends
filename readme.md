### Daily Trends Scrapper.
Installation: To install you must have nodejs installed. Project has been created using node v22.
Remember to copy the .env.dist file into the .env file  and modify the environment variables there to match your setup
```
npm install
cp .env.dist .env
npx playwright install 
```
## Development environment
This repo uses docker for containers and for testing purposes. You must have docker installed. Then
```
docker compose up
```
Will launch the development environment you need in order for the framework to work properly

# Starting the application
```
npm start
```
With all of the services defined in docker compose up and running this dev environment should work for testing.
The project only relies on an internet connection (for scrapping) and a mongo database, so if you don't have Docker installed, please install it because it's about time, but you can also run a mongo db in your own host or using cloud db atlas.

# Modules and configuration
 Configuration file is loaded from .env file and available via process.env and via app.config  for all the modules to reuse.

Modules are to be stored in the modules folder, and follow the base.module.ts interface for them to be loaded correctly.
Modules (and services) must have an init() async function that is used to connect asynchronusly to any 3rd party data mechanism before the application is spin up.