# Kore Labs Technical Test

This is a basic technical test for potential Kore developers.

This has been designed to provide an insight into the type of projects you'll be working on day to day. Nothing in here has been done to deliberately catch you out.

This repo contains a [Turborepo](https://turbo.build/repo) monorepo using pnpm housing a [Nest](https://nestjs.com) api and an [Angular](https://angular.dev/) frontend under the apps directory. 

This is a fairly typical setup for ourselves. 

For simplicity authentication and authorisation have been excluded.

## Getting setup

1. Clone down this repo and run `pnpm install`
1. Rename `.env.example` to `.env` and adjust as required
1. Run `docker-compose up -d` if you'd like to use the postgres docker container
1. Run `pnpm db:seed` in the `apps/api` directory to populate the db
1. Run the apps run via `pnpm turbo dev`

## Known Issues
There are a couple of known issues we’d like you to fix, these are marked with `@fixme` comments throughout the application.

1. Fix the slow `/products` request
1. Fix the `productId` not saving when adding a `Task` to a `Product`
1. Complete the `TaskService` tests

## Feature Request
There is also a couple of minor feature request we’d like you to complete. These are marked with `@todo` comments throughout the code.

1. Normalise product properties into their own table, the `/products` api should return data in the same format to avoid the need to update the UI or version the API
1. Add a confirmation dialog to the delete actions
1. Add task management to the product view
