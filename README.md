# Six Degrees of Formula 1

Six Degrees of Formula 1 stores data of drivers and their teammates in a [Memgraph](https://memgraph.com) database. If two given drivers have competed for the same team in at least one race, there's a link between them.

You can enter the names of two drivers and find out how to get from one to the other using as few connections as possible.

## Deployment with Docker

### Prerequisites

- Docker Engine version 27.0.1 or later
- Docker Compose version 2.29.0 or later

### Environment variables

Place the following variables in a `.env` file in the project's root directory:

```env
PUBLIC_NETWORK=your_docker_network_here
DB_URI=bolt://sixdegs-db:7687
DB_USERNAME=memgraph_username_here
DB_PASSWORD=memgraph_password_here
```

You can leave the `DB_URI` variable as-is. If you're deploying this stack for the first time, you probably don't have values for `DB_USERNAME` or `DB_PASSWORD` to fill in for placeholders above. Once you've deployed this stack, see the _Database preparation_ section of this README for further instructions.

Specifying `PUBLIC_NETWORK` is required to put the website behind a reverse proxy, which itself is also containerised and has its own Docker network named `your_docker_network_here` with all the services it forwards requests to.

You may choose to remove the `public` network from the Compose file if you don't have that setup.

### Build and run

```sh
git clone https://github.com/maciejpedzich/six-degs-of-f1.git
# Alternatively: git clone https://git.maciejpedzi.ch/maciejpedzich/six-degs-of-f1.git
cd six-degs-of-f1
docker compose build
docker compose up -d
```

## Deployment without Docker

### Prerequisites

- Node.js version 20.3.0 or later
- Memgraph version 2.18.0 or later

Make sure you've installed and set up the Memgraph database first. If you haven't, see the _Database preparation_ section of this README for setup details.

### Environment variables

Place the following variables in a `.env` file inside the project's root directory:

```env
DB_URI=bolt://db_host_here:db_port_here
DB_USERNAME=memgraph_username_here
DB_PASSWORD=memgraph_password_here
```

### Build and run

```sh
git clone https://github.com/maciejpedzich/six-degs-of-f1.git
# Alternatively: git clone https://git.maciejpedzi.ch/maciejpedzich/six-degs-of-f1.git
cd six-degs-of-f1
npm i
npm run build
node ./dist/server/entry.mjs
```

## Database preparation

Open up your CLI and connect to the database via `mgconsole` by running this command if you're using Docker:

```sh
docker exec -it sixdegs-db mgconsole
```

If you're not using Docker, use this command instead:

```sh
mgconsole --host db_host_here --port db_port_here
```

Create a new user and set a password:

```cypher
CREATE USER `memgraph_username_here` IDENTIFIED BY 'memgraph_password_here'; 
```

Populate the database by executing these queries:

```cypher
LOAD CSV FROM "https://raw.githubusercontent.com/maciejpedzich/six-degs-of-f1/master/data/drivers.csv" WITH HEADER AS row
CREATE (d:Driver {driverId: ToInteger(row.driverId), forename: row.forename, surname: row.surname});

LOAD CSV FROM "https://raw.githubusercontent.com/maciejpedzich/six-degs-of-f1/master/data/teammates.csv" WITH HEADER AS row
MATCH (d:Driver {driverId: ToInteger(row.driverId)})
MATCH (t:Driver {driverId: ToInteger(row.teammateId)})
CREATE (d)-[:WAS_TEAMMATES_WITH]->(t);
```

Exit out of `mgconsole` by pressing `Ctrl/Cmd+C`.

Replace the filler values for `DB_USERNAME` and `DB_PASSWORD` with the username and password of your newly created Memgraph user.

If you're using Docker, restart the Compose stack by running:

```sh
docker compose down
docker compose up -d
```

## Astro Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |
