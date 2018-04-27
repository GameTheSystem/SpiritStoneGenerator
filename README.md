[![Build Status](https://travis-ci.org/GameTheSystem/SpiritStoneGenerator.svg?branch=master)](https://travis-ci.org/GameTheSystem/SpiritStoneGenerator)

# SpiritStoneGenerator

Generates a looooot of spirit stones.

## How To Run

This project has already been set up via Docker. If you don't want to use Docker you can always clone the repo and run
the code yourself.

- This application expects to use a MySQL database.

### Run Via Docker

This will download and run the Docker image for the Spirit Stone Generator.
```bash
docker pull gamethesystem/spiritstonegenerator
docker run -e DB=mysql://address:port/db_name -e DB_USER=blah -e DB_PASS=blah -d gamethesystem/spiritstonegenerator
```

**Note:** You may have to add network options to the `docker run` command so that the container can see the database 
correctly

### Run Natively

This will clone the repo and install the dependencies locally. It will then start the application after setting the 
relevant env vars.

```bash
git clone https://github.com/GameTheSystem/SpiritStoneGenerator.git
cd SpiritStoneGenerator
npm i
DB_URL=mysql://address:port/db_name DB_USER=blah DB_PASS=blah npm s
```

## How To Interface

Running the application itself is only half of what you need. In order to send commands to the application you need to 
run an interface that will connect to the application.

### Interfaces

You can create your own interface or use one of the two provided. Take a look at the READMEs of these interface repos
for instructions on how to run them.

- TODO Discord bot interface repo link here...
- TODO CLI interface repo link here...
