# Contentre GraphQL Server

This repository contains Apollo GraphQL modular server.

## Preparing

To run this project locally, you will first need Node 14 and Yarn 1.22 already installed.
You'll also need a local PostgreSQL database running, or Docker installed if you prefer to run the database inside a container.

To follow by the container approach, start by running `yarn docker:db` with Docker already running.

## Development

To start a local development server, you first need to:

- Create a `.env` file, and add environment variables using `.env.example` as reference.
- Ensure the `DATABASE_URL` variable pointing to your local PostgreSQL database or to the container's database if using Docker.
- Run `yarn` command to install all dependencies.
- Run `yarn prisma:init` (more explanation bellow) only for the first time you're preparing the database structure.
- Finally, run `yarn start` and await the build process to finish.

Then you can both, use `graphql playground` or point your Postman/Insomnia requests into: http://localhost:9000/graphql.

## Database and Prisma

The PostgreSQL database mapping is done by [Prisma](https://www.prisma.io/). The development workflow can be condensed in some commands bellow:

`yarn prisma:init` should be used when setting up a new database instance (or in cases where the local database is broken for some reason). This command also internally and automatically runs `prisma generate` to regenerating Prisma types based on `prisma.schema`, and also internally and automatically runs `prisma seed` to populate core database tables. **Use with caution:** this command resets everything in the database, performing destructive and irreversible actions in your development data.

`yarn prisma:update` should be used to run new migrations (updates at the database schema level) and get your local database updated without reset or deleting everything. Use it always you get new migrations from a pull. This command should be used whenever possible instead of `prisma:init`.

`yarn prisma:update -n {NAME_OF_THE_MIGRATION}` should be used only by developers wanting to update `prisma.schema`, by creating a new database migration for others to run. The resulting SQL file inside a migration folder should then be pushed to this repository along with the updated schema file. Caution: to keep your own local database up-to-date (if you're not changing the Prisma schema by yourself) just run `yarn prisma:update` after getting the most recent migrations from others.

`yarn prisma:update -n {NAME_OF_THE_MIGRATION} --create-only` should be used as an alternative to the above command for when you want to first generate the `.sql` file inside the new migration folder **without** running it in your local database. This can be useful when you want to make low level changes to the database (like customizing the migration itself, doing data backups before changing tables, seeding new columns for old existing rows, creating database procedures or functions, among many other use cases). After finishing the manual editing to the `.sql`, you can finally run `yarn prisma:update` to apply the migration.

`yarn prisma studio` inits [Prisma Studio](https://www.prisma.io/studio), a visual editor for the data in your database, accessible at http://localhost:5555. Of course, you also can use any other database manager you prefer.

More on Prisma schema workflow can be found at [Developing with Prisma Migrate guide](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate).

## GraphQL Schema

The API GraphQL schema closes to the database schema in many ways, but isn't the same schema. This way the API have full control of what is being transferred to the client and security can be better approached. Because of that, it's also importante to keep API types up-to-date with the GraphQL schema definition.

`yarn graphql:codegen` should be used to regenerate our API types and should be run only by developers that are changing API contracts (i.e. editing the schema inside a module like [users/index.ts](https://github.com/Kaperskyguru/contentre-api/blob/develop/src/modules/users/index.ts)). After running this command, the updated types should be committed into this repository too.

## Google Cloud Storage

We are also using a Google Cloud Storage bucket to supply the application files storage needs. During the development, you'll only need to configure the _Google Cloud Platform_ section of your local `.env` file. Since this is sensitive information, please ask for it directly on our [#tech channel on Slack](https://backend-community.slack.com/archives/C016X3N35RD) if needed.

If you need to change Google Cloud Storage configuration, most of it can be handled directly from the [Google Cloud Storage Console](https://console.cloud.google.com/storage), except for the CORS settings. However, those settings can be changed by using the [Cloud SDK Command Line Interface](https://cloud.google.com/sdk/docs), by following [this guide](https://cloud.google.com/storage/docs/configuring-cors).

## Accessing DB instances from local workstations

Our databases aren't accesible from outside Google Cloud by default, in order to locally access a DB in any environment we'll need to use an Identity-Aware Proxy (IAP) tunnel, SSL port forwarding and SSH on a Virtual Machine as bastion host.

**Step 1:**\
Request a GCP user account with permissions, **Owner** or **Editor** users automatically have access.

**Step 2:**\
Install and configure the Google Cloud SDK https://cloud.google.com/sdk/docs/install

**Step 3:**\
Execute the following command on your terminal replacing the variables in uppercase (ask your team manager for the substitution values). This command opens a tunnel between your computer and the virtual machine on our VPC which in turn can access the database.

```
gcloud compute ssh --zone "VM_ZONE" "VM_NAME" --tunnel-through-iap --project "PROJECT_NAME" -- -L LOCAL_PORT:DB_PRIVATE_IP:DB_PORT
```

**Step 4:**\
Don't close your terminal so the tunnel keeps open.
Configure your DB client (DBeaver or PgAdmin for instance) using the database native authentication:

**Host**: localhost\
**Port**: LOCAL_PORT value from the previous step\
**DB Name**: Ask your team manager\
**DB User**: Ask your team manager\
**DB Password**: Ask your team manager

You'll need to execute the command on step 3 everytime you want to connect to the DB
